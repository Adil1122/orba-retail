import { BadRequestException } from '@nestjs/common';

const ALLOWED_SHOP_KITS = new Set([
  'clothing',
  'shoes',
  'jewellery',
  'pharmacy',
  'grocery',
  'cosmetics',
  'mobile',
  'other',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normalizes Pakistani mobile numbers into canonical E.164 (+923XXXXXXXXX).
 * Accepts: 03XX-XXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX, with spaces/dashes.
 */
export function normalizePkPhone(raw) {
  const cleaned = String(raw || '').replace(/[^\d+]/g, '').trim();
  let digits = cleaned.replace(/^\+/, '');
  if (digits.startsWith('0092')) digits = digits.slice(4);
  else if (digits.startsWith('92')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);

  if (!/^3\d{9}$/.test(digits)) {
    return { ok: false, digits10: '', e164: '', display: '' };
  }
  return {
    ok: true,
    digits10: digits,
    e164: `+92${digits}`,
    display: `0${digits.slice(0, 3)}-${digits.slice(3)}`,
  };
}

export function sanitizeText(raw, maxLen = 120) {
  return String(raw || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
}

export function validatePasswordStrength(password, phoneDigits10 = '') {
  const pw = String(password || '');
  if (pw.length < 8) {
    throw new BadRequestException({
      code: 'WEAK_PASSWORD',
      message: 'Password must be at least 8 characters long.',
    });
  }
  if (pw.length > 128) {
    throw new BadRequestException({
      code: 'PASSWORD_TOO_LONG',
      message: 'Password must be 128 characters or fewer.',
    });
  }
  if (!/\d/.test(pw)) {
    throw new BadRequestException({
      code: 'WEAK_PASSWORD',
      message: 'Password must include at least one number.',
    });
  }
  if (phoneDigits10) {
    const pwDigits = pw.replace(/\D/g, '');
    if (
      pwDigits === phoneDigits10 ||
      pwDigits === `0${phoneDigits10}` ||
      pwDigits === `92${phoneDigits10}`
    ) {
      throw new BadRequestException({
        code: 'WEAK_PASSWORD',
        message: 'Password cannot be the same as your phone number.',
      });
    }
  }
  return pw;
}

export function validateSendRegisterOtpDto(body) {
  const phone = normalizePkPhone(body?.phone);
  if (!phone.ok) {
    throw new BadRequestException({
      code: 'INVALID_PHONE',
      message: 'Enter a valid Pakistani mobile number (e.g. 0300-1234567).',
    });
  }
  return { phone };
}

export function validateVerifyOtpDto(body) {
  const phone = normalizePkPhone(body?.phone);
  if (!phone.ok) {
    throw new BadRequestException({
      code: 'INVALID_PHONE',
      message: 'Enter a valid Pakistani mobile number.',
    });
  }
  const otp = String(body?.otp || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(otp)) {
    throw new BadRequestException({
      code: 'INVALID_OTP_FORMAT',
      message: 'Enter the 6-digit verification code.',
    });
  }
  return { phone, otp };
}

export function validateRegisterDto(body) {
  const phone = normalizePkPhone(body?.phone);
  if (!phone.ok) {
    throw new BadRequestException({
      code: 'INVALID_PHONE',
      message: 'Enter a valid Pakistani mobile number.',
    });
  }

  const verificationToken = String(body?.verificationToken || '').trim();
  if (!verificationToken || verificationToken.length < 32) {
    throw new BadRequestException({
      code: 'VERIFICATION_REQUIRED',
      message: 'Please verify your phone number with the 6-digit OTP first.',
    });
  }

  const fullName = sanitizeText(body?.fullName || body?.name, 100);
  if (fullName.length < 2) {
    throw new BadRequestException({
      code: 'INVALID_NAME',
      message: 'Enter your full name (at least 2 characters).',
    });
  }

  const emailRaw = sanitizeText(body?.email, 160).toLowerCase();
  if (emailRaw && !EMAIL_RE.test(emailRaw)) {
    throw new BadRequestException({
      code: 'INVALID_EMAIL',
      message: 'Enter a valid email address or leave it blank.',
    });
  }

  const password = validatePasswordStrength(body?.password, phone.digits10);

  if (body?.confirmPassword !== undefined) {
    if (String(body.confirmPassword) !== password) {
      throw new BadRequestException({
        code: 'PASSWORD_MISMATCH',
        message: 'Password and confirm password do not match.',
      });
    }
  }

  const shopName = sanitizeText(body?.shopName || body?.shop, 120);
  if (shopName.length < 2) {
    throw new BadRequestException({
      code: 'INVALID_SHOP_NAME',
      message: 'Enter your shop name (at least 2 characters).',
    });
  }

  const city = sanitizeText(body?.city || 'Lahore', 80) || 'Lahore';
  const area = sanitizeText(body?.area || body?.address || '', 160);
  const branchCount = sanitizeText(body?.branchCount || body?.branches || '1', 16) || '1';
  const rawKit = sanitizeText(body?.shopKit || body?.kit || 'clothing', 32).toLowerCase();
  const shopKit = ALLOWED_SHOP_KITS.has(rawKit) ? rawKit : 'clothing';

  return {
    phone,
    verificationToken,
    fullName,
    email: emailRaw || null,
    password,
    shopName,
    city,
    area,
    branchCount,
    shopKit,
  };
}

export function validateLoginDto(body) {
  const rawIdentifier = sanitizeText(body?.identifier || body?.user || body?.phone || body?.email, 160);
  if (!rawIdentifier) {
    throw new BadRequestException({
      code: 'MISSING_IDENTIFIER',
      message: 'Enter your mobile number or email address.',
    });
  }

  const password = String(body?.password || '');
  if (!password || password.length > 128) {
    throw new BadRequestException({
      code: 'MISSING_PASSWORD',
      message: 'Enter your password.',
    });
  }

  let identifierType = 'phone';
  let normalizedIdentifier = '';

  if (rawIdentifier.includes('@')) {
    const email = rawIdentifier.toLowerCase();
    if (!EMAIL_RE.test(email)) {
      throw new BadRequestException({
        code: 'INVALID_IDENTIFIER',
        message: 'Enter a valid mobile number or email address.',
      });
    }
    identifierType = 'email';
    normalizedIdentifier = email;
  } else {
    const phone = normalizePkPhone(rawIdentifier);
    if (!phone.ok) {
      throw new BadRequestException({
        code: 'INVALID_IDENTIFIER',
        message: 'Enter a valid mobile number (e.g. 0300-1234567) or email address.',
      });
    }
    identifierType = 'phone';
    normalizedIdentifier = phone.e164;
  }

  return {
    identifierType,
    normalizedIdentifier,
    password,
    keepSignedIn: Boolean(body?.keepSignedIn ?? body?.rememberMe),
  };
}

export function validateForgotPasswordDto(body) {
  const phone = normalizePkPhone(body?.phone);
  if (!phone.ok) {
    throw new BadRequestException({
      code: 'INVALID_PHONE',
      message: 'Enter a valid Pakistani mobile number (e.g. 0300-1234567).',
    });
  }
  return { phone };
}

export function validateResetPasswordDto(body) {
  const phone = normalizePkPhone(body?.phone);
  if (!phone.ok) {
    throw new BadRequestException({
      code: 'INVALID_PHONE',
      message: 'Enter a valid Pakistani mobile number.',
    });
  }

  const resetToken = String(body?.resetToken || body?.verificationToken || '').trim();
  if (!resetToken || resetToken.length < 32) {
    throw new BadRequestException({
      code: 'RESET_TOKEN_REQUIRED',
      message: 'Please verify your 6-digit OTP code before setting a new password.',
    });
  }

  const newPassword = validatePasswordStrength(
    body?.newPassword || body?.password,
    phone.digits10
  );

  if (body?.confirmPassword !== undefined) {
    if (String(body.confirmPassword) !== newPassword) {
      throw new BadRequestException({
        code: 'PASSWORD_MISMATCH',
        message: 'New password and confirm password do not match.',
      });
    }
  }

  return {
    phone,
    resetToken,
    newPassword,
  };
}
