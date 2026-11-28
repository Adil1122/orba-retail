import crypto from 'node:crypto';

let cachedFallbackSecret = null;

function parsePositiveInt(val, fallback) {
  const n = Number.parseInt(String(val ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getAuthConfig() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    '';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const isProd = process.env.NODE_ENV === 'production';

  let sessionSecret = process.env.SESSION_SECRET || '';
  if (!sessionSecret) {
    if (isProd) {
      throw new Error('SESSION_SECRET environment variable is required in production.');
    }
    if (!cachedFallbackSecret) {
      // Stable dev-only fallback derived from server key so warm restarts keep dev sessions intact
      const seed = supabaseServiceRoleKey || `zyro-dev-${process.cwd()}`;
      cachedFallbackSecret = crypto
        .createHash('sha256')
        .update(`zyro-session-fallback:${seed}`)
        .digest('hex');
    }
    sessionSecret = cachedFallbackSecret;
  }

  // Strictly gate temporary dev OTP exposure: NEVER enabled in production unless explicitly overridden
  const otpDemoMode =
    process.env.AUTH_OTP_DEMO_MODE === 'true' &&
    (!isProd || process.env.AUTH_OTP_ALLOW_IN_PROD === 'true');

  return {
    isProd,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    sessionSecret,
    otpDemoMode,
    cookieName: process.env.AUTH_COOKIE_NAME || 'zyro_session',
    sessionTtlHours: parsePositiveInt(process.env.AUTH_SESSION_TTL_HOURS, 24),
    rememberTtlDays: parsePositiveInt(process.env.AUTH_REMEMBER_TTL_DAYS, 30),
    otpTtlMinutes: parsePositiveInt(process.env.AUTH_OTP_TTL_MINUTES, 10),
    otpMaxAttempts: parsePositiveInt(process.env.AUTH_OTP_MAX_ATTEMPTS, 5),
    otpResendCooldownSeconds: parsePositiveInt(process.env.AUTH_OTP_RESEND_COOLDOWN_SECONDS, 30),
    verificationTokenTtlMinutes: parsePositiveInt(process.env.AUTH_VERIFY_TOKEN_TTL_MINUTES, 15),
    syntheticEmailDomain: 'phone.zyropos.app',
  };
}
