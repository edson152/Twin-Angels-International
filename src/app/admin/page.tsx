'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/adminStore'

const CARDS = [
  { href: '/admin/orders',     icon: '📋', label: 'View Orders',           desc: 'Process customer orders',      color: 'hover:border-blue-500/50'   },
  { href: '/admin/products',   icon: '🛍️', label: 'Manage Products',       desc: 'Add, edit, delete products',   color: 'hover:border-yellow-500/50' },
  { href: '/admin/banners',    icon: '🖼️', label: 'Homepage Banners',      desc: 'Edit hero banners',            color: 'hover:border-purple-500/50' },
  { href: '/admin/payments',   icon: '✅', label: 'Payment Verification',  desc: 'Confirm payments',             color: 'hover:border-green-500/50'  },
  { href: '/admin/promotions', icon: '🎯', label: 'Promotions',            desc: 'Discount codes',               color: 'hover:border-red-500/50'    },
  { href: '/admin/delivery',   icon: '🗺️', label: 'Delivery Zones',        desc: 'Zone fees & settings',         color: 'hover:border-cyan-500/50'   },
  { href: '/admin/drivers',    icon: '🚚', label: 'Drivers & Vehicles',    desc: 'Manage dispatch team',         color: 'hover:border-orange-500/50' },
  { href: '/admin/settings',   icon: '⚙️', label: 'Site Settings & Logo',  desc: 'Colors, logo, social links',   color: 'hover:border-gray-500/50'   },
  { href: '/warehouse',        icon: '📺', label: 'Warehouse TV',          desc: 'Warehouse operations screen',  color: 'hover:border-indigo-500/50' },
  { href: '/dispatch',         icon: '📡', label: 'Dispatch TV',           desc: 'Dispatch monitoring screen',   color: 'hover:border-teal-500/50'   },
]

export default function AdminPage() {
  const { products, banners, settings } = useAdminStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { label: 'Total Products', value: mounted ? products.length : '—',                            icon: '🛍️', color: 'text-blue-400'   },
    { label: 'On Homepage',    value: mounted ? products.filter(p => p.show_on_home).length : '—', icon: '🏠', color: 'text-yellow-400' },
    { label: 'Active Banners', value: mounted ? banners.filter(b => b.is_active).length : '—',    icon: '🖼️', color: 'text-purple-400' },
    { label: 'Low Stock',      value: mounted ? products.filter(p => p.stock < 10).length : '—',  icon: '⚠️', color: 'text-red-400'    },
  ]

  return (
    <div className="p-6 max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard 👋</h1>
        <p className="text-gray-500 text-sm mt-1">
          {mounted ? settings.site_name : 'Twin Angels&apos;} — manage your store from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`font-mono font-bold text-2xl ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-gray-400 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation Cards — each is a full <Link> */}
      <h2 className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        {CARDS.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className={`
              bg-gray-900 border border-gray-800 rounded-xl p-4
              transition-all duration-150 group cursor-pointer
              hover:bg-gray-800/80 ${card.color}
            `}
          >
            <span className="text-2xl block mb-2">{card.icon}</span>
            <h3 className="font-semibold text-white text-sm group-hover:text-yellow-400 transition-colors mb-1 leading-snug">
              {card.label}
            </h3>
            <p className="text-gray-500 text-xs leading-snug">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      {mounted && products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-400 text-xs font-mono tracking-widest uppercase">Recent Products</h2>
            <Link href="/admin/products" className="text-yellow-500 text-xs hover:underline">Manage All →</Link>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Product</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase hidden md:table-cell">Category</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Price</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Home</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 6).map(p => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.images?.[0]
                          ? <img src={p.images[0]} className="w-8 h-8 rounded object-cover" alt="" />
                          : <div className="w-8 h-8 bg-gray-800 rounded text-xs flex items-center justify-center text-gray-600">img</div>
                        }
                        <span className="text-gray-300 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.category}</td>
                    <td className="px-4 py-3 text-yellow-400 font-mono font-bold">${p.price_usd}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        p.show_on_home ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {p.show_on_home ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
