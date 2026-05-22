'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminStore } from '@/lib/adminStore'

export default function HeroBanner() {
  const { banners } = useAdminStore()
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)

  const activeSlides = banners.filter(b => b.is_active).sort((a, b) => a.sort_order - b.sort_order)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (activeSlides.length <= 1) return
    const t = setInterval(() => setCurrent(c => (c + 1) % activeSlides.length), 6000)
    return () => clearInterval(t)
  }, [activeSlides.length])

  if (!mounted || activeSlides.length === 0) {
    return (
      <div className="relative h-[60vh] min-h-[400px] bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-2xl font-bold mb-2">No active banners</p>
          <p className="text-sm">Add banners in the admin panel</p>
        </div>
      </div>
    )
  }

  const slide = activeSlides[current % activeSlides.length]

  return (
    <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg_gradient} transition-all duration-700`}>
        {slide.image && (
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-40" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-3">{slide.subtitle}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
          {slide.description && (
            <p className="text-gray-200 text-lg mb-8 max-w-lg">{slide.description}</p>
          )}
          <Link href={slide.cta_url || '/products'}
            className="inline-block bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm tracking-wide">
            {slide.cta_text}
          </Link>
        </div>
      </div>

      {/* Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {activeSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current % activeSlides.length ? 'bg-ta-gold w-6' : 'bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
      )}
    </div>
  )
}
