'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { CATEGORIES, WHATSAPP_SUPPORT, CURRENCIES } from '@/lib/constants'
import {
  FiShoppingCart,
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
} from 'react-icons/fi'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, currency, setCurrency } = useCartStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="bg-ta-dark text-ta-cream text-xs py-2 px-4 flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="ticker-tape whitespace-nowrap">
            🏆 Zimbabwe&apos;s Premier Industrial & Furniture Marketplace &nbsp;|&nbsp; Free delivery
            in Harare on orders over $100 &nbsp;|&nbsp; WhatsApp orders welcome!
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={`https://wa.me/${WHATSAPP_SUPPORT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-ta-gold transition-colors"
          >
            <FiPhone size={12} />
            <span className="hidden sm:inline">WhatsApp Support</span>
          </a>
          <div className="flex items-center gap-1 border border-ta-dark-grey rounded-sm overflow-hidden">
            {(['USD', 'ZIG'] as const).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-2 py-0.5 text-xs font-mono transition-colors ${
                  currency === cur ? 'bg-ta-gold text-white' : 'hover:bg-ta-dark-grey'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-50 bg-ta-cream border-b transition-shadow duration-300 ${
          scrolled ? 'shadow-md border-gray-200' : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ta-dark rounded-sm flex items-center justify-center">
                <span className="text-ta-gold font-display font-bold text-lg">TA</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-ta-dark text-lg leading-tight">
                  Twin Angels
                </div>
                <div className="text-ta-gold text-xs font-mono tracking-widest uppercase">
                  International
                </div>
              </div>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-sm pl-4 pr-12 py-2.5 text-sm font-body focus:outline-none focus:border-ta-gold focus:ring-1 focus:ring-ta-gold bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                />
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-0 top-0 bottom-0 px-3 flex items-center bg-ta-gold hover:bg-ta-gold-dark transition-colors rounded-r-sm"
                >
                  <FiSearch className="text-white" size={16} />
                </Link>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 hover:text-ta-gold transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <FiSearch size={20} />
              </button>

              <Link
                href="/account"
                className="hidden sm:flex items-center gap-1.5 p-2 hover:text-ta-gold transition-colors text-sm font-body"
              >
                <FiUser size={20} />
                <span className="hidden lg:inline">Account</span>
              </Link>

              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 p-2 hover:text-ta-gold transition-colors"
              >
                <FiShoppingCart size={22} />
                {totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-ta-gold text-white text-xs rounded-full flex items-center justify-center font-bold font-mono">
                    {totalItems() > 99 ? '99+' : totalItems()}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden p-2 hover:text-ta-gold transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category nav - desktop */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-0">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-body hover:text-ta-gold hover:bg-ta-cream transition-colors border-r border-gray-100 whitespace-nowrap"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
              <Link
                href="/products"
                className="ml-auto px-4 py-3 text-sm font-body text-ta-gold hover:underline whitespace-nowrap"
              >
                View All →
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 bg-white border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="w-full border border-gray-200 rounded-sm pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-ta-gold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link
                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                className="absolute right-0 top-0 bottom-0 px-3 bg-ta-gold flex items-center rounded-r-sm"
              >
                <FiSearch className="text-white" size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 border-b border-gray-50 text-sm font-body hover:text-ta-gold"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
              <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-50 text-sm font-body hover:text-ta-gold">
                <FiUser size={18} /><span>My Account</span>
              </Link>
              <Link href="/track" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-50 text-sm font-body hover:text-ta-gold">
                <span>🚚</span><span>Track Order</span>
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-50 text-sm font-body hover:text-ta-gold">
                <span>📞</span><span>Contact Us</span>
              </Link>
              <Link href="/delivery" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-50 text-sm font-body hover:text-ta-gold">
                <span>🗺️</span><span>Delivery Zones</span>
              </Link>
              <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-sm font-body hover:text-ta-gold">
                <span>🛒</span><span>Cart</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
