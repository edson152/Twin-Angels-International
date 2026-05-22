import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const hash = await hashPassword('Admin@2024')
    const existing = await query('SELECT id FROM users WHERE email = $1', ['admin@twinangels.co.zw'])
    if (existing.rows.length > 0) {
      await query(
        'UPDATE users SET password = $1, is_active = true, role = $2 WHERE email = $3',
        [hash, 'admin', 'admin@twinangels.co.zw']
      )
      return NextResponse.json({ success: true, action: 'updated', message: 'Admin password reset. Email: admin@twinangels.co.zw | Password: Admin@2024' })
    } else {
      await query(
        `INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES ($1,$2,'Admin','User','admin',true)`,
        ['admin@twinangels.co.zw', hash]
      )
      return NextResponse.json({ success: true, action: 'created', message: 'Admin created. Email: admin@twinangels.co.zw | Password: Admin@2024' })
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
