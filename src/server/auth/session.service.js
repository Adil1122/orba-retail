import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { getAuthConfig } from '../common/config.js';
import { SupabaseProvider } from '../common/supabase.provider.js';
import { CryptoService } from './crypto.service.js';

const REVOKED_TOKENS_KEY = '__zyroRevokedSessionHashes';

function getRevokedStore() {
  if (!globalThis[REVOKED_TOKENS_KEY]) {
    globalThis[REVOKED_TOKENS_KEY] = new Map();
  }
  return globalThis[REVOKED_TOKENS_KEY];
}

export class SessionService {
  constructor(supabaseProvider, cryptoService) {
    this.supabase = supabaseProvider;
    this.crypto = cryptoService;
  }

  _isHttpsRequest(request) {
    const proto = request?.headers?.get('x-forwarded-proto') || '';
    if (proto.toLowerCase().includes('https')) return true;
    const url = request?.url || '';
    if (url.startsWith('https://')) return true;
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Builds cookie options compatible with BOTH HTTPS cross-site iframes (AI Studio preview)
   * and plain HTTP localhost development.
   */
  _cookieOptions(request, maxAgeSeconds) {
    const isHttps = this._isHttpsRequest(request);
    return {
      httpOnly: true,
      path: '/',
      maxAge: maxAgeSeconds,
      sameSite: isHttps ? 'none' : 'lax',
      secure: isHttps,
      ...(isHttps ? { partitioned: true } : {}),
    };
  }

  setSessionCookie(response, request, sessionPayload) {
    const cfg = getAuthConfig();
    const keepSignedIn = Boolean(sessionPayload.keepSignedIn);
    const maxAgeSeconds = keepSignedIn
      ? cfg.rememberTtlDays * 24 * 3600
      : cfg.sessionTtlHours * 3600;

    const absoluteExp = sessionPayload.sessionExpiresAt || Date.now() + maxAgeSeconds * 1000;
    const cookieVal = this.crypto.encryptCookiePayload({
      at: sessionPayload.accessToken,
      rt: sessionPayload.refreshToken,
      uid: sessionPayload.userId,
      keep: keepSignedIn,
      exp: absoluteExp,
    });

    response.cookies.set(cfg.cookieName, cookieVal, this._cookieOptions(request, maxAgeSeconds));
  }

  clearSessionCookie(response, request) {
    const cfg = getAuthConfig();
    response.cookies.set(cfg.cookieName, '', this._cookieOptions(request, 0));
  }

  readCookiePayload(request) {
    const cfg = getAuthConfig();
    const raw = request.cookies?.get(cfg.cookieName)?.value;
    if (!raw) return null;
    const parsed = this.crypto.decryptCookiePayload(raw);
    if (!parsed || !parsed.at || !parsed.uid) return null;
    if (parsed.exp && Date.now() > Number(parsed.exp)) return null;
    return parsed;
  }

  markRevoked(accessToken) {
    if (!accessToken) return;
    const store = getRevokedStore();
    const hash = this.crypto.hashRawToken(accessToken);
    store.set(hash, Date.now());
    if (store.size > 5000) {
      const cutoff = Date.now() - 24 * 3600 * 1000;
      for (const [k, ts] of store.entries()) {
        if (ts < cutoff) store.delete(k);
      }
    }
  }

  isRevoked(accessToken) {
    if (!accessToken) return true;
    const hash = this.crypto.hashRawToken(accessToken);
    return getRevokedStore().has(hash);
  }

  /**
   * Validates the encrypted HTTP-only session cookie against Supabase Auth server-side.
   * Automatically refreshes expired access tokens using the stored refresh token
   * while respecting absolute session expiry and server-side revocation.
   */
  async resolveSession(request) {
    const payload = this.readCookiePayload(request);
    if (!payload) return null;
    if (this.isRevoked(payload.at)) return null;

    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin.auth.getUser(payload.at);

    if (!error && data?.user) {
      return {
        user: data.user,
        accessToken: payload.at,
        refreshToken: payload.rt,
        keepSignedIn: Boolean(payload.keep),
        sessionExpiresAt: payload.exp,
        refreshedSession: null,
      };
    }

    // Attempt transparent refresh if access token expired but refresh token is still valid
    if (payload.rt) {
      const authClient = this.supabase.createAuthClient();
      const { data: refData, error: refErr } = await authClient.auth.refreshSession({
        refresh_token: payload.rt,
      });

      if (!refErr && refData?.session?.access_token && refData?.user) {
        return {
          user: refData.user,
          accessToken: refData.session.access_token,
          refreshToken: refData.session.refresh_token || payload.rt,
          keepSignedIn: Boolean(payload.keep),
          sessionExpiresAt: payload.exp,
          refreshedSession: {
            accessToken: refData.session.access_token,
            refreshToken: refData.session.refresh_token || payload.rt,
            userId: refData.user.id,
            keepSignedIn: Boolean(payload.keep),
            sessionExpiresAt: payload.exp,
          },
        };
      }
    }

    return null;
  }

  async revokeSession(request) {
    const payload = this.readCookiePayload(request);
    if (!payload) return;
    this.markRevoked(payload.at);
    try {
      const admin = this.supabase.getAdminClient();
      await admin.auth.admin.signOut(payload.at, 'local');
    } catch {
      // Best-effort remote revocation; local revocation + cookie clearing still apply
    }
  }

  /**
   * Lightweight CSRF check for cookie-authenticated state-changing requests.
   * Rejects cross-origin browser requests when an Origin header is supplied.
   */
  assertSameOrigin(request) {
    const origin = request.headers.get('origin');
    if (!origin) return;
    const host =
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host') ||
      '';
    if (!host) return;
    try {
      const originHost = new URL(origin).host;
      if (originHost.toLowerCase() !== host.toLowerCase()) {
        throw new ForbiddenException({
          code: 'CSRF_ORIGIN_MISMATCH',
          message: 'Cross-origin request rejected.',
        });
      }
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new ForbiddenException({
        code: 'CSRF_ORIGIN_MISMATCH',
        message: 'Invalid request origin.',
      });
    }
  }
}

Injectable()(SessionService);
Inject(SupabaseProvider)(SessionService, undefined, 0);
Inject(CryptoService)(SessionService, undefined, 1);
