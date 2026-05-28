'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  id: number
  email: string
  role: string
  first_name: string
}

export function useAdminAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ta_user')
      if (stored) {
        const u: AuthUser = JSON.parse(stored)
        if (u && (u.role === 'admin')) {
          setUser(u)
          setChecking(false)
          return
        }
      }
    } catch {}
    router.replace('/account')
  }, [router])

  return { user, checking }
}
