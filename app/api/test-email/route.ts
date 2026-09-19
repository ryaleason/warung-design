import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get('to') || process.env.GMAIL_USER || 'rylaeasoncore@gmail.com';

  const gmailUser = process.env.GMAIL_USER || '';
  const gmailPass = process.env.GMAIL_APP_PASSWORD || '';
  const resendKey = process.env.RESEND_API_KEY || '';

  const diagnostics: Record<string, unknown> = {
    server_time: new Date().toISOString(),
    recipient: to,
    env_detected: {
      GMAIL_USER: gmailUser ? `${gmailUser} (TERDETEKSI)` : 'TIDAK TERDETEKSI (KOSONG - Perlu Redeploy di Vercel)',
      GMAIL_APP_PASSWORD: gmailPass ? `TERDETEKSI (${gmailPass.length} karakter)` : 'TIDAK TERDETEKSI (KOSONG - Perlu Redeploy di Vercel)',
      RESEND_API_KEY: resendKey ? `TERDETEKSI (${resendKey.substring(0, 5)}...)` : 'TIDAK TERDETEKSI',
    },
    results: {},
  };

  const results: Record<string, unknown> = {};

  // 1. Tes Gmail SMTP jika ada sandi
  if (gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: gmailUser || 'rylaeasoncore@gmail.com',
          pass: gmailPass.replace(/\s+/g, ''),
        },
        connectionTimeout: 10000,
      });

      await transporter.verify();

      const info = await transporter.sendMail({
        from: `Warung Design <${gmailUser || 'rylaeasoncore@gmail.com'}>`,
        to: to,
        subject: `[Tes Email Berhasil] Warung Design System`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; background: #f6f5f4; border-radius: 8px;">
            <h2 style="color: #0075de; margin-top: 0;">Tes Pengiriman Email Berhasil! ✅</h2>
            <p>Email ini dikirim langsung dari server Vercel Anda menggunakan akun Gmail <strong>${gmailUser || 'rylaeasoncore@gmail.com'}</strong>.</p>
            <p>Fitur pengiriman email akses desain otomatis saat ACC pesanan sudah aktif dan siap digunakan.</p>
          </div>
        `,
      });

      results.gmail_smtp = {
        success: true,
        messageId: info.messageId,
        status: 'Email berhasil terkirim ke ' + to,
      };
    } catch (err: unknown) {
      const error = err as Error;
      results.gmail_smtp = {
        success: false,
        error: error.message,
        panduan: error.message.includes('535')
          ? 'Error 535: Sandi Aplikasi Google salah atau belum dibuat di myaccount.google.com/apppasswords'
          : error.message,
      };
    }
  } else {
    results.gmail_smtp = {
      success: false,
      error: 'GMAIL_APP_PASSWORD belum aktif di server. Lakukan Redeploy di Vercel agar variable terbaca.',
    };
  }

  // 2. Tes Resend jika ada key
  if (resendKey && !resendKey.includes('re_your_api_key')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Warung Design <onboarding@resend.dev>',
          to: to,
          subject: '[Tes Resend] Warung Design',
          html: '<p>Tes pengiriman via Resend API.</p>',
        }),
      });
      const data = await res.json();
      results.resend = {
        success: res.ok,
        response: data,
      };
    } catch (err: unknown) {
      const error = err as Error;
      results.resend = {
        success: false,
        error: error.message,
      };
    }
  }

  diagnostics.results = results;

  return NextResponse.json(diagnostics, { status: 200 });
}
