import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'auth'

async function verifyAuthToken(token: string) {
  const [value, signature] = token.split('.')

  if (!value || !signature) {
    return false
  }

  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET is not configured')
  }

  const encoder = new TextEncoder()

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  )

  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))

  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return signature === expectedHex
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value

  const authenticated = token ? await verifyAuthToken(token) : false

  if (!authenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Run on everything except Next.js internals,
     * static files, and the login page.
     */
    '/((?!_next/static|_next/image|favicon.ico|login|api).*)',
  ],
}
