import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserById } from '@/lib/db/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ success: true, user: null });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: true, user: null });
    }

    const user = await getUserById(session.userId);
    return NextResponse.json({ success: true, user: user || null });
  } catch {
    return NextResponse.json({ success: true, user: null });
  }
}
