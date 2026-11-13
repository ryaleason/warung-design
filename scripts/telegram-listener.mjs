import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.join(process.cwd(), '.env.local');
let token = process.env.TELEGRAM_BOT_TOKEN || '';
let secret = process.env.TELEGRAM_WEBHOOK_SECRET || 'rahasia_warung_123';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    if (line.startsWith('TELEGRAM_BOT_TOKEN=')) token = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
    if (line.startsWith('TELEGRAM_WEBHOOK_SECRET=')) secret = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
  }
}

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN tidak ditemukan di .env.local atau environment!');
  process.exit(1);
}

console.log('🤖 [Telegram Dev Listener] Memantau klik tombol Telegram untuk localhost:3000...');

let offset = 0;

async function poll() {
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=5`);
      const data = await res.json();

      if (data.ok && data.result && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.callback_query) {
            console.log(`⚡ Menerima klik tombol: ${update.callback_query.data} dari Telegram`);

            // Teruskan payload ke webhook Next.js di localhost
            try {
              const hookRes = await fetch(`http://localhost:3000/api/telegram/webhook/${secret}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update),
              });
              const hookData = await hookRes.json();
              console.log('✅ Webhook lokal berhasil memproses tindakan:', hookData);
            } catch (err) {
              console.error('❌ Gagal meneruskan ke localhost:3000:', err.message);
            }
          }
        }
      }
    } catch {
      // Small pause if network glitch
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

poll();
