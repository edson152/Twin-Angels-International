'use client'
import { useState, useEffect } from 'react'
import StoreLayout from '@/components/layout/StoreLayout'
import HeroBanner from '@/components/home/HeroBanner'
import Link from 'next/link'
import { CATEGORIES, WHATSAPP_SUPPORT } from '@/lib/constants'
import { useAdminStore } from '@/lib/adminStore'

const CATEGORY_IMAGES: Record<string, string> = {
  'Building Materials': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  'Fabric Rolls':       'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
  'Printing Machines':  'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80',
  'Office Furniture':   'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
  'House Furniture':    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
}

const WHY_US = [
  { icon: '🚚', title: 'Nationwide Delivery', desc: 'We deliver to Harare, Bulawayo, Mutare, Gweru, Masvingo and rural areas across Zimbabwe.' },
  { icon: '🔒', title: 'Secure Payment', desc: 'Pay via EcoCash, InnBucks, OneMoney, Bank Transfer or Visa/Mastercard — all verified offline.' },
  { icon: '📱', title: 'WhatsApp Tracking', desc: 'Real-time order updates directly to your WhatsApp — know exactly where your order is.' },
  { icon: '🏭', title: 'FIFO Warehouse', desc: 'First In, First Out processing ensures your order is picked and dispatched in strict sequence.' },
  { icon: '💰', title: 'USD & ZiG Pricing', desc: 'All products priced in both US Dollars and Zimbabwe Gold for your convenience.' },
  { icon: '✅', title: 'Quality Guaranteed', desc: 'Every product is quality-checked before dispatch. Not satisfied? Contact us immediately.' },
]

const TESTIMONIALS = [
  { name: 'John Moyo', location: 'Harare', text: 'Ordered cement and steel for my construction project. Delivered on time and at a great price. Will definitely use Twin Angels again!', stars: 5, product: 'Portland Cement + Steel Rebar' },
  { name: 'Grace Ndlovu', location: 'Bulawayo', text: 'The fabric quality is outstanding. I\'ve ordered cotton poplin rolls three times now and each time it\'s been perfect for my tailoring business.', stars: 5, product: 'Cotton Poplin Fabric' },
  { name: 'Michael Choto', location: 'Mutare', text: 'Bought an office chair and desk — great quality for the price. The WhatsApp tracking kept me informed the whole way.', stars: 5, product: 'Executive Office Chair' },
]

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

  const whatsapp = mounted ? settings.whatsapp_number.replace(/\D/g, '') : '263'

  return (
    <StoreLayout>
      {/* ── Hero ── */}
      <HeroBanner />

      {/* ── Scrolling promo strip ── */}
      <div className="bg-ta-gold text-white overflow-hidden">
        <div className="flex items-center max-w-7xl mx-auto px-4 py-3 gap-8 overflow-x-auto scrollbar-hide">
          {promoStrip.map((item, i) => (
            <span key={i} className="text-sm font-semibold whitespace-nowrap shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Products' },
            { value: '10k+', label: 'Orders Fulfilled' },
            { value: '6', label: 'Delivery Zones' },
            { value: '5⭐', label: 'Customer Rating' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-ta-gold font-mono font-bold text-3xl mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories with images ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-3">Everything you need</p>
          <h2 className="font-display text-4xl font-bold text-ta-dark">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] flex flex-col justify-end shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <img
                src={CATEGORY_IMAGES[cat.name]}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative p-4">
                <span className="text-2xl block mb-1">{cat.icon}</span>
                <span className="text-white font-semibold text-sm leading-tight block">{cat.name}</span>
                <span className="text-ta-gold text-xs mt-1 block group-hover:underline">Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      {homeProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-3">Hand-picked</p>
                <h2 className="font-display text-4xl font-bold text-ta-dark">Featured Products</h2>
              </div>
              <Link href="/products" className="text-ta-gold font-semibold text-sm hover:underline hidden sm:block">View All Products →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeProducts.slice(0, 8).map((product) => {
                const catImg = CATEGORY_IMAGES[product.category]
                const discount = product.compare_price_usd > product.price_usd
                  ? Math.round((1 - product.price_usd / product.compare_price_usd) * 100) : 0
                return (
                  <Link key={product.id} href={`/products/${product.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-ta-gold hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden bg-gray-50">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : catImg ? (
                        <img src={catImg} alt={product.name} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          {CATEGORIES.find(c => c.name === product.category)?.icon || '📦'}
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</div>
                      )}
                      {product.is_featured && (
                        <div className="absolute top-3 right-3 bg-ta-gold text-white text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-ta-gold text-xs font-mono uppercase mb-1">{product.category}</p>
                      <h3 className="font-semibold text-ta-dark text-sm line-clamp-2 mb-3 group-hover:text-ta-gold transition-colors">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-display font-bold text-ta-dark text-lg">${product.price_usd}</span>
                          {product.compare_price_usd > product.price_usd && (
                            <span className="text-gray-400 text-xs line-through ml-2">${product.compare_price_usd}</span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? `${product.stock} left` : 'In stock'}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/products" className="btn-primary">Browse All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Category spotlight — two big banners ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/products?category=building-materials"
            className="group relative h-64 rounded-xl overflow-hidden flex items-end p-8 shadow-lg hover:shadow-xl transition-all">
            <img src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80"
              alt="Building Materials" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative">
              <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-1">New Arrivals</p>
              <h3 className="text-white font-display text-2xl font-bold mb-3">Building Materials</h3>
              <span className="inline-block bg-ta-gold text-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-white group-hover:text-ta-gold transition-colors">Shop Now →</span>
            </div>
          </Link>
          <Link href="/products?category=office-furniture"
            className="group relative h-64 rounded-xl overflow-hidden flex items-end p-8 shadow-lg hover:shadow-xl transition-all">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              alt="Office Furniture" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative">
              <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-1">Premium Range</p>
              <h3 className="text-white font-display text-2xl font-bold mb-3">Office Furniture</h3>
              <span className="inline-block bg-ta-gold text-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-white group-hover:text-ta-gold transition-colors">Shop Now →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-20 bg-ta-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-3">Our Promise</p>
            <h2 className="font-display text-4xl font-bold">Why Twin Angels?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map(item => (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 bg-ta-gold/10 border border-ta-gold/20 rounded-xl flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-display font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-3">What customers say</p>
            <h2 className="font-display text-4xl font-bold text-ta-dark">Customer Reviews</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-ta-gold">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-ta-dark text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location} · {t.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fabric + Printing spotlight ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/products?category=fabric-rolls"
            className="group relative h-56 rounded-xl overflow-hidden flex items-end p-8 shadow-lg hover:shadow-xl transition-all">
            <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"
              alt="Fabric" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative">
              <h3 className="text-white font-display text-xl font-bold mb-2">Premium Fabric Rolls</h3>
              <span className="text-ta-gold text-sm font-semibold group-hover:underline">Browse fabrics →</span>
            </div>
          </Link>
          <Link href="/products?category=printing-machines"
            className="group relative h-56 rounded-xl overflow-hidden flex items-end p-8 shadow-lg hover:shadow-xl transition-all">
            <img src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80"
              alt="Printers" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative">
              <h3 className="text-white font-display text-xl font-bold mb-2">Printing Machines</h3>
              <span className="text-ta-gold text-sm font-semibold group-hover:underline">View printers →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=1600&q=80"
          alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/85" />
        <div className="relative max-w-2xl mx-auto px-4 text-center text-white">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-4">We're here to help</p>
          <h2 className="font-display text-4xl font-bold mb-4">Can't find what you need?</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">We source products across Zimbabwe and internationally. Send us a WhatsApp and our team will find it for you within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${whatsapp}?text=Hi Twin Angels, I need help finding a product`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-wide">
              💬 WhatsApp Us Now
            </a>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 border-2 border-ta-gold text-ta-gold hover:bg-ta-gold hover:text-white font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-wide">
              🛍️ Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </StoreLayout>
  )
}
