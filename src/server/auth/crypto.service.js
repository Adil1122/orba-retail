import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { getAuthConfig } from '../common/config.js';

export class CryptoService {
  _getKey(namespace) {
    const { sessionSecret } = getAuthConfig();
    return crypto
      .createHash('sha256')
      .update(`${namespace}:${sessionSecret}`)
      .digest();
  }

  generateOtp() {
    return String(crypto.randomInt(100000, 1000000));
  }

  generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashOtp(otp, salt, phoneE164, purpose) {
    const key = this._getKey('otp-hmac-v1');
    return crypto
      .createHmac('sha256', key)
      .update(`${purpose}:${phoneE164}:${salt}:${otp}`)
      .digest('hex');
  }

  hashVerificationToken(token, phoneE164, purpose) {
    const key = this._getKey('verify-token-hmac-v1');
    return crypto
      .createHmac('sha256', key)
      .update(`${purpose}:${phoneE164}:${token}`)
      .digest('hex');
  }

  hashRawToken(token) {
    return crypto.createHash('sha256').update(String(token || '')).digest('hex');
  }

  safeEqualHex(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length || a.length === 0) return false;
    try {
      const bufA = Buffer.from(a, 'hex');
      const bufB = Buffer.from(b, 'hex');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }

  async dummyPasswordCompare(password) {
    // Constant-time mitigation when login identifier does not match any account
    const dummyHash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8hG6rQ1a8N3bK6o3gP6v2gK2jY4dXe';
    try {
      await bcrypt.compare(String(password || ''), dummyHash);
    } catch {
      // ignore
    }
  }

  encryptCookiePayload(payloadObj) {
    const key = this._getKey('cookie-aes-256-gcm-v1');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const plaintext = Buffer.from(JSON.stringify(payloadObj), 'utf8');
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
  }

  decryptCookiePayload(cookieValue) {
    if (!cookieValue || typeof cookieValue !== 'string') return null;
    const parts = cookieValue.split('.');
    if (parts.length !== 3) return null;
    try {
      const key = this._getKey('cookie-aes-256-gcm-v1');
      const iv = Buffer.from(parts[0], 'base64url');
      const tag = Buffer.from(parts[1], 'base64url');
      const ciphertext = Buffer.from(parts[2], 'base64url');
      if (iv.length !== 12 || tag.length !== 16) return null;
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);
      const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      const parsed = JSON.parse(decrypted.toString('utf8'));
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch {
      return null;
    }
  }
}

Injectable()(CryptoService);
