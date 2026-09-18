export type OrderStatus = 'pending' | 'menunggu_verifikasi' | 'sukses' | 'ditolak' | 'kedaluwarsa';

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  preview_images: string[];
  file_url: string;
  is_active: boolean;
  features: string[];
  category?: string;
  badge?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_code: string;
  bundle_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string | null;
  sender_name?: string | null;
  base_price: number;
  unique_code: number;
  total_amount: number;
  status: OrderStatus;
  telegram_message_id?: string | null;
  download_token?: string | null;
  download_expires_at?: string | null;
  created_at: string;
  verified_at?: string | null;
  expires_at: string;
  bundle?: Bundle;
}

export interface CreateOrderPayload {
  bundle_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
}

export interface CheckPaymentPayload {
  sender_name: string;
}
