'use client'
import { useState, useEffect } from 'react'
import StoreLayout from '@/components/layout/StoreLayout'
import HeroBanner from '@/components/home/HeroBanner'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'
import { useAdminStore } from '@/lib/adminStore'

export default function HomePage() {
  const { products, settings } = useAdminStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const homeProducts = mounted ? products.filter(p => p.show_on_home && p.is_active) : []
  const promoStrip = mounted ? settings.promo_strip : [
    '🚚 Free delivery in Harare on orders over $100',
    '🔒 Secure offline payment verification',
    '📱 WhatsApp order tracking',
    '🏭 FIFO warehouse processing',
  ]

  return (
    <StoreLayout>
      {/* Hero */}
      <HeroBanner />

      {/* Promo strip */}
      <div className="bg-ta-gold text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 text-sm font-body font-medium">
          {promoStrip.map((item, i) => <span key={i}>{item}</span>)}
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Shop by</p>
          <h2 className="section-title gold-underline pb-3">Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className="bg-white border border-gray-100 hover:border-ta-gold rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:shadow-lg group">
              <span className="text-4xl">{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-ta-gold transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products from Admin */}
      {homeProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Hand-picked</p>
                <h2 className="section-title gold-underline pb-3">Featured Products</h2>
              </div>
              <Link href="/products" className="text-ta-gold font-semibold text-sm hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-ta-gold hover:shadow-lg transition-all group">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
                        {CATEGORIES.find(c => c.name === product.category)?.icon || '📦'}
                      </div>
                    )}
                    {product.is_on_sale && product.compare_price_usd > product.price_usd && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{Math.round((1 - product.price_usd / product.compare_price_usd) * 100)}%
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-ta-gold text-white text-xs font-bold px-2 py-1 rounded">⭐</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-xs mb-1">{product.category}</p>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-ta-gold transition-colors">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-ta-gold font-bold font-mono">${product.price_usd}</span>
                      {product.compare_price_usd > product.price_usd && (
                        <span className="text-gray-400 text-xs line-through">${product.compare_price_usd}</span>
                      )}
                    </div>
                    <div className={`text-xs mt-1 ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-amber-500' : 'text-green-600'}`}>
                      {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Can't find what you need?</h2>
          <p className="text-gray-400 mb-8">Contact us on WhatsApp and we'll source it for you.</p>
          <a href={`https://wa.me/${mounted ? settings.whatsapp_number.replace(/\D/g, '') : '263'}`}
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">
            💬 WhatsApp Us
          </a>
        </div>
      </section>
    </StoreLayout>
  )
}
