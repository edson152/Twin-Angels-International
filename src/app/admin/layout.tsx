'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiHome, FiShoppingBag, FiPackage, FiImage, FiTag,
  FiMap, FiCreditCard, FiTruck, FiSettings, FiMonitor, FiLogOut
} from 'react-icons/fi'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: FiHome },
  { label: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
  { label: 'Products', href: '/admin/products', icon: FiPackage },
  { label: 'Banners', href: '/admin/banners', icon: FiImage },
  { label: 'Promotions', href: '/admin/promotions', icon: FiTag },
  { label: 'Delivery Zones', href: '/admin/delivery', icon: FiMap },
  { label: 'Payments', href: '/admin/payments', icon: FiCreditCard },
  { label: 'Drivers', href: '/admin/drivers', icon: FiTruck },
  { label: 'Settings', href: '/admin/settings', icon: FiSettings },
]

const TV = [
  { label: 'Warehouse TV', href: '/warehouse', icon: FiMonitor },
  { label: 'Dispatch TV', href: '/dispatch', icon: FiMonitor },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/account')
    }
  }, [loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ta-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading admin...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col fixed top-0 bottom-0 left-0 z-40">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ta-gold rounded flex items-center justify-center font-bold text-black text-sm">TA</div>
            <div>
              <div className="text-white font-bold text-sm leading-none">Twin Angels</div>
              <div className="text-ta-gold text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-ta-gold text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}

          <div className="pt-3 pb-1 px-3">
            <p className="text-gray-600 text-xs font-mono uppercase tracking-wider">TV Dashboards</p>
          </div>
          {TV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Icon size={16} />
              {label} ↗
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            🌐 View Store
          </Link>
          <button onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors">
            <FiLogOut size={16} /> Sign Out ({user?.first_name})
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
