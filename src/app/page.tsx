'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import HeroBanner from '@/components/home/HeroBanner'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const featuredProducts = [
  { id: 1, name: 'Portland Cement 50kg Bag', slug: 'portland-cement-50kg', price_usd: 12, compare_price_usd: 15, category: 'Building Materials', icon: '🧱', is_on_sale: true },
  { id: 2, name: 'Executive Office Chair — Leather', slug: 'executive-office-chair-leather', price_usd: 185, compare_price_usd: 220, category: 'Office Furniture', icon: '🪑', is_on_sale: true },
  { id: 3, name: 'Cotton Fabric Roll 60m', slug: 'cotton-poplin-60m', price_usd: 85, compare_price_usd: null, category: 'Fabric Rolls', icon: '🧵', is_on_sale: false },
  { id: 4, name: 'Digital Printing Machine A3', slug: 'digital-flatbed-printer-a3', price_usd: 1200, compare_price_usd: 1450, category: 'Printing Machines', icon: '🖨️', is_on_sale: true },
]

export default function HomePage() {
  const [trackInput, setTrackInput] = useState('')
  const router = useRouter()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(trackInput.trim() ? `/track?order=${encodeURIComponent(trackInput.trim())}` : '/track')
  }

  return (
    <StoreLayout>
      <HeroBanner />

      <div className="bg-ta-gold text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-body font-medium">
          <span>🚚 Free delivery in Harare on orders over $100</span>
          <span>🔒 Secure offline payment verification</span>
          <span>📱 WhatsApp order tracking</span>
          <span>🏭 FIFO warehouse processing</span>
        </div>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Shop by</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ta-dark">Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-sm border border-gray-100 p-6 text-center hover:border-ta-gold hover:shadow-md transition-all duration-200">
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className="font-body font-medium text-ta-dark text-sm group-hover:text-ta-gold transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/products" className="btn-secondary">View All Products</Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Hand-picked</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ta-dark">Featured Products</h2>
            </div>
            <Link href="/products" className="text-ta-gold hover:underline text-sm font-body hidden sm:block">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}
                className="group bg-white rounded-sm border border-gray-100 flex flex-col hover:shadow-md hover:border-ta-gold/30 transition-all duration-200">
                <div className="aspect-square bg-gray-50 flex items-center justify-center text-5xl relative overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform duration-200">{product.icon}</span>
                  {product.is_on_sale && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-sm">SALE</span>}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-ta-gold font-mono uppercase mb-1">{product.category}</p>
                  <h3 className="font-body font-medium text-ta-dark text-sm mb-2 flex-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-display font-bold text-ta-dark">${product.price_usd}</span>
                    {product.compare_price_usd && <span className="text-gray-400 text-sm line-through">${product.compare_price_usd}</span>}
                  </div>
                  <span className="w-full bg-ta-dark group-hover:bg-ta-gold text-white text-sm font-semibold py-2.5 rounded-sm text-center transition-colors block">
                    View Product
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Nationwide Delivery', desc: 'Harare, Bulawayo & all major cities', href: '/delivery' },
            { icon: '💳', title: 'Multiple Payments', desc: 'EcoCash, OneMoney, Bank Transfer & more', href: '/checkout' },
            { icon: '📱', title: 'WhatsApp Updates', desc: 'Real-time order notifications', href: '/contact' },
            { icon: '🔒', title: 'Secure Shopping', desc: 'Safe and verified transactions', href: '/terms' },
          ].map((badge) => (
            <Link key={badge.title} href={badge.href}
              className="text-center p-6 rounded-sm border border-gray-100 bg-white hover:border-ta-gold hover:shadow-sm transition-all">
              <span className="text-3xl block mb-3">{badge.icon}</span>
              <h3 className="font-body font-semibold text-ta-dark text-sm mb-1">{badge.title}</h3>
              <p className="text-gray-500 text-xs">{badge.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 bg-ta-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Track Your Order</h2>
          <p className="text-gray-400 mb-8">Enter your order number to get real-time updates on your delivery.</p>
          <form onSubmit={handleTrack} className="flex gap-0 max-w-md mx-auto">
            <input type="text" value={trackInput} onChange={e => setTrackInput(e.target.value)}
              placeholder="e.g. TA-00123"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-ta-gold rounded-l-sm" />
            <button type="submit" className="bg-ta-gold hover:bg-ta-gold-dark text-white px-6 py-3 font-semibold text-sm transition-colors rounded-r-sm whitespace-nowrap">
              Track Order
            </button>
          </form>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-body">
            {[
              { label: 'Contact Us', href: '/contact' },
              { label: 'Delivery Zones', href: '/delivery' },
              { label: 'Returns Policy', href: '/returns' },
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Admin Panel', href: '/admin' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-gray-500 hover:text-ta-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </StoreLayout>
  )
}
