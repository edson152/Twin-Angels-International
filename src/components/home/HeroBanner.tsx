'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminStore } from '@/lib/adminStore'

// Fallback default slides with real Unsplash images — replaced by admin banners when set
const DEFAULT_SLIDES = [
  {
    id: 0,
    title: 'Build Your Vision',
    subtitle: 'Premium Building Materials',
    description: 'Quality cement, steel, tiles, and more — sourced and delivered across Zimbabwe.',
    cta_text: 'Shop Building Materials',
    cta_url: '/products?category=building-materials',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
    bg_gradient: 'from-slate-900 via-slate-800 to-slate-700',
    is_active: true,
    sort_order: 1,
  },
  {
    id: -1,
    title: 'Outfit Your Office',
    subtitle: 'Premium Office & House Furniture',
    description: 'Ergonomic chairs, executive desks, and stylish home furnishings at trade prices.',
    cta_text: 'Browse Furniture',
    cta_url: '/products?category=office-furniture',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    bg_gradient: 'from-zinc-900 via-zinc-800 to-neutral-700',
    is_active: true,
    sort_order: 2,
  },
  {
    id: -2,
    title: 'Fabric Excellence',
    subtitle: 'Premium Fabric Rolls',
    description: 'Extensive range of cotton, polyester, satin and specialty fabrics for fashion and industry.',
    cta_text: 'Browse Fabrics',
    cta_url: '/products?category=fabric-rolls',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80',
    bg_gradient: 'from-amber-900 via-amber-800 to-stone-700',
    is_active: true,
    sort_order: 3,
  },
]

export default function HeroBanner() {
  const { banners } = useAdminStore()
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const adminSlides = banners.filter(b => b.is_active).sort((a, b) => a.sort_order - b.sort_order)
  // Only use admin slides if admin has customised any of them (has real image or non-default title)
  const slides = adminSlides.length > 0 && adminSlides.some(s => s.image || s.title !== 'Build Your Vision')
    ? adminSlides
    : DEFAULT_SLIDES

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!mounted) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gray-900 animate-pulse" />
    )
  }

  const slide = slides[current % slides.length]

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background image with crossfade */}
      {slides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current % slides.length ? 'opacity-100' : 'opacity-0'}`}>
          {s.image && (
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
          )}
          <div className={`absolute inset-0 bg-gradient-to-br ${s.bg_gradient} ${s.image ? 'opacity-60' : 'opacity-100'}`} />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-block bg-ta-gold/20 border border-ta-gold/40 backdrop-blur-sm text-ta-gold font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            {slide.subtitle}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display">
            {slide.title}
          </h1>
          {slide.description && (
            <p className="text-gray-200 text-xl mb-10 max-w-xl leading-relaxed">{slide.description}</p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link href={slide.cta_url || '/products'}
              className="inline-block bg-ta-gold hover:bg-ta-gold-dark text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 text-sm uppercase tracking-wide shadow-lg">
              {slide.cta_text}
            </Link>
            <Link href="/products"
              className="inline-block border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-full transition-all hover:bg-white/10 text-sm uppercase tracking-wide">
              All Products →
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current % slides.length ? 'bg-ta-gold w-8 h-2' : 'bg-white/40 hover:bg-white/70 w-2 h-2'}`} />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 text-white/50 text-xs font-mono flex flex-col items-center gap-1 animate-bounce hidden md:flex">
        <span>scroll</span>
        <span>↓</span>
      </div>
    </div>
  )
}
