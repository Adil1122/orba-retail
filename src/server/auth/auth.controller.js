import { Controller, Inject } from '@nestjs/common';
import { NextResponse } from 'next/server';
import {
  formatExceptionResponse,
  getClientIp,
  getUserAgent,
  parseJsonBody,
} from '../common/http-exception.filter.js';
import { RateLimitGuard } from '../common/rate-limit.guard.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import {
  validateForgotPasswordDto,
  validateLoginDto,
  validateRegisterDto,
  validateResetPasswordDto,
  validateSendRegisterOtpDto,
  validateVerifyOtpDto,
} from './dto/auth.dto.js';
import { SessionService } from './session.service.js';

function jsonNoStore(data, status = 200) {
  return NextResponse.json(
    { ok: true, ...data },
    {
      status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

export class AuthController {
  constructor(authService, sessionService, authGuard, rateLimitGuard) {
    this.authService = authService;
    this.sessionService = sessionService;
    this.authGuard = authGuard;
    this.rateLimitGuard = rateLimitGuard;
  }

  async sendRegisterOtp(request) {
    try {
      const ip = getClientIp(request);
      const userAgent = getUserAgent(request);
      this.rateLimitGuard.consume('register_send_otp_ip', ip, {
        max: 20,
        windowMs: 10 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const { phone } = validateSendRegisterOtpDto(body);

      this.rateLimitGuard.consume('register_send_otp_phone', phone.e164, {
        max: 5,
        windowMs: 10 * 60 * 1000,
      });

      const result = await this.authService.sendRegisterOtp({ phone, ip, userAgent });
      return jsonNoStore(result, 200);
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async verifyRegisterOtp(request) {
    try {
      const ip = getClientIp(request);
      this.rateLimitGuard.consume('register_verify_otp_ip', ip, {
        max: 25,
        windowMs: 10 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const { phone, otp } = validateVerifyOtpDto(body);
      const result = await this.authService.verifyRegisterOtp({ phone, otp });
      return jsonNoStore(result, 200);
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async register(request) {
    try {
      const ip = getClientIp(request);
      const userAgent = getUserAgent(request);
      this.rateLimitGuard.consume('register_complete_ip', ip, {
        max: 10,
        windowMs: 15 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const dto = validateRegisterDto(body);
      const { user, sessionPayload } = await this.authService.register({
        dto,
        ip,
        userAgent,
      });

      const response = jsonNoStore(
        {
          user,
          message: 'Account created and signed in successfully.',
        },
        201
      );
      this.sessionService.setSessionCookie(response, request, sessionPayload);
      return response;
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async login(request) {
    try {
      const ip = getClientIp(request);
      this.rateLimitGuard.consume('login_ip', ip, {
        max: 20,
        windowMs: 15 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const dto = validateLoginDto(body);

      this.rateLimitGuard.consume('login_id', dto.normalizedIdentifier, {
        max: 10,
        windowMs: 15 * 60 * 1000,
        message: 'Too many sign-in attempts. Please wait a few minutes and try again.',
      });

      const { user, sessionPayload } = await this.authService.login({ dto });
      const response = jsonNoStore(
        {
          user,
          message: 'Signed in successfully.',
        },
        200
      );
      this.sessionService.setSessionCookie(response, request, sessionPayload);
      return response;
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async forgotPassword(request) {
    try {
      const ip = getClientIp(request);
      const userAgent = getUserAgent(request);
      this.rateLimitGuard.consume('forgot_pw_ip', ip, {
        max: 15,
        windowMs: 15 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const { phone } = validateForgotPasswordDto(body);

      this.rateLimitGuard.consume('forgot_pw_phone', phone.e164, {
        max: 5,
        windowMs: 15 * 60 * 1000,
      });

      const result = await this.authService.forgotPassword({ phone, ip, userAgent });
      return jsonNoStore(result, 200);
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async verifyForgotPasswordOtp(request) {
    try {
      const ip = getClientIp(request);
      this.rateLimitGuard.consume('forgot_verify_otp_ip', ip, {
        max: 25,
        windowMs: 10 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const { phone, otp } = validateVerifyOtpDto(body);
      const result = await this.authService.verifyForgotPasswordOtp({ phone, otp });
      return jsonNoStore(result, 200);
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async resetPassword(request) {
    try {
      const ip = getClientIp(request);
      this.rateLimitGuard.consume('reset_pw_ip', ip, {
        max: 10,
        windowMs: 15 * 60 * 1000,
      });

      const body = await parseJsonBody(request);
      const dto = validateResetPasswordDto(body);
      const result = await this.authService.resetPassword(dto);

      const response = jsonNoStore(result, 200);
      // Clear any existing session cookie so user signs in fresh with the new password
      this.sessionService.clearSessionCookie(response, request);
      return response;
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async logout(request) {
    try {
      this.sessionService.assertSameOrigin(request);
      await this.sessionService.revokeSession(request);
      const response = jsonNoStore({
        loggedOut: true,
        message: 'Signed out successfully.',
      });
      this.sessionService.clearSessionCookie(response, request);
      return response;
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }

  async me(request) {
    try {
      const authContext = await this.authGuard.canActivate(request);
      const user = await this.authService.buildSafeUserProfile(authContext.user);
      const response = jsonNoStore({ user }, 200);

      // Rotate encrypted cookie if SessionService transparently refreshed the access token
      if (authContext.refreshedSession) {
        this.sessionService.setSessionCookie(
          response,
          request,
          authContext.refreshedSession
        );
      }

      return response;
    } catch (err) {
      return formatExceptionResponse(err);
    }
  }
}

Controller('auth')(AuthController);
Inject(AuthService)(AuthController, undefined, 0);
Inject(SessionService)(AuthController, undefined, 1);
Inject(AuthGuard)(AuthController, undefined, 2);
Inject(RateLimitGuard)(AuthController, undefined, 3);
