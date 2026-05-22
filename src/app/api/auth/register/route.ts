import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password } = await req.json()

    if (!firstName || !email || !password) {
      return NextResponse.json({ error: 'First name, email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const result = await query(
      `INSERT INTO users (first_name, last_name, email, phone, password, role)
       VALUES ($1, $2, $3, $4, $5, 'customer') RETURNING id, email, first_name, role`,
      [firstName, lastName, email.toLowerCase(), phone || null, hashedPassword]
    )

    const user = result.rows[0]
    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    const cookieStore = cookies()
    cookieStore.set('ta_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name },
      token,
    }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
