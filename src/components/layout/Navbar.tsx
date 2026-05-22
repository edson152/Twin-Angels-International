'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { useAdminStore } from '@/lib/adminStore'
import { CATEGORIES } from '@/lib/constants'

export default function Navbar() {
  const { items } = useCartStore()
  const { settings } = useAdminStore()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalItems = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-gray-900'} border-b border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {mounted && settings.logo ? (
              <img src={settings.logo} alt={settings.site_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-9 h-9 bg-ta-gold rounded-lg flex items-center justify-center font-bold text-black text-sm">
                {mounted ? settings.logo_text || 'TA' : 'TA'}
              </div>
            )}
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">
                {mounted ? settings.site_name.split(' ').slice(0, 2).join(' ') : 'Twin Angels'}
              </div>
              <div className="text-ta-gold text-xs font-mono tracking-widest">INTERNATIONAL</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="text-gray-300 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
                Categories <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/products" className="text-gray-300 hover:text-white text-sm transition-colors">All Products</Link>
            <Link href="/track" className="text-gray-300 hover:text-white text-sm transition-colors">Track Order</Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative flex items-center gap-1 text-gray-300 hover:text-white transition-colors">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-ta-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <Link href="/admin" className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-ta-gold border border-gray-700 hover:border-ta-gold/40 px-3 py-1.5 rounded transition-colors">
              ⚙️ Admin
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-white p-1">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-gray-300 hover:text-white py-2 text-sm">
              <span>{cat.icon}</span><span>{cat.name}</span>
            </Link>
          ))}
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm">All Products</Link>
          <Link href="/track" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm">Track Order</Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-ta-gold py-2 text-sm">⚙️ Admin Panel</Link>
        </div>
      )}
    </nav>
  )
}
