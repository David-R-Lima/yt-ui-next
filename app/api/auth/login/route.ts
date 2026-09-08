import { createAuthToken } from '@/lib/auth';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

    const token = createAuthToken();

  const response = NextResponse.json({ success: true })

  response.cookies.set('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
