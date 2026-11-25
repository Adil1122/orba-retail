import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseEnvConfig {
  url: string | null;
  anonKey: string | null;
  serviceKey: string | null;
  configured: boolean;
}

export function getSupabaseConfig(): SupabaseEnvConfig {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    null;

  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    null;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || anonKey || null;

  return {
    url: url && url.startsWith('http') ? url : null,
    anonKey: anonKey && anonKey.length > 10 ? anonKey : null,
    serviceKey: serviceKey && serviceKey.length > 10 ? serviceKey : null,
    configured: Boolean(url && url.startsWith('http') && (serviceKey || anonKey)),
  };
}

let cachedServiceClient: SupabaseClient | null = null;
let cachedAuthClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.configured || !cfg.url || !cfg.serviceKey) return null;
  if (!cachedServiceClient) {
    cachedServiceClient = createClient(cfg.url, cfg.serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedServiceClient;
}

export function getSupabaseAuthClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.configured || !cfg.url || !cfg.anonKey) return null;
  if (!cachedAuthClient) {
    cachedAuthClient = createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedAuthClient;
}
