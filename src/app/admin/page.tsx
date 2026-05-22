'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/adminStore'

export default function AdminPage() {
  const { products, banners, settings } = useAdminStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { label: 'Total Products', value: mounted ? products.length : '-', icon: '🛍️', color: 'text-blue-400' },
    { label: 'On Homepage', value: mounted ? products.filter(p => p.show_on_home).length : '-', icon: '🏠', color: 'text-ta-gold' },
    { label: 'Active Banners', value: mounted ? banners.filter(b => b.is_active).length : '-', icon: '🖼️', color: 'text-purple-400' },
    { label: 'Low Stock Items', value: mounted ? products.filter(p => p.stock < 10).length : '-', icon: '⚠️', color: 'text-yellow-400' },
  ]

  const quickLinks = [
    { href: '/admin/products', label: 'Products & Stock', icon: '🛍️', desc: 'Add, edit, upload images & manage inventory' },
    { href: '/admin/banners', label: 'Homepage Banners', icon: '🖼️', desc: 'Upload images, edit & reorder hero banners' },
    { href: '/admin/settings', label: 'Site Settings & Logo', icon: '⚙️', desc: 'Upload logo, colors, social links, promo strip' },
    { href: '/admin/orders', label: 'Manage Orders', icon: '📋', desc: 'View, process and update all orders' },
    { href: '/admin/promotions', label: 'Promotions', icon: '🎯', desc: 'Create sales and discount codes' },
    { href: '/admin/delivery', label: 'Delivery Zones', icon: '🗺️', desc: 'Configure zones and fees' },
    { href: '/admin/payments', label: 'Payment Verification', icon: '✅', desc: 'Confirm offline payments' },
    { href: '/admin/drivers', label: 'Drivers & Vehicles', icon: '🚚', desc: 'Manage dispatch team' },
    { href: '/warehouse', label: 'Warehouse TV', icon: '📺', desc: 'Warehouse operations screen' },
    { href: '/dispatch', label: 'Dispatch TV', icon: '📡', desc: 'Dispatch monitoring screen' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mounted && settings.logo ? (
            <img src={settings.logo} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <div className="w-8 h-8 bg-ta-gold rounded flex items-center justify-center font-bold text-black text-sm">
              {mounted ? settings.logo_text || 'TA' : 'TA'}
            </div>
          )}
          <span className="font-bold text-lg">{mounted ? settings.site_name.split(' ').slice(0, 2).join(' ') : 'Twin Angels'} Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">← View Store</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard 👋</h1>
          <p className="text-gray-500 text-sm">Manage your entire store from here.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`font-mono font-bold text-2xl ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <h2 className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-ta-gold/40 rounded-lg p-4 transition-all duration-200 group">
              <span className="text-2xl block mb-2">{link.icon}</span>
              <h3 className="font-semibold text-white text-sm group-hover:text-ta-gold transition-colors mb-1">{link.label}</h3>
              <p className="text-gray-500 text-xs line-clamp-2">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recently added products */}
        {mounted && products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-xs font-mono tracking-widest uppercase">Recent Products</h2>
              <Link href="/admin/products" className="text-ta-gold text-xs hover:underline">Manage All →</Link>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
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
                  {products.slice(0, 5).map(p => (
                    <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} className="w-8 h-8 rounded object-cover" alt="" />
                          ) : (
                            <div className="w-8 h-8 bg-gray-800 rounded text-xs flex items-center justify-center text-gray-600">img</div>
                          )}
                          <span className="text-gray-300 font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.category}</td>
                      <td className="px-4 py-3 text-ta-gold font-mono font-bold">${p.price_usd}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.show_on_home ? 'bg-ta-gold/20 text-ta-gold' : 'bg-gray-800 text-gray-500'}`}>
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
    </div>
  )
}
