import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../common/rate-limit.guard.js';
import { SupabaseProvider } from '../common/supabase.provider.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { CryptoService } from './crypto.service.js';
import { OtpService } from './otp.service.js';
import { SessionService } from './session.service.js';

export class AuthModule {}

Module({
  controllers: [AuthController],
  providers: [
    SupabaseProvider,
    RateLimitGuard,
    CryptoService,
    OtpService,
    SessionService,
    AuthGuard,
    AuthService,
  ],
  exports: [AuthService, SessionService, AuthGuard],
})(AuthModule);
