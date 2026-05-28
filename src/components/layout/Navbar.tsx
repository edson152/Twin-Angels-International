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
  const [catOpen, setCatOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalItems = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/98 backdrop-blur-md shadow-xl' : 'bg-gray-900'} border-b border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {mounted && settings.logo ? (
              <img src={settings.logo} alt={settings.site_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-9 h-9 bg-ta-gold rounded-lg flex items-center justify-center font-bold text-black text-sm shrink-0">
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
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {/* Categories dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
                className="text-gray-300 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors py-2">
                Categories <span className={`text-xs transition-transform ${catOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {catOpen && (
                <div
                  onMouseEnter={() => setCatOpen(true)}
                  onMouseLeave={() => setCatOpen(false)}
                  className="absolute top-full left-0 mt-0 w-60 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 py-2">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm">
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-800 mt-1 pt-1">
                    <Link href="/products" onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-ta-gold hover:text-white transition-colors text-sm font-semibold">
                      <span className="text-xl">🛍️</span>
                      <span>All Products</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/products" className="text-gray-300 hover:text-white text-sm transition-colors">Products</Link>
            <Link href="/track" className="text-gray-300 hover:text-white text-sm transition-colors">Track Order</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search icon (mobile/desktop) */}
            <Link href="/products" className="p-2 text-gray-400 hover:text-white transition-colors" title="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Account */}
            <Link href="/account" className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block" title="Account">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ta-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Admin */}
            <Link href="/admin" className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-ta-gold border border-gray-700 hover:border-ta-gold/40 px-3 py-1.5 rounded-lg transition-colors">
              ⚙️ Admin
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors">
              {menuOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4">
          <div className="mb-4">
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map(cat => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-800 text-sm transition-colors">
                  <span>{cat.icon}</span><span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-3 space-y-1">
            <Link href="/products" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-800 text-sm">🛍️ All Products</Link>
            <Link href="/track" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-800 text-sm">📦 Track Order</Link>
            <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-800 text-sm">👤 Account / Login</Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-ta-gold py-2 px-2 rounded hover:bg-gray-800 text-sm">⚙️ Admin Panel</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
