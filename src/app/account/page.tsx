'use client'
import { useState, useEffect } from 'react'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  role: string
  first_name: string
}

export default function AccountPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('ta_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        localStorage.setItem('ta_user', JSON.stringify(data.user))
        toast.success(`Welcome back, ${data.user.first_name}!`)
        if (data.user.role === 'admin') router.push('/admin')
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('ta_user')
    fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully')
  }

  if (!mounted) return null

  if (user) {
    return (
      <StoreLayout>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-ta-gold rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name[0]}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ta-dark">Welcome, {user.first_name}!</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span className="inline-block mt-1 text-xs bg-ta-gold/10 text-ta-gold border border-ta-gold/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { href: '/track', icon: '📦', label: 'Track Orders' },
                { href: '/products', icon: '🛍️', label: 'Browse Products' },
                ...(user.role === 'admin' ? [{ href: '/admin', icon: '⚙️', label: 'Admin Panel' }] : []),
                ...(user.role === 'warehouse' ? [{ href: '/warehouse', icon: '🏭', label: 'Warehouse TV' }] : []),
                ...(user.role === 'dispatch' ? [{ href: '/dispatch', icon: '🚚', label: 'Dispatch TV' }] : []),
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-sm hover:border-ta-gold hover:bg-amber-50 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-body font-medium text-ta-dark text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            <button onClick={handleLogout}
              className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-sm text-sm font-semibold transition-colors uppercase tracking-wide">
              Sign Out
            </button>
          </div>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-ta-gold rounded-sm flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold font-display text-xl">TA</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ta-dark">My Account</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to track orders and more</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-ta-gold text-ta-gold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email Address</label>
              <input type="email" required value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input type="password" required value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-center text-xs text-gray-400 mt-4 p-3 bg-gray-50 rounded">
              <p className="font-semibold mb-1">Demo credentials:</p>
              <p>Admin: edsonnyoni92@gmail.com / admin123</p>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input type="text" value={registerForm.firstName}
                  onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))}
                  className="input-field" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input type="text" value={registerForm.lastName}
                  onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))}
                  className="input-field" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={registerForm.email}
                onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone / WhatsApp</label>
              <input type="tel" value={registerForm.phone}
                onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))}
                className="input-field" placeholder="+263 7XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input type="password" value={registerForm.password}
                onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                className="input-field" placeholder="••••••••" />
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
              🛍️ Customer accounts let you track orders and save your delivery details.
            </div>
            <button type="button"
              onClick={() => toast.success('Account registration coming soon! For now, use the admin login.')}
              className="btn-primary w-full">
              Create Account
            </button>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
