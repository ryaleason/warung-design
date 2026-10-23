import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSessionToken } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    const token = createSessionToken(user);

    const res = NextResponse.json({
      success: true,
      user,
      message: 'Berhasil masuk ke akun!',
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
    const message = error instanceof Error ? error.message : 'Gagal masuk akun';
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
