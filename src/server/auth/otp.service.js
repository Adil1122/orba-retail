import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { getAuthConfig } from '../common/config.js';
import { TooManyRequestsException } from '../common/http-exception.filter.js';
import { SupabaseProvider } from '../common/supabase.provider.js';
import { CryptoService } from './crypto.service.js';

export const OTP_PURPOSES = {
  REGISTER: 'owner_register',
  PASSWORD_RESET: 'password_reset',
};

export class OtpService {
  constructor(supabaseProvider, cryptoService) {
    this.supabase = supabaseProvider;
    this.crypto = cryptoService;
  }

  /**
   * Generates a cryptographically random 6-digit OTP, stores only its salted HMAC hash
   * in public.auth_otp_challenges, invalidates prior pending OTPs for the same phone+purpose,
   * and returns metadata (+ plaintext OTP ONLY when AUTH_OTP_DEMO_MODE is active).
   */
  async issueOtp({ phoneE164, purpose, ip, userAgent, bypassCooldown = false }) {
    const cfg = getAuthConfig();
    const admin = this.supabase.getAdminClient();

    // Enforce resend cooldown on existing recent pending challenges
    if (!bypassCooldown) {
      const { data: recentRows } = await admin
        .from('auth_otp_challenges')
        .select('id, created_at')
        .eq('phone_e164', phoneE164)
        .eq('purpose', purpose)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentRows && recentRows.length > 0) {
        const createdMs = new Date(recentRows[0].created_at).getTime();
        const elapsedSec = Math.floor((Date.now() - createdMs) / 1000);
        const remainingCooldown = cfg.otpResendCooldownSeconds - elapsedSec;
        if (remainingCooldown > 0) {
          throw new TooManyRequestsException(
            `Please wait ${remainingCooldown} seconds before requesting a new code.`,
            remainingCooldown
          );
        }
      }
    }

    // Expire any older active pending challenges for this phone + purpose
    await admin
      .from('auth_otp_challenges')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('phone_e164', phoneE164)
      .eq('purpose', purpose)
      .eq('status', 'pending');

    const otp = this.crypto.generateOtp();
    const salt = this.crypto.generateSalt();
    const otpHash = this.crypto.hashOtp(otp, salt, phoneE164, purpose);
    const expiresAt = new Date(Date.now() + cfg.otpTtlMinutes * 60 * 1000).toISOString();

    const { data, error } = await admin
      .from('auth_otp_challenges')
      .insert({
        phone_e164: phoneE164,
        purpose,
        otp_hash: otpHash,
        otp_salt: salt,
        status: 'pending',
        attempts: 0,
        max_attempts: cfg.otpMaxAttempts,
        expires_at: expiresAt,
        request_ip: ip || null,
        user_agent: userAgent || null,
      })
      .select('id, expires_at')
      .single();

    if (error || !data) {
      throw new InternalServerErrorException('Could not generate verification code.');
    }

    return {
      challengeId: data.id,
      expiresAt: data.expires_at,
      expiresInSeconds: cfg.otpTtlMinutes * 60,
      resendAfterSeconds: cfg.otpResendCooldownSeconds,
      // Strictly return devOtp ONLY when temporary dev demo mode is explicitly enabled
      ...(cfg.otpDemoMode
        ? {
            devOtp: otp,
            demoMode: true,
            demoNotice:
              'Temporary development mode: SMS delivery is not yet connected. Use this verification code to continue.',
          }
        : {}),
    };
  }

  /**
   * Verifies a 6-digit OTP against the latest pending challenge for (phoneE164, purpose).
   * Enforces expiry, attempt limits, single-use, and returns a single-use verification token.
   */
  async verifyOtp({ phoneE164, purpose, otp }) {
    const cfg = getAuthConfig();
    const admin = this.supabase.getAdminClient();

    const { data: challenge, error } = await admin
      .from('auth_otp_challenges')
      .select('*')
      .eq('phone_e164', phoneE164)
      .eq('purpose', purpose)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException('Could not verify code right now.');
    }

    if (!challenge) {
      throw new BadRequestException({
        code: 'OTP_NOT_FOUND',
        message: 'No active verification code found. Please request a new code.',
      });
    }

    const now = Date.now();
    if (new Date(challenge.expires_at).getTime() <= now) {
      await admin
        .from('auth_otp_challenges')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', challenge.id);

      throw new BadRequestException({
        code: 'OTP_EXPIRED',
        message: 'This verification code has expired. Please request a new code.',
      });
    }

    if (challenge.attempts >= challenge.max_attempts) {
      await admin
        .from('auth_otp_challenges')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', challenge.id);

      throw new BadRequestException({
        code: 'OTP_MAX_ATTEMPTS',
        message: 'Too many incorrect attempts. Please request a new verification code.',
        remainingAttempts: 0,
      });
    }

    const expectedHash = this.crypto.hashOtp(
      otp,
      challenge.otp_salt,
      phoneE164,
      purpose
    );
    const isMatch = this.crypto.safeEqualHex(expectedHash, challenge.otp_hash);

    if (!isMatch) {
      const nextAttempts = challenge.attempts + 1;
      const exhausted = nextAttempts >= challenge.max_attempts;
      await admin
        .from('auth_otp_challenges')
        .update({
          attempts: nextAttempts,
          status: exhausted ? 'expired' : 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', challenge.id);

      const remainingAttempts = Math.max(0, challenge.max_attempts - nextAttempts);
      throw new BadRequestException({
        code: exhausted ? 'OTP_MAX_ATTEMPTS' : 'OTP_INVALID',
        message: exhausted
          ? 'Too many incorrect attempts. Please request a new verification code.'
          : `Incorrect verification code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`,
        remainingAttempts,
      });
    }

    const verificationToken = this.crypto.generateToken();
    const verificationTokenHash = this.crypto.hashVerificationToken(
      verificationToken,
      phoneE164,
      purpose
    );
    const nowIso = new Date().toISOString();

    // Atomic transition pending -> verified so the same OTP cannot be verified twice
    const { data: updated, error: updateErr } = await admin
      .from('auth_otp_challenges')
      .update({
        status: 'verified',
        verified_at: nowIso,
        verification_token_hash: verificationTokenHash,
        updated_at: nowIso,
      })
      .eq('id', challenge.id)
      .eq('status', 'pending')
      .select('id')
      .maybeSingle();

    if (updateErr || !updated) {
      throw new BadRequestException({
        code: 'OTP_ALREADY_USED',
        message: 'This verification code has already been used. Please request a new code.',
      });
    }

    return {
      verified: true,
      verificationToken,
      expiresInSeconds: cfg.verificationTokenTtlMinutes * 60,
    };
  }

  /**
   * Atomically validates and consumes a single-use verification token for the exact
   * (phoneE164, purpose) pair. Prevents replay attacks and cross-purpose token reuse.
   */
  async consumeVerificationToken({ phoneE164, purpose, verificationToken }) {
    const cfg = getAuthConfig();
    const admin = this.supabase.getAdminClient();

    const tokenHash = this.crypto.hashVerificationToken(
      verificationToken,
      phoneE164,
      purpose
    );

    const { data: row, error } = await admin
      .from('auth_otp_challenges')
      .select('id, verified_at, status, consumed_at')
      .eq('phone_e164', phoneE164)
      .eq('purpose', purpose)
      .eq('verification_token_hash', tokenHash)
      .eq('status', 'verified')
      .is('consumed_at', null)
      .order('verified_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException('Could not verify session token.');
    }

    if (!row) {
      throw new BadRequestException({
        code: 'INVALID_VERIFICATION_TOKEN',
        message: 'Phone verification is invalid or has already been used. Please verify with a new OTP.',
      });
    }

    const verifiedMs = new Date(row.verified_at).getTime();
    const tokenTtlMs = cfg.verificationTokenTtlMinutes * 60 * 1000;
    if (!Number.isFinite(verifiedMs) || Date.now() - verifiedMs > tokenTtlMs) {
      await admin
        .from('auth_otp_challenges')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', row.id);

      throw new BadRequestException({
        code: 'VERIFICATION_TOKEN_EXPIRED',
        message: 'Your verification has expired. Please request and verify a new OTP.',
      });
    }

    const nowIso = new Date().toISOString();
    const { data: consumed, error: consumeErr } = await admin
      .from('auth_otp_challenges')
      .update({
        status: 'consumed',
        consumed_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', row.id)
      .eq('status', 'verified')
      .is('consumed_at', null)
      .select('id')
      .maybeSingle();

    if (consumeErr || !consumed) {
      throw new BadRequestException({
        code: 'VERIFICATION_TOKEN_USED',
        message: 'This verification has already been used. Please verify with a new OTP.',
      });
    }

    return consumed.id;
  }

  async invalidateChallenges(phoneE164, purpose) {
    const admin = this.supabase.getAdminClient();
    await admin
      .from('auth_otp_challenges')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('phone_e164', phoneE164)
      .eq('purpose', purpose)
      .in('status', ['pending', 'verified']);
  }
}

Injectable()(OtpService);
Inject(SupabaseProvider)(OtpService, undefined, 0);
Inject(CryptoService)(OtpService, undefined, 1);
