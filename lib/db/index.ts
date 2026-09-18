import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { INITIAL_BUNDLES } from '@/lib/data/bundles';
import { Bundle, Order, CreateOrderPayload, OrderStatus } from '@/types';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify({}), 'utf-8');
    }
  } catch (e) {
    console.error('Error ensuring data dir:', e);
  }
}

function getLocalOrdersMap(): Map<string, Order> {
  const map = new Map<string, Order>();
  try {
    ensureDataFile();
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const obj = JSON.parse(raw || '{}');
      for (const [key, val] of Object.entries(obj)) {
        map.set(key, val as Order);
      }
    }
  } catch (e) {
    console.error('Error reading local orders map:', e);
  }
  return map;
}

function saveLocalOrder(order: Order) {
  try {
    ensureDataFile();
    let obj: Record<string, Order> = {};
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      obj = JSON.parse(raw || '{}');
    }
    obj[order.id] = order;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving local order to file:', e);
  }
}

/**
 * Get all active bundles
 */
export async function getBundles(): Promise<Bundle[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Bundle[];
    }
  }

  // Fallback to initial bundles
  return INITIAL_BUNDLES;
}

/**
 * Get single bundle by slug
 */
export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      return data as Bundle;
    }
  }

  const bundle = INITIAL_BUNDLES.find((b) => b.slug === slug);
  return bundle || null;
}

/**
 * Get single bundle by ID
 */
export async function getBundleById(id: string): Promise<Bundle | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return data as Bundle;
    }
  }

  const bundle = INITIAL_BUNDLES.find((b) => b.id === id);
  return bundle || null;
}

/**
 * Generate a unique 3-digit code (100-999) that doesn't conflict with existing active orders
 */
async function generateUniqueCode(basePrice: number): Promise<{ uniqueCode: number; total: number }> {
  let uniqueCode = Math.floor(Math.random() * 900) + 100;
  let total = basePrice + uniqueCode;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    let attempts = 0;
    while (attempts < 10) {
      const { data } = await supabase
        .from('orders')
        .select('id')
        .eq('total_amount', total)
        .in('status', ['pending', 'menunggu_verifikasi'])
        .limit(1);

      if (!data || data.length === 0) {
        break;
      }
      uniqueCode = Math.floor(Math.random() * 900) + 100;
      total = basePrice + uniqueCode;
      attempts++;
    }
  } else {
    // Check local disk-backed store
    const map = getLocalOrdersMap();
    for (const order of map.values()) {
      if (
        (order.status === 'pending' || order.status === 'menunggu_verifikasi') &&
        order.total_amount === total
      ) {
        uniqueCode = Math.floor(Math.random() * 900) + 100;
        total = basePrice + uniqueCode;
      }
    }
  }

  return { uniqueCode, total };
}

/**
 * Create a new order
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const bundle = await getBundleById(payload.bundle_id);
  if (!bundle) {
    throw new Error('Bundle tidak ditemukan');
  }

  const { uniqueCode, total } = await generateUniqueCode(bundle.price);
  const orderId = crypto.randomUUID();
  const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const newOrder: Order = {
    id: orderId,
    order_code: orderCode,
    bundle_id: bundle.id,
    buyer_name: payload.buyer_name.trim(),
    buyer_email: payload.buyer_email.trim().toLowerCase(),
    buyer_phone: payload.buyer_phone ? payload.buyer_phone.trim() : null,
    sender_name: null,
    base_price: bundle.price,
    unique_code: uniqueCode,
    total_amount: total,
    status: 'pending',
    telegram_message_id: null,
    download_token: null,
    download_expires_at: null,
    created_at: now.toISOString(),
    verified_at: null,
    expires_at: expiresAt.toISOString(),
    bundle,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from('orders').insert({
      id: newOrder.id,
      order_code: newOrder.order_code,
      bundle_id: newOrder.bundle_id,
      buyer_name: newOrder.buyer_name,
      buyer_email: newOrder.buyer_email,
      buyer_phone: newOrder.buyer_phone,
      base_price: newOrder.base_price,
      unique_code: newOrder.unique_code,
      total_amount: newOrder.total_amount,
      status: newOrder.status,
      created_at: newOrder.created_at,
      expires_at: newOrder.expires_at,
    });

    if (error) {
      console.error('Supabase insert order error:', error);
      saveLocalOrder(newOrder);
    }
  } else {
    saveLocalOrder(newOrder);
  }

  return newOrder;
}

/**
 * Get order by ID with bundle details
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, bundles(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      const order: Order = {
        ...data,
        bundle: data.bundles || (await getBundleById(data.bundle_id)),
      };
      return order;
    }
  }

  const map = getLocalOrdersMap();
  const localOrder = map.get(id);
  if (localOrder) {
    if (!localOrder.bundle) {
      localOrder.bundle = (await getBundleById(localOrder.bundle_id)) || undefined;
    }
    return localOrder;
  }

  return null;
}

/**
 * Get order by order_code
 */
export async function getOrderByCode(code: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, bundles(*)')
      .eq('order_code', code)
      .single();

    if (!error && data) {
      return {
        ...data,
        bundle: data.bundles || (await getBundleById(data.bundle_id)),
      };
    }
  }

  const map = getLocalOrdersMap();
  for (const order of map.values()) {
    if (order.order_code === code) {
      if (!order.bundle) {
        order.bundle = (await getBundleById(order.bundle_id)) || undefined;
      }
      return order;
    }
  }

  return null;
}

/**
 * Update order when user clicks "Cek Pembayaran"
 */
export async function submitPaymentCheck(
  orderId: string,
  senderName: string,
  telegramMessageId?: string
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;

  const updatedFields: Partial<Order> = {
    sender_name: senderName.trim(),
    status: 'menunggu_verifikasi',
    telegram_message_id: telegramMessageId || order.telegram_message_id,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from('orders').update(updatedFields).eq('id', orderId);
  }

  const map = getLocalOrdersMap();
  const localOrder = map.get(orderId);
  if (localOrder) {
    Object.assign(localOrder, updatedFields);
    saveLocalOrder(localOrder);
  }

  return await getOrderById(orderId);
}

/**
 * Approve order (owner clicked ACC in Telegram)
 */
export async function approveOrder(orderCodeOrId: string): Promise<Order | null> {
  let order = await getOrderById(orderCodeOrId);
  if (!order) {
    order = await getOrderByCode(orderCodeOrId);
  }
  if (!order) return null;

  const downloadToken = crypto.randomUUID();
  const now = new Date();
  const downloadExpiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours validity

  const updatedFields = {
    status: 'sukses' as OrderStatus,
    verified_at: now.toISOString(),
    download_token: downloadToken,
    download_expires_at: downloadExpiresAt.toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from('orders').update(updatedFields).eq('id', order.id);
  }

  const map = getLocalOrdersMap();
  const localOrder = map.get(order.id);
  if (localOrder) {
    Object.assign(localOrder, updatedFields);
    saveLocalOrder(localOrder);
  }

  return await getOrderById(order.id);
}

/**
 * Reject order (owner clicked Tolak in Telegram)
 */
export async function rejectOrder(orderCodeOrId: string): Promise<Order | null> {
  let order = await getOrderById(orderCodeOrId);
  if (!order) {
    order = await getOrderByCode(orderCodeOrId);
  }
  if (!order) return null;

  const updatedFields = {
    status: 'ditolak' as OrderStatus,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from('orders').update(updatedFields).eq('id', order.id);
  }

  const map = getLocalOrdersMap();
  const localOrder = map.get(order.id);
  if (localOrder) {
    Object.assign(localOrder, updatedFields);
    saveLocalOrder(localOrder);
  }

  return await getOrderById(order.id);
}

/**
 * Get order by download token
 */
export async function getOrderByDownloadToken(token: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, bundles(*)')
      .eq('download_token', token)
      .single();

    if (!error && data) {
      return {
        ...data,
        bundle: data.bundles || (await getBundleById(data.bundle_id)),
      };
    }
  }

  const map = getLocalOrdersMap();
  for (const order of map.values()) {
    if (order.download_token === token) {
      if (!order.bundle) {
        order.bundle = (await getBundleById(order.bundle_id)) || undefined;
      }
      return order;
    }
  }

  return null;
}

/**
 * Expire orders older than 24h
 */
export async function expireOldOrders(): Promise<number> {
  const nowIso = new Date().toISOString();
  let expiredCount = 0;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'kedaluwarsa' })
      .in('status', ['pending', 'menunggu_verifikasi'])
      .lt('expires_at', nowIso)
      .select('id');

    if (!error && data) {
      expiredCount = data.length;
    }
  }

  // Disk store cleanup
  const map = getLocalOrdersMap();
  const nowTime = Date.now();
  let fileDirty = false;
  for (const order of map.values()) {
    if (
      (order.status === 'pending' || order.status === 'menunggu_verifikasi') &&
      new Date(order.expires_at).getTime() < nowTime
    ) {
      order.status = 'kedaluwarsa';
      expiredCount++;
      fileDirty = true;
    }
  }

  if (fileDirty) {
    try {
      ensureDataFile();
      const obj: Record<string, Order> = {};
      for (const [k, v] of map.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error updating expired orders in file:', e);
    }
  }

  return expiredCount;
}
