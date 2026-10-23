import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { User, StoredUser, Order } from '@/types';
import { getAllOrders } from './index';

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUTH_SECRET = process.env.CRON_SECRET || 'warung_design_auth_secret_key_98765';

function ensureUsersFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify({}), 'utf-8');
    }
  } catch (e) {
    console.error('Error ensuring users file:', e);
  }
}

function getLocalUsersMap(): Map<string, StoredUser> {
  const map = new Map<string, StoredUser>();
  try {
    ensureUsersFile();
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const obj = JSON.parse(raw || '{}');
      for (const [key, val] of Object.entries(obj)) {
        map.set(key, val as StoredUser);
      }
    }
  } catch (e) {
    console.error('Error reading local users map:', e);
  }
  return map;
}

function saveLocalUser(user: StoredUser) {
  try {
    ensureUsersFile();
    let obj: Record<string, StoredUser> = {};
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      obj = JSON.parse(raw || '{}');
    }
    obj[user.id] = user;
    fs.writeFileSync(USERS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving local user to file:', e);
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

/**
 * Register a new user
 */
export async function registerUser(payload: {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
}): Promise<User> {
  const email = payload.email.trim().toLowerCase();
  const name = payload.name.trim();
  const phone = payload.phone?.trim() || null;

  if (!email || !email.includes('@')) {
    throw new Error('Alamat email tidak valid');
  }
  if (!payload.password || payload.password.length < 6) {
    throw new Error('Password minimal harus 6 karakter');
  }
  if (!name) {
    throw new Error('Nama lengkap wajib diisi');
  }

  // Check if user already exists
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('Email sudah terdaftar. Silakan masuk menggunakan akun Anda.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const password_hash = hashPassword(payload.password, salt);
  const now = new Date().toISOString();
  const userId = crypto.randomUUID();

  const storedUser: StoredUser = {
    id: userId,
    name,
    email,
    phone,
    password_hash,
    salt,
    created_at: now,
  };

  // 1. Try saving to Supabase if table exists
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from('users').insert({
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone,
        password_hash: storedUser.password_hash,
        salt: storedUser.salt,
        created_at: storedUser.created_at,
      });
    } catch {
      // ignore, local save is primary backup
    }
  }

  // 2. Always persist locally for reliable resilience
  saveLocalUser(storedUser);

  return {
    id: storedUser.id,
    name: storedUser.name,
    email: storedUser.email,
    phone: storedUser.phone,
    created_at: storedUser.created_at,
  };
}

/**
 * Find user by email
 */
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // Try Supabase first
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (!error && data) {
        return data as StoredUser;
      }
    } catch {
      // fallback to local
    }
  }

  // Check local file
  const localMap = getLocalUsersMap();
  for (const user of localMap.values()) {
    if (user.email === normalizedEmail) {
      return user;
    }
  }

  return null;
}

/**
 * Find user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, created_at')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return data as User;
      }
    } catch {
      // fallback
    }
  }

  const localMap = getLocalUsersMap();
  const local = localMap.get(id);
  if (local) {
    return {
      id: local.id,
      name: local.name,
      email: local.email,
      phone: local.phone,
      created_at: local.created_at,
    };
  }

  return null;
}

/**
 * Verify user password and return user object
 */
export async function authenticateUser(email: string, password: string): Promise<User> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Email atau password tidak sesuai.');
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.password_hash) {
    throw new Error('Email atau password tidak sesuai.');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    created_at: user.created_at,
  };
}

/**
 * Generate HMAC session token
 */
export function createSessionToken(user: User): string {
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify HMAC session token
 */
export function verifySessionToken(token: string): { userId: string; name: string; email: string } | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (!payload.exp || payload.exp < Date.now()) return null;

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

/**
 * Get all orders for a specific user (by userId or buyer_email)
 */
export async function getUserOrders(userEmail: string, userId?: string): Promise<Order[]> {
  const allOrders = await getAllOrders();
  const normalizedEmail = userEmail.trim().toLowerCase();

  return allOrders.filter((o) => {
    const matchEmail = (o.buyer_email || '').trim().toLowerCase() === normalizedEmail;
    const matchUserId = Boolean(userId && o.user_id && o.user_id === userId);
    return matchEmail || matchUserId;
  });
}
