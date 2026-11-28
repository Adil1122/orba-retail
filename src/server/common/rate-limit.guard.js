import { Injectable } from '@nestjs/common';
import { TooManyRequestsException } from './http-exception.filter.js';

const GLOBAL_STORE_KEY = '__zyroAuthRateLimitStore';

function getStore() {
  if (!globalThis[GLOBAL_STORE_KEY]) {
    globalThis[GLOBAL_STORE_KEY] = new Map();
  }
  return globalThis[GLOBAL_STORE_KEY];
}

export class RateLimitGuard {
  /**
   * Sliding-window rate limiter guard.
   * @param {string} bucket - Logical endpoint bucket (e.g., 'login', 'register_otp')
   * @param {string} key - Identifier (IP address or normalized phone)
   * @param {{ max: number, windowMs: number, message?: string }} options
   */
  consume(bucket, key, { max, windowMs, message }) {
    const store = getStore();
    const now = Date.now();
    const compositeKey = `${bucket}:${key}`;
    const existing = store.get(compositeKey) || [];
    const recent = existing.filter((ts) => now - ts < windowMs);

    if (recent.length >= max) {
      const oldest = recent[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
      store.set(compositeKey, recent);
      throw new TooManyRequestsException(
        message || `Too many attempts. Please wait ${retryAfterSeconds}s and try again.`,
        retryAfterSeconds
      );
    }

    recent.push(now);
    store.set(compositeKey, recent);

    // Opportunistic pruning so memory stays bounded
    if (store.size > 5000) {
      for (const [k, list] of store.entries()) {
        if (!list.length || now - list[list.length - 1] > 3600000) {
          store.delete(k);
        }
      }
    }
  }
}

Injectable()(RateLimitGuard);
