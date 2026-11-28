import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { getAuthConfig } from './config.js';

export class SupabaseProvider {
  constructor() {
    this._adminClient = null;
  }

  getAdminClient() {
    if (this._adminClient) return this._adminClient;
    const cfg = getAuthConfig();
    if (!cfg.supabaseUrl || !cfg.supabaseServiceRoleKey) {
      throw new InternalServerErrorException(
        'Database connection is not configured on the server.'
      );
    }
    this._adminClient = createClient(cfg.supabaseUrl, cfg.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
    return this._adminClient;
  }

  /**
   * Creates an isolated, non-persisting Supabase client for password verification
   * and session refresh calls so user auth state never mutates the shared admin client.
   */
  createAuthClient() {
    const cfg = getAuthConfig();
    const key = cfg.supabaseAnonKey || cfg.supabaseServiceRoleKey;
    if (!cfg.supabaseUrl || !key) {
      throw new InternalServerErrorException(
        'Authentication service is not configured on the server.'
      );
    }
    return createClient(cfg.supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
}

Injectable()(SupabaseProvider);
