import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'auth'

function createSignature(value: string) {
  return crypto.createHmac('sha256', process.env.AUTH_SECRET!).update(value).digest('hex')
}

export function createAuthToken() {
  const value = crypto.randomBytes(32).toString('hex')
  const signature = createSignature(value)

  return `${value}.${signature}`
}

export function verifyAuthToken(token: string) {
  const [value, signature] = token.split('.')

  if (!value || !signature) {
    return false
  }

  const expectedSignature = createSignature(value)

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    return false;
  }

  return verifyAuthToken(token);
}

export { COOKIE_NAME }
