import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { getAuthConfig } from '../common/config.js';
import { SupabaseProvider } from '../common/supabase.provider.js';
import { CryptoService } from './crypto.service.js';
import { OTP_PURPOSES, OtpService } from './otp.service.js';

function mapUiRole(roleName) {
  const r = String(roleName || '').toLowerCase();
  if (r === 'cashier') return 'cashier';
  if (r === 'inventory' || r === 'stockkeeper' || r === 'stock_keeper' || r === 'stock') {
    return 'inventory';
  }
  return 'owner';
}

function buildInitials(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'ZR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export class AuthService {
  constructor(supabaseProvider, cryptoService, otpService) {
    this.supabase = supabaseProvider;
    this.crypto = cryptoService;
    this.otp = otpService;
  }

  _syntheticEmailForPhone(digits10) {
    const { syntheticEmailDomain } = getAuthConfig();
    return `92${digits10}@${syntheticEmailDomain}`;
  }

  _isSyntheticEmail(email) {
    const { syntheticEmailDomain } = getAuthConfig();
    return typeof email === 'string' && email.toLowerCase().endsWith(`@${syntheticEmailDomain}`);
  }

  async _findProfileByPhone(phone) {
    const admin = this.supabase.getAdminClient();
    const candidates = [phone.e164, `0${phone.digits10}`, phone.digits10, `92${phone.digits10}`];
    const { data, error } = await admin
      .from('user_profiles')
      .select('id, full_name, short_name, phone, avatar_url, avatar_bg, avatar_fg')
      .in('phone', candidates)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException('Unable to query user accounts.');
    }
    return data || null;
  }

  async _isPhoneRegistered(phone) {
    const profile = await this._findProfileByPhone(phone);
    if (profile) return true;

    // Fallback check against synthetic phone email in Supabase Auth
    const admin = this.supabase.getAdminClient();
    const { data: biz } = await admin
      .from('businesses')
      .select('id')
      .eq('phone', phone.e164)
      .is('deleted_at', null)
      .limit(1)
      .maybeSingle();

    // Only treat business phone as registered if an actual user_profile or auth user owns it
    if (biz) {
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const synth = this._syntheticEmailForPhone(phone.digits10);
      const match = (list?.users || []).find(
        (u) =>
          u.phone === phone.e164 ||
          u.phone === `92${phone.digits10}` ||
          (u.email && u.email.toLowerCase() === synth)
      );
      if (match) return true;
    }

    return false;
  }

  /**
   * Builds a strictly safe user profile with business, role, and branches.
   * Never includes password hashes, OTP hashes, or raw auth tokens.
   */
  async buildSafeUserProfile(authUser) {
    const admin = this.supabase.getAdminClient();
    const userId = authUser.id;

    const { data: profile } = await admin
      .from('user_profiles')
      .select('id, full_name, short_name, phone, avatar_url, avatar_bg, avatar_fg')
      .eq('id', userId)
      .maybeSingle();

    const { data: memberships } = await admin
      .from('business_members')
      .select(
        'id, business_id, status, role_id, roles(id, name, display_name), businesses(id, name, phone, email, currency, timezone, shop_kit, status)'
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('joined_at', { ascending: true });

    const allMemberships = memberships || [];
    const activeMembership = allMemberships.find(
      (m) => m.status === 'active' && (!m.businesses || m.businesses.status === 'active')
    );

    if (allMemberships.length > 0 && !activeMembership) {
      throw new ForbiddenException({
        code: 'ACCOUNT_INACTIVE',
        message: 'Your account is currently inactive. Please contact your shop administrator.',
      });
    }

    const membership = activeMembership || null;
    const business = membership?.businesses || null;
    const roleRecord = membership?.roles || null;

    let branches = [];
    if (business?.id) {
      const { data: branchRows } = await admin
        .from('branches')
        .select('id, name, code, city, address, phone, is_main, is_active')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('is_main', { ascending: false })
        .order('created_at', { ascending: true });
      branches = branchRows || [];
    }

    const primaryBranch = branches.find((b) => b.is_main) || branches[0] || null;
    const fullName =
      profile?.full_name ||
      authUser.user_metadata?.full_name ||
      'Shop Owner';
    const shortName = profile?.short_name || fullName.split(/\s+/)[0] || fullName;
    const publicEmail =
      authUser.email && !this._isSyntheticEmail(authUser.email)
        ? authUser.email
        : business?.email || null;

    return {
      id: userId,
      fullName,
      shortName,
      initials: buildInitials(fullName),
      phone: profile?.phone || authUser.phone || authUser.user_metadata?.phone || null,
      email: publicEmail,
      avatarUrl: profile?.avatar_url || null,
      avatarBg: profile?.avatar_bg || '#162660',
      avatarFg: profile?.avatar_fg || '#FFFFFF',
      status: membership?.status || 'active',
      role: mapUiRole(roleRecord?.name),
      roleName: roleRecord?.name || 'owner',
      roleDisplayName: roleRecord?.display_name || 'Owner',
      business: business
        ? {
            id: business.id,
            name: business.name,
            phone: business.phone,
            currency: business.currency || 'PKR',
            timezone: business.timezone || 'Asia/Karachi',
            shopKit: business.shop_kit || 'clothing',
            status: business.status || 'active',
          }
        : null,
      branch: primaryBranch
        ? {
            id: primaryBranch.id,
            name: primaryBranch.name,
            city: primaryBranch.city || null,
            address: primaryBranch.address || null,
            isMain: Boolean(primaryBranch.is_main),
          }
        : null,
      branches: branches.map((b) => ({
        id: b.id,
        name: b.name,
        city: b.city || null,
        address: b.address || null,
        isMain: Boolean(b.is_main),
      })),
    };
  }

  /**
   * Step 1 of Registration: Validate phone, ensure not registered, issue OTP.
   */
  async sendRegisterOtp({ phone, ip, userAgent }) {
    const alreadyExists = await this._isPhoneRegistered(phone);
    if (alreadyExists) {
      throw new ConflictException({
        code: 'PHONE_ALREADY_REGISTERED',
        message: 'This mobile number is already registered with ZYRO. Please sign in instead.',
      });
    }

    const issued = await this.otp.issueOtp({
      phoneE164: phone.e164,
      purpose: OTP_PURPOSES.REGISTER,
      ip,
      userAgent,
    });

    return {
      sent: true,
      phone: phone.e164,
      phoneDisplay: phone.display,
      message: 'Verification code generated.',
      expiresInSeconds: issued.expiresInSeconds,
      resendAfterSeconds: issued.resendAfterSeconds,
      ...(issued.devOtp
        ? {
            devOtp: issued.devOtp,
            demoMode: true,
            demoNotice: issued.demoNotice,
          }
        : {}),
    };
  }

  /**
   * Step 2 of Registration: Verify 6-digit OTP and issue single-use verification token.
   */
  async verifyRegisterOtp({ phone, otp }) {
    const result = await this.otp.verifyOtp({
      phoneE164: phone.e164,
      purpose: OTP_PURPOSES.REGISTER,
      otp,
    });

    return {
      verified: true,
      phone: phone.e164,
      verificationToken: result.verificationToken,
      expiresInSeconds: result.expiresInSeconds,
    };
  }

  /**
   * Step 3 of Registration: Consume single-use verification token, create auth user,
   * provision business workspace atomically via existing RPC, and start authenticated session.
   */
  async register({ dto, ip, userAgent }) {
    const admin = this.supabase.getAdminClient();

    // Verify phone is not already registered before consuming token
    const alreadyExists = await this._isPhoneRegistered(dto.phone);
    if (alreadyExists) {
      throw new ConflictException({
        code: 'PHONE_ALREADY_REGISTERED',
        message: 'This mobile number is already registered with ZYRO. Please sign in instead.',
      });
    }

    // Atomically validate and consume single-use registration verification token
    await this.otp.consumeVerificationToken({
      phoneE164: dto.phone.e164,
      purpose: OTP_PURPOSES.REGISTER,
      verificationToken: dto.verificationToken,
    });

    const authEmail = dto.email || this._syntheticEmailForPhone(dto.phone.digits10);
    const shortName = dto.fullName.split(/\s+/)[0] || dto.fullName;

    // 1. Create Supabase Auth user (stores bcrypt-hashed password inside auth.users)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: authEmail,
      phone: dto.phone.e164,
      password: dto.password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: dto.fullName,
        phone: dto.phone.e164,
        email_verified: true,
      },
    });

    if (createErr || !created?.user) {
      const msg = String(createErr?.message || '');
      if (/already been registered|already exists|duplicate/i.test(msg)) {
        throw new ConflictException({
          code: 'ACCOUNT_ALREADY_EXISTS',
          message: dto.email
            ? 'An account with this email or mobile number already exists. Please sign in instead.'
            : 'This mobile number is already registered. Please sign in instead.',
        });
      }
      throw new InternalServerErrorException('Could not create your account. Please try again.');
    }

    const userId = created.user.id;

    // 2. Provision owner workspace atomically using existing DB RPC
    const workspacePayload = {
      full_name: dto.fullName,
      short_name: shortName,
      phone: dto.phone.e164,
      email: dto.email || null,
      shop_name: dto.shopName,
      shop_kit: dto.shopKit,
      city: dto.city,
      area: dto.area || null,
      address: dto.area || null,
      branch_name: 'Main branch',
      branch_count: dto.branchCount,
    };

    const { error: rpcErr } = await admin.rpc('provision_owner_workspace_for_user', {
      p_user_id: userId,
      p_payload: workspacePayload,
    });

    if (rpcErr) {
      // Roll back auth user so no orphan account remains on failure
      await admin.auth.admin.deleteUser(userId).catch(() => {});
      throw new InternalServerErrorException(
        'Could not set up your shop workspace. Please try again.'
      );
    }

    // 3. Establish an authenticated session via Supabase Auth signInWithPassword
    const authClient = this.supabase.createAuthClient();
    const { data: signInData, error: signInErr } = await authClient.auth.signInWithPassword({
      email: authEmail,
      password: dto.password,
    });

    if (signInErr || !signInData?.session?.access_token) {
      throw new InternalServerErrorException(
        'Account created, but could not start session automatically. Please sign in.'
      );
    }

    const safeUser = await this.buildSafeUserProfile(signInData.user);

    return {
      user: safeUser,
      sessionPayload: {
        accessToken: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
        userId: signInData.user.id,
        keepSignedIn: true,
        ip,
        userAgent,
      },
    };
  }

  /**
   * Login with normalized phone number OR email + password.
   * Always returns generic error messages to avoid leaking account existence.
   */
  async login({ dto }) {
    const admin = this.supabase.getAdminClient();
    const authClient = this.supabase.createAuthClient();

    const genericInvalid = () =>
      new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid mobile number/email or password.',
      });

    let authEmail = null;

    if (dto.identifierType === 'email') {
      authEmail = dto.normalizedIdentifier;
    } else {
      const digits10 = dto.normalizedIdentifier.replace(/^\+92/, '');
      const profile = await this._findProfileByPhone({
        e164: dto.normalizedIdentifier,
        digits10,
      });

      if (profile?.id) {
        const { data: userRes } = await admin.auth.admin.getUserById(profile.id);
        authEmail = userRes?.user?.email || null;
      }

      if (!authEmail) {
        // Fallback: try synthetic phone email directly
        authEmail = this._syntheticEmailForPhone(digits10);
      }
    }

    if (!authEmail) {
      await this.crypto.dummyPasswordCompare(dto.password);
      throw genericInvalid();
    }

    const { data: signInData, error: signInErr } = await authClient.auth.signInWithPassword({
      email: authEmail,
      password: dto.password,
    });

    if (signInErr || !signInData?.session?.access_token || !signInData?.user) {
      const errMsg = String(signInErr?.message || '');
      if (/banned|disabled|suspended/i.test(errMsg)) {
        throw new ForbiddenException({
          code: 'ACCOUNT_DISABLED',
          message: 'Your account is currently disabled. Please contact your shop administrator.',
        });
      }
      throw genericInvalid();
    }

    const bannedUntil = signInData.user.banned_until
      ? new Date(signInData.user.banned_until).getTime()
      : 0;
    if (bannedUntil && bannedUntil > Date.now()) {
      throw new ForbiddenException({
        code: 'ACCOUNT_DISABLED',
        message: 'Your account is currently disabled. Please contact your shop administrator.',
      });
    }

    const safeUser = await this.buildSafeUserProfile(signInData.user);

    return {
      user: safeUser,
      sessionPayload: {
        accessToken: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
        userId: signInData.user.id,
        keepSignedIn: dto.keepSignedIn,
      },
    };
  }

  /**
   * Step 1 of Forgot Password: Lookup phone silently, issue password_reset OTP if active user exists,
   * and ALWAYS return a generic message that does not reveal account existence.
   */
  async forgotPassword({ phone, ip, userAgent }) {
    const admin = this.supabase.getAdminClient();
    const profile = await this._findProfileByPhone(phone);

    const genericMessage =
      'If an account is registered with this mobile number, a 6-digit verification code has been generated.';

    if (!profile?.id) {
      return {
        sent: true,
        phone: phone.e164,
        message: genericMessage,
      };
    }

    const { data: userRes } = await admin.auth.admin.getUserById(profile.id);
    const authUser = userRes?.user;
    const isBanned =
      authUser?.banned_until && new Date(authUser.banned_until).getTime() > Date.now();

    if (!authUser || isBanned) {
      return {
        sent: true,
        phone: phone.e164,
        message: genericMessage,
      };
    }

    const issued = await this.otp.issueOtp({
      phoneE164: phone.e164,
      purpose: OTP_PURPOSES.PASSWORD_RESET,
      ip,
      userAgent,
    });

    return {
      sent: true,
      phone: phone.e164,
      message: genericMessage,
      expiresInSeconds: issued.expiresInSeconds,
      resendAfterSeconds: issued.resendAfterSeconds,
      ...(issued.devOtp
        ? {
            devOtp: issued.devOtp,
            demoMode: true,
            demoNotice: issued.demoNotice,
          }
        : {}),
    };
  }

  /**
   * Step 2 of Forgot Password: Verify 6-digit reset OTP and issue single-use reset token.
   */
  async verifyForgotPasswordOtp({ phone, otp }) {
    const result = await this.otp.verifyOtp({
      phoneE164: phone.e164,
      purpose: OTP_PURPOSES.PASSWORD_RESET,
      otp,
    });

    return {
      verified: true,
      phone: phone.e164,
      resetToken: result.verificationToken,
      verificationToken: result.verificationToken,
      expiresInSeconds: result.expiresInSeconds,
    };
  }

  /**
   * Step 3 of Forgot Password: Consume single-use reset token and update user password securely.
   */
  async resetPassword({ phone, resetToken, newPassword }) {
    const admin = this.supabase.getAdminClient();

    // Atomically validate and consume single-use password_reset verification token
    await this.otp.consumeVerificationToken({
      phoneE164: phone.e164,
      purpose: OTP_PURPOSES.PASSWORD_RESET,
      verificationToken: resetToken,
    });

    const profile = await this._findProfileByPhone(phone);
    if (!profile?.id) {
      throw new BadRequestException({
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Could not complete password reset for this account.',
      });
    }

    const { error: updateErr } = await admin.auth.admin.updateUserById(profile.id, {
      password: newPassword,
    });

    if (updateErr) {
      throw new InternalServerErrorException(
        'Could not update your password right now. Please try again.'
      );
    }

    // Invalidate any remaining reset challenges for this phone
    await this.otp.invalidateChallenges(phone.e164, OTP_PURPOSES.PASSWORD_RESET);

    return {
      reset: true,
      message: 'Your password has been updated. Please sign in with your new password.',
    };
  }
}

Injectable()(AuthService);
Inject(SupabaseProvider)(AuthService, undefined, 0);
Inject(CryptoService)(AuthService, undefined, 1);
Inject(OtpService)(AuthService, undefined, 2);
