'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPackage, FiMapPin, FiUser, FiLogOut, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, login, logout, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please enter your email and password')
      return
    }
    setSubmitting(true)
    const ok = await login(form.email, form.password)
    if (ok) toast.success(`Welcome back!`)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <StoreLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-ta-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      </StoreLayout>
    )
  }

  // ── LOGGED IN VIEW ──────────────────────────────────────────────
  if (user) {
    return (
      <StoreLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-1">My Account</p>
              <h1 className="font-display text-3xl font-bold text-ta-dark">
                Welcome, {user.first_name} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin"
                  className="flex items-center gap-2 bg-ta-dark hover:bg-ta-gold text-white text-sm font-semibold px-4 py-2 rounded-sm transition-colors">
                  <FiShield size={16} />
                  Admin Panel
                </Link>
              )}
              <button onClick={logout}
                className="flex items-center gap-2 border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-500 text-sm font-semibold px-4 py-2 rounded-sm transition-colors">
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Role badge */}
          {user.role !== 'customer' && (
            <div className="mb-6 inline-flex items-center gap-2 bg-ta-gold/10 border border-ta-gold/30 text-ta-gold text-xs font-mono font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">
              <FiShield size={12} />
              {user.role.replace('_', ' ')} access
            </div>
          )}

          {/* Quick links grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: FiPackage, title: 'Track My Order', desc: 'Enter an order number to track delivery', href: '/track' },
              { icon: FiMapPin, title: 'Delivery Zones', desc: 'View delivery fees by city', href: '/delivery' },
              { icon: FiUser, title: 'Contact Support', desc: 'Get help via WhatsApp or email', href: '/contact' },
            ].map(({ icon: Icon, title, desc, href }) => (
              <Link key={title} href={href}
                className="bg-white border border-gray-100 rounded-sm p-5 flex items-start gap-4 hover:border-ta-gold hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-ta-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-ta-gold/20 transition-colors">
                  <Icon size={20} className="text-ta-gold" />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-ta-dark text-sm mb-0.5">{title}</h3>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Admin shortcuts */}
          {isAdmin && (
            <div className="bg-ta-dark rounded-sm p-6">
              <h2 className="font-display font-semibold text-ta-gold mb-4">Admin Shortcuts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'All Orders', href: '/admin/orders' },
                  { label: 'Products', href: '/admin/products' },
                  { label: 'Payments', href: '/admin/payments' },
                  { label: 'Warehouse TV', href: '/warehouse' },
                ].map(link => (
                  <Link key={link.href} href={link.href}
                    className="bg-white/10 hover:bg-ta-gold text-white text-sm font-semibold py-2.5 px-3 rounded-sm text-center transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </StoreLayout>
    )
  }

  // ── LOGGED OUT VIEW ─────────────────────────────────────────────
  return (
    <StoreLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-ta-dark rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-ta-gold font-display font-bold text-2xl">TA</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-ta-dark">Sign In</h1>
            <p className="text-gray-500 mt-2 text-sm">Access your Twin Angels account</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input type="password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field" placeholder="••••••••" required />
              </div>
              <button type="submit" disabled={submitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Admin hint for dev */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-800">
              <strong>Admin login:</strong> admin@twinangels.co.zw / Admin@2024
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="text-ta-gold hover:underline font-medium">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
