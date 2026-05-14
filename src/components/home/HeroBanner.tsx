'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    title: 'Build Your Vision',
    subtitle: 'Premium Building Materials',
    description: 'Quality cement, steel, tiles, and more — delivered to your site across Zimbabwe.',
    cta: 'Shop Building Materials',
    href: '/products?category=building-materials',
    bg: 'from-slate-900 via-slate-800 to-slate-700',
    accent: 'text-ta-gold',
    badge: '⚡ Fast Delivery',
  },
  {
    id: 2,
    title: 'Fabric Excellence',
    subtitle: 'Premium Fabric Rolls',
    description: 'Extensive range of fabric rolls for fashion, upholstery, and industrial use.',
    cta: 'Browse Fabrics',
    href: '/products?category=fabric-rolls',
    bg: 'from-amber-900 via-amber-800 to-stone-700',
    accent: 'text-amber-200',
    badge: '🎨 Wide Selection',
  },
  {
    id: 3,
    title: 'Outfit Your Office',
    subtitle: 'Premium Office Furniture',
    description: 'Ergonomic desks, executive chairs, and complete office setups. In stock now.',
    cta: 'View Furniture',
    href: '/products?category=office-furniture',
    bg: 'from-gray-900 via-zinc-800 to-neutral-700',
    accent: 'text-ta-gold',
    badge: '🏆 Top Brands',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length)
        setIsAnimating(false)
      }, 300)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx: number) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setIsAnimating(false)
    }, 150)
  }

  const slide = slides[current]

  return (
    <section
      className={`relative bg-gradient-to-r ${slide.bg} transition-all duration-500 overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-ta-gold blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-2xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div
          className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          {/* Badge */}
          <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-mono tracking-widest px-3 py-1.5 rounded-sm mb-6 uppercase">
            {slide.badge}
          </span>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3">
            {slide.title}
          </h1>
          <h2 className={`font-display text-2xl md:text-3xl font-medium mb-6 ${slide.accent}`}>
            {slide.subtitle}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={slide.href}
              className="bg-ta-gold hover:bg-ta-gold-dark text-white font-body font-semibold px-8 py-4 rounded-sm text-sm tracking-wide uppercase transition-all duration-200 hover:shadow-lg hover:shadow-ta-gold/25"
            >
              {slide.cta}
            </Link>
            <Link
              href="/products"
              className="border border-white/30 hover:border-white text-white font-body font-semibold px-8 py-4 rounded-sm text-sm tracking-wide uppercase transition-all duration-200 backdrop-blur-sm"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-ta-gold' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-8 font-mono text-white/40 text-xs">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
