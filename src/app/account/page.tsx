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

const ADMIN_LINKS = [
  { href: '/admin', icon: '📊', label: 'Admin Dashboard', desc: 'Overview & stats' },
  { href: '/admin/products', icon: '🛍️', label: 'Manage Products', desc: 'Add, edit, delete products' },
  { href: '/admin/banners', icon: '🖼️', label: 'Homepage Banners', desc: 'Edit hero banners' },
  { href: '/admin/orders', icon: '📋', label: 'View Orders', desc: 'Process customer orders' },
  { href: '/admin/payments', icon: '✅', label: 'Payment Verification', desc: 'Confirm payments' },
  { href: '/admin/promotions', icon: '🎯', label: 'Promotions', desc: 'Discount codes' },
  { href: '/admin/delivery', icon: '🗺️', label: 'Delivery Zones', desc: 'Zone fees & settings' },
  { href: '/admin/drivers', icon: '🚚', label: 'Drivers & Vehicles', desc: 'Manage dispatch team' },
  { href: '/admin/settings', icon: '⚙️', label: 'Site Settings & Logo', desc: 'Colors, logo, social links' },
  { href: '/warehouse', icon: '🏭', label: 'Warehouse TV', desc: 'Warehouse monitor screen' },
  { href: '/dispatch', icon: '📡', label: 'Dispatch TV', desc: 'Dispatch monitor screen' },
]

export default function AccountPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('ta_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimEmail = email.trim()
    const trimPass = password.trim()
    if (!trimEmail || !trimPass) { toast.error('Enter email and password'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimEmail, password: trimPass }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        localStorage.setItem('ta_user', JSON.stringify(data.user))
        toast.success(`Welcome back, ${data.user.first_name}! 👋`)
        // Redirect admin users straight to admin panel
        if (data.user.role === 'admin') {
          setTimeout(() => router.push('/admin'), 500)
        } else if (data.user.role === 'warehouse') {
          setTimeout(() => router.push('/warehouse'), 500)
        } else if (data.user.role === 'dispatch') {
          setTimeout(() => router.push('/dispatch'), 500)
        }
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch {
      toast.error('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role: string) => {
    if (role === 'admin') { setEmail('edsonnyoni92@gmail.com'); setPassword('admin123') }
    if (role === 'warehouse') { setEmail('warehouse@twinangels.co.zw'); setPassword('warehouse123') }
    if (role === 'dispatch') { setEmail('dispatch@twinangels.co.zw'); setPassword('dispatch123') }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('ta_user')
    fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully')
  }

  if (!mounted) return null

  // ── Logged in: ADMIN ──
  if (user && user.role === 'admin') {
    return (
      <StoreLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Profile bar */}
            <div className="bg-gray-900 text-white rounded-xl p-6 flex items-center justify-between mb-8 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-ta-gold rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.first_name[0]}
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold">Welcome, {user.first_name}!</h1>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <span className="inline-block mt-1 text-xs bg-ta-gold/20 text-ta-gold border border-ta-gold/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    {user.role}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout}
                className="border border-red-500/50 text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Sign Out
              </button>
            </div>

            {/* Quick store links */}
            <div className="flex gap-3 mb-6">
              <Link href="/products" className="flex items-center gap-2 bg-white border border-gray-200 hover:border-ta-gold px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-ta-gold transition-colors">
                🛒 Browse Store
              </Link>
              <Link href="/track" className="flex items-center gap-2 bg-white border border-gray-200 hover:border-ta-gold px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-ta-gold transition-colors">
                📦 Track Order
              </Link>
            </div>

            {/* Admin panel grid */}
            <div className="mb-4">
              <h2 className="font-display font-bold text-gray-800 text-lg mb-1">Admin Panel</h2>
              <p className="text-gray-500 text-sm">Click any section to manage your store</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADMIN_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="group bg-white border-2 border-gray-100 hover:border-ta-gold rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-ta-gold/10 rounded-xl flex items-center justify-center text-2xl transition-colors shrink-0">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-ta-gold transition-colors text-sm mb-0.5">{link.label}</h3>
                    <p className="text-gray-400 text-xs">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </StoreLayout>
    )
  }

  // ── Logged in: other roles ──
  if (user) {
    const storeLinks = [
      { href: '/products', icon: '🛒', label: 'Browse Products' },
      { href: '/track', icon: '📦', label: 'Track Order' },
      ...(user.role === 'warehouse' ? [{ href: '/warehouse', icon: '🏭', label: 'Warehouse TV' }] : []),
      ...(user.role === 'dispatch' ? [{ href: '/dispatch', icon: '🚚', label: 'Dispatch TV' }] : []),
    ]
    return (
      <StoreLayout>
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-ta-gold rounded-full flex items-center justify-center text-white text-2xl font-bold">{user.first_name[0]}</div>
              <div>
                <h1 className="font-display text-xl font-bold text-ta-dark">Welcome, {user.first_name}!</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span className="inline-block mt-1 text-xs bg-ta-gold/10 text-ta-gold border border-ta-gold/20 px-2 py-0.5 rounded-full font-bold uppercase">{user.role}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {storeLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-ta-gold hover:bg-amber-50 transition-all group">
                  <span className="text-2xl">{l.icon}</span>
                  <span className="font-medium text-ta-dark text-sm group-hover:text-ta-gold transition-colors">{l.label}</span>
                  <span className="ml-auto text-gray-400 group-hover:text-ta-gold">→</span>
                </Link>
              ))}
            </div>
            <button onClick={handleLogout} className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl text-sm font-semibold transition-colors">Sign Out</button>
          </div>
        </div>
      </StoreLayout>
    )
  }

  // ── Not logged in ──
  return (
    <StoreLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ta-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold font-display text-2xl">TA</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ta-dark">My Account</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to access your dashboard</p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-ta-gold text-ta-gold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <div>
            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" autoComplete="email" required value={email}
                  onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} autoComplete="current-password" required value={password}
                    onChange={e => setPassword(e.target.value)} className="input-field pr-20" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                    {showPass ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-center">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Quick Login — Demo Accounts</p>
              <div className="space-y-2">
                {[
                  { role: 'admin', label: '⚙️ Admin / Owner', pass: 'admin123', email: 'edsonnyoni92@gmail.com' },
                  { role: 'warehouse', label: '🏭 Warehouse Staff', pass: 'warehouse123', email: 'warehouse@twinangels.co.zw' },
                  { role: 'dispatch', label: '🚚 Dispatch Staff', pass: 'dispatch123', email: 'dispatch@twinangels.co.zw' },
                ].map(item => (
                  <button key={item.role} onClick={() => { fillDemo(item.role); setTab('login') }}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 hover:border-ta-gold rounded-lg transition-colors group text-sm">
                    <span className="font-medium text-gray-700 group-hover:text-ta-gold">{item.label}</span>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs font-mono">{item.pass}</div>
                      <div className="text-gray-300 text-xs truncate max-w-36">{item.email}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Click a role to fill credentials, then Sign In</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input type="text" className="input-field" placeholder="John" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input type="text" className="input-field" placeholder="Doe" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input-field" placeholder="you@example.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label><input type="tel" className="input-field" placeholder="+263 7XX XXX XXX" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" className="input-field" placeholder="••••••••" /></div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              🛍️ Customer self-registration coming soon. For staff access, use Sign In with the credentials provided by your admin.
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
