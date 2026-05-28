import { NextRequest, NextResponse } from 'next/server'

const USERS = [
  { id: 1, email: 'admin@twinangels.co.zw', password: 'admin123', role: 'admin', first_name: 'Admin' },
  { id: 2, email: 'edsonnyoni92@gmail.com', password: 'admin123', role: 'admin', first_name: 'Edson' },
  { id: 3, email: 'edson@twinangels.co.zw', password: 'admin123', role: 'admin', first_name: 'Edson' },
  { id: 4, email: 'warehouse@twinangels.co.zw', password: 'warehouse123', role: 'warehouse', first_name: 'Warehouse' },
  { id: 5, email: 'dispatch@twinangels.co.zw', password: 'dispatch123', role: 'dispatch', first_name: 'Dispatch' },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email || '').toString().trim().toLowerCase()
    const password = (body.password || '').toString().trim()

    console.log('[LOGIN] Attempt:', email, '| password length:', password.length)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = USERS.find(
      u => u.email.toLowerCase() === email && u.password === password
    )

    console.log('[LOGIN] User found:', !!user)

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = Buffer.from(
      JSON.stringify({ userId: user.id, email: user.email, role: user.role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
    ).toString('base64')

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name },
      token,
    })

    response.cookies.set('ta_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[LOGIN] Error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
