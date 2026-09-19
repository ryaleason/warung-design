import { NextResponse } from 'next/server';
import { getTelegramConfig } from '@/lib/telegram';

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID || '';
  const config = getTelegramConfig();

  return NextResponse.json({
    hasToken: Boolean(token),
    tokenLength: token.length,
    tokenPrefix: token ? token.substring(0, 4) + '...' : null,
    hasOwnerChatId: Boolean(ownerChatId),
    ownerChatIdLength: ownerChatId.length,
    ownerChatIdPrefix: ownerChatId ? ownerChatId.substring(0, 3) + '...' : null,
    config,
    envKeys: Object.keys(process.env).filter(
      k => k.includes('TELEGRAM') || k.includes('SUPABASE') || k.includes('VERCEL')
    ),
  });
}
