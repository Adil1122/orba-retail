import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { StaffUser, WorkspacePayload } from '../types/pos.ts';
import { createInitialWorkspace } from './seed.ts';
import {
  getSupabaseAuthClient,
  getSupabaseConfig,
  getSupabaseServiceClient,
} from './supabase.ts';

interface AuthCredentialRecord {
  userId: string;
  email: string;
  salt: string;
  passwordHash: string;
}

interface PersistedEnvelope {
  workspace: WorkspacePayload;
  credentials: AuthCredentialRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'zyro-store.json');
const SUPABASE_STATE_TABLE = 'zyro_workspace_state';
const SUPABASE_WORKSPACE_KEY = 'default';

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  crypto.createHash('sha256').update(process.cwd() + '_zyro_pos_session_v1').digest('hex');

function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { salt: actualSalt, hash };
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(storedHash, 'hex');
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

export function createSessionToken(user: { id: string; email: string; role: string; name: string }): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyLocalSessionToken(
  token: string
): { id: string; email: string; role: string; name: string } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    return {
      id: parsed.sub,
      email: parsed.email,
      role: parsed.role,
      name: parsed.name,
    };
  } catch {
    return null;
  }
}

class ZyroStore {
  private data: PersistedEnvelope;
  private hydratedFromSupabase = false;

  constructor() {
    this.data = this.loadLocal();
  }

  private createDefaultEnvelope(): PersistedEnvelope {
    const workspace = createInitialWorkspace();
    const defaultPwd = hashPassword('zyro1234');
    const credentials: AuthCredentialRecord[] = workspace.staff.map((s) => ({
      userId: s.id,
      email: s.email.toLowerCase(),
      salt: defaultPwd.salt,
      passwordHash: defaultPwd.hash,
    }));
    return { workspace, credentials };
  }

  private loadLocal(): PersistedEnvelope {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw) as PersistedEnvelope;
        if (parsed && parsed.workspace && Array.isArray(parsed.workspace.products)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to read local store, reinitializing:', err);
    }
    const fresh = this.createDefaultEnvelope();
    this.saveLocal(fresh);
    return fresh;
  }

  private saveLocal(envelope: PersistedEnvelope): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(envelope, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write local store:', err);
    }
  }

  public async ensureHydrated(): Promise<void> {
    if (this.hydratedFromSupabase) return;
    this.hydratedFromSupabase = true;
    const sb = getSupabaseServiceClient();
    if (!sb) return;
    try {
      const { data, error } = await sb
        .from(SUPABASE_STATE_TABLE)
        .select('payload')
        .eq('workspace_key', SUPABASE_WORKSPACE_KEY)
        .maybeSingle();
      if (!error && data?.payload && data.payload.products) {
        this.data.workspace = data.payload as WorkspacePayload;
        this.saveLocal(this.data);
      }
    } catch {
      // Table may not exist yet in user's Supabase project; stay resilient on local + Supabase auth
    }
  }

  public async persist(): Promise<void> {
    this.saveLocal(this.data);
    const sb = getSupabaseServiceClient();
    if (!sb) return;
    try {
      await sb.from(SUPABASE_STATE_TABLE).upsert(
        {
          workspace_key: SUPABASE_WORKSPACE_KEY,
          payload: this.data.workspace,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'workspace_key' }
      );
    } catch {
      // Non-fatal if user's Supabase project uses a custom schema
    }
  }

  public getWorkspace(): WorkspacePayload {
    return this.data.workspace;
  }

  public findStaffByEmail(email: string): StaffUser | undefined {
    const clean = email.trim().toLowerCase();
    return this.data.workspace.staff.find((u) => u.email.toLowerCase() === clean);
  }

  public findStaffById(id: string): StaffUser | undefined {
    return this.data.workspace.staff.find((u) => u.id === id);
  }

  public async loginWithEmailPassword(
    email: string,
    password: string
  ): Promise<{ user: StaffUser; token: string } | null> {
    await this.ensureHydrated();
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase Auth is configured via environment variables, verify with Supabase first
    const sbAuth = getSupabaseAuthClient();
    if (sbAuth) {
      try {
        const { data, error } = await sbAuth.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (!error && data.user && data.session) {
          let staff = this.findStaffByEmail(cleanEmail);
          if (!staff) {
            staff = {
              id: data.user.id,
              name:
                (data.user.user_metadata?.full_name as string) ||
                (data.user.user_metadata?.name as string) ||
                cleanEmail.split('@')[0],
              email: cleanEmail,
              role: 'owner',
              active: true,
              avatarBg: '#EAF2FD',
              avatarFg: '#24398A',
              createdAt: new Date().toISOString(),
            };
            this.data.workspace.staff.push(staff);
            await this.persist();
          }
          return { user: staff, token: data.session.access_token };
        }
      } catch {
        // Fall through to local credential verification if Supabase auth fails or user is local
      }
    }

    // 2. Local credential check
    const cred = this.data.credentials.find((c) => c.email === cleanEmail);
    if (!cred) return null;
    if (!verifyPassword(password, cred.salt, cred.passwordHash)) return null;
    const staff = this.findStaffById(cred.userId);
    if (!staff || !staff.active) return null;
    const token = createSessionToken(staff);
    return { user: staff, token };
  }

  public async registerUser(input: {
    name: string;
    email: string;
    password: string;
    shopName?: string;
    phone?: string;
  }): Promise<{ user: StaffUser; token: string } | { error: string }> {
    await this.ensureHydrated();
    const cleanEmail = input.email.trim().toLowerCase();

    const sbAuth = getSupabaseAuthClient();
    if (sbAuth) {
      try {
        const { data, error } = await sbAuth.auth.signUp({
          email: cleanEmail,
          password: input.password,
          options: {
            data: { full_name: input.name.trim(), shop_name: input.shopName?.trim() },
          },
        });
        if (!error && data.user) {
          const staff: StaffUser = {
            id: data.user.id,
            name: input.name.trim(),
            email: cleanEmail,
            role: 'owner',
            phone: input.phone?.trim() || '',
            active: true,
            avatarBg: '#EAF2FD',
            avatarFg: '#24398A',
            createdAt: new Date().toISOString(),
          };
          if (!this.findStaffByEmail(cleanEmail)) {
            this.data.workspace.staff.push(staff);
          }
          if (input.shopName?.trim()) {
            this.data.workspace.settings.shopName = input.shopName.trim();
          }
          await this.persist();
          const token = data.session?.access_token || createSessionToken(staff);
          return { user: staff, token };
        }
      } catch {
        // Continue to local registration fallback
      }
    }

    if (this.data.credentials.some((c) => c.email === cleanEmail)) {
      return { error: 'An account with this email already exists.' };
    }

    const userId = `usr_${crypto.randomBytes(5).toString('hex')}`;
    const { salt, hash } = hashPassword(input.password);
    const staff: StaffUser = {
      id: userId,
      name: input.name.trim(),
      email: cleanEmail,
      role: 'owner',
      phone: input.phone?.trim() || '',
      active: true,
      avatarBg: '#EAF2FD',
      avatarFg: '#24398A',
      createdAt: new Date().toISOString(),
    };
    this.data.credentials.push({
      userId,
      email: cleanEmail,
      salt,
      passwordHash: hash,
    });
    this.data.workspace.staff.push(staff);
    if (input.shopName?.trim()) {
      this.data.workspace.settings.shopName = input.shopName.trim();
    }
    await this.persist();
    return { user: staff, token: createSessionToken(staff) };
  }

  public async verifyToken(token: string): Promise<StaffUser | null> {
    await this.ensureHydrated();

    // Try local signed token first (fast, zero latency)
    const local = verifyLocalSessionToken(token);
    if (local) {
      const staff = this.findStaffById(local.id) || this.findStaffByEmail(local.email);
      if (staff && staff.active) return staff;
    }

    // Try Supabase JWT verification if Supabase is configured
    const sbService = getSupabaseServiceClient();
    if (sbService) {
      try {
        const { data, error } = await sbService.auth.getUser(token);
        if (!error && data.user?.email) {
          let staff = this.findStaffByEmail(data.user.email);
          if (!staff) {
            staff = {
              id: data.user.id,
              name:
                (data.user.user_metadata?.full_name as string) ||
                data.user.email.split('@')[0],
              email: data.user.email,
              role: 'owner',
              active: true,
              avatarBg: '#EAF2FD',
              avatarFg: '#24398A',
              createdAt: new Date().toISOString(),
            };
            this.data.workspace.staff.push(staff);
            await this.persist();
          }
          return staff;
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  public setStaffPassword(userId: string, email: string, password: string): void {
    const cleanEmail = email.trim().toLowerCase();
    const { salt, hash } = hashPassword(password);
    const existing = this.data.credentials.find((c) => c.userId === userId);
    if (existing) {
      existing.email = cleanEmail;
      existing.salt = salt;
      existing.passwordHash = hash;
    } else {
      this.data.credentials.push({ userId, email: cleanEmail, salt, passwordHash: hash });
    }
  }

  public isSupabaseConnected(): boolean {
    return getSupabaseConfig().configured;
  }
}

export const zyroStore = new ZyroStore();
