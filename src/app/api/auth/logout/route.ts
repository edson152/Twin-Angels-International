import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete('ta_token')
  return NextResponse.json({ message: 'Logged out' })
}
