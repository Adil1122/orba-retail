/**
 * Client-side Authentication API client for ZYRO Retail POS.
 * All requests include HTTP-only session cookies (`credentials: 'include'`).
 */

async function requestAuth(path, options = {}) {
  const { method = 'GET', body } = options;
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        'X-Requested-With': 'XMLHttpRequest',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Could not reach the server. Please check your connection and try again.',
      },
    };
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || !data?.ok) {
    return {
      ok: false,
      status: res.status,
      error: data?.error || {
        code: 'REQUEST_FAILED',
        message: 'Request could not be completed. Please try again.',
      },
      data,
    };
  }

  return {
    ok: true,
    status: res.status,
    data,
  };
}

export const authApi = {
  sendRegisterOtp(phone) {
    return requestAuth('/api/auth/register/send-otp', {
      method: 'POST',
      body: { phone },
    });
  },

  verifyRegisterOtp(phone, otp) {
    return requestAuth('/api/auth/register/verify-otp', {
      method: 'POST',
      body: { phone, otp },
    });
  },

  register(payload) {
    return requestAuth('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
  },

  login({ identifier, password, keepSignedIn = false }) {
    return requestAuth('/api/auth/login', {
      method: 'POST',
      body: { identifier, password, keepSignedIn },
    });
  },

  forgotPassword(phone) {
    return requestAuth('/api/auth/forgot-password', {
      method: 'POST',
      body: { phone },
    });
  },

  verifyForgotPasswordOtp(phone, otp) {
    return requestAuth('/api/auth/forgot-password/verify-otp', {
      method: 'POST',
      body: { phone, otp },
    });
  },

  resetPassword({ phone, resetToken, newPassword, confirmPassword }) {
    return requestAuth('/api/auth/reset-password', {
      method: 'POST',
      body: { phone, resetToken, newPassword, confirmPassword },
    });
  },

  logout() {
    return requestAuth('/api/auth/logout', {
      method: 'POST',
    });
  },

  me() {
    return requestAuth('/api/auth/me', {
      method: 'GET',
    });
  },
};
