// Simple auth helper - no JWT/bcrypt dependency needed
export interface TokenPayload {
  userId: number
  email: string
  role: string
  exp: number
}

export function parseToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString())
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const payload = parseToken(token)
  if (!payload) return false
  return payload.exp > Date.now()
}
