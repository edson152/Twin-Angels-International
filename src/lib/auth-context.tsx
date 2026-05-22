'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  first_name: string
  role: 'customer' | 'admin' | 'it_support' | 'warehouse' | 'dispatch'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => false,
  logout: async () => {},
  isAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('ta_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        // Verify this cart belongs to the stored user
        useCartStore.getState().clearCartForUser(parsed.email)
      }
    } catch {
      localStorage.removeItem('ta_user')
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        localStorage.setItem('ta_user', JSON.stringify(data.user))
        // Set cart owner — clears cart if it belonged to a different user
        useCartStore.getState().clearCartForUser(data.user.email)
        setLoading(false)
        return true
      } else {
        toast.error(data.error || 'Invalid email or password')
        setLoading(false)
        return false
      }
    } catch {
      toast.error('Network error. Please try again.')
      setLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    localStorage.removeItem('ta_user')
    // ✅ Clear the cart completely on logout — no one else should see it
    useCartStore.getState().clearCart()
    toast.success('Signed out successfully')
    router.push('/')
  }, [router])

  const isAdmin = mounted && (user?.role === 'admin' || user?.role === 'it_support')

  return (
    <AuthContext.Provider value={{
      user: mounted ? user : null,
      loading,
      login,
      logout,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
