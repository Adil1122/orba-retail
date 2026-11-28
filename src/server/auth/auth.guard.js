import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service.js';

export class AuthGuard {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  /**
   * Validates the incoming request's HTTP-only session cookie and verifies
   * the user is active (not banned). Throws UnauthorizedException (401) if invalid.
   */
  async canActivate(request) {
    const resolved = await this.sessionService.resolveSession(request);
    if (!resolved || !resolved.user) {
      throw new UnauthorizedException({
        code: 'UNAUTHENTICATED',
        message: 'Authentication required. Please sign in to continue.',
      });
    }

    const bannedUntil = resolved.user.banned_until
      ? new Date(resolved.user.banned_until).getTime()
      : 0;
    if (bannedUntil && bannedUntil > Date.now()) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_DISABLED',
        message: 'This account has been suspended. Please contact your shop administrator.',
      });
    }

    return resolved;
  }
}

Injectable()(AuthGuard);
Inject(SessionService)(AuthGuard, undefined, 0);
