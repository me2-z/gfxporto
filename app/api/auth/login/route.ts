import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const validUsername = process.env.ADMIN_USERNAME || 'MeetZanzmera';
    const validPassword = process.env.ADMIN_PASSWORD || 'MeetZanzmera@3013';

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: 'admin_env', username });

    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
