'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAdminStore } from '@/lib/adminStore'

const NAV = [
  { href: '/admin',             icon: '📊', label: 'Dashboard',           exact: true  },
  { href: '/admin/orders',      icon: '📋', label: 'Orders'                            },
  { href: '/admin/products',    icon: '🛍️', label: 'Products'                          },
  { href: '/admin/banners',     icon: '🖼️', label: 'Banners'                           },
  { href: '/admin/payments',    icon: '✅', label: 'Payments'                          },
  { href: '/admin/promotions',  icon: '🎯', label: 'Promotions'                        },
  { href: '/admin/delivery',    icon: '🗺️', label: 'Delivery Zones'                    },
  { href: '/admin/drivers',     icon: '🚚', label: 'Drivers'                           },
  { href: '/admin/settings',    icon: '⚙️', label: 'Settings'                          },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const { settings } = useAdminStore()
  const [mounted,  setMounted]  = useState(false)
  const [authed,   setAuthed]   = useState(false)
  const [sideOpen, setSideOpen] = useState(false)

  /* ── auth check ─────────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem('ta_user')
      if (raw) {
        const u = JSON.parse(raw)
        if (u?.role === 'admin') { setAuthed(true); return }
      }
    } catch {}
    router.replace('/account')
  }, [router])

  const logout = () => {
    localStorage.removeItem('ta_user')
    router.replace('/account')
  }

  if (!mounted || !authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-500 text-sm animate-pulse">Verifying access…</div>
    </div>
  )

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSideOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-gray-900 border-r border-gray-800 z-40
        flex flex-col transition-transform duration-200
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800 flex items-center gap-3">
          {mounted && settings.logo
            ? <img src={settings.logo} alt="" className="h-7 w-auto object-contain" />
            : <div className="w-7 h-7 bg-yellow-500 rounded flex items-center justify-center text-black font-bold text-xs">
                {settings.logo_text || 'TA'}
              </div>
          }
          <div>
            <div className="text-white font-bold text-sm leading-none">
              {settings.site_name?.split(' ').slice(0,2).join(' ') || 'Twin Angels'}
            </div>
            <div className="text-yellow-500 text-xs mt-0.5">Admin Panel</div>
          </div>
          <button onClick={() => setSideOpen(false)}
            className="ml-auto text-gray-600 hover:text-white lg:hidden text-xl leading-none">×</button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(item => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSideOpen(false)}
                className={`
                  flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors
                  ${active
                    ? 'bg-yellow-500/10 text-yellow-400 border-r-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                `}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-gray-800 space-y-2">
          <Link href="/" target="_blank"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
            <span>🌐</span> View Store
          </Link>
          <button onClick={logout}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors w-full text-left">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
          <button onClick={() => setSideOpen(true)}
            className="text-gray-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">
            {NAV.find(n => isActive(n.href, n.exact))?.label || 'Admin'}
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
