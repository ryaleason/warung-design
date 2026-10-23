import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSessionToken } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    const user = await registerUser({ name, email, phone, password });
    const token = createSessionToken(user);

    const res = NextResponse.json({
      success: true,
      user,
      message: 'Registrasi akun berhasil!',
    });

    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal melakukan pendaftaran';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
