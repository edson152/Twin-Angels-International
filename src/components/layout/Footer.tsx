'use client'
import Link from 'next/link'
import { CATEGORIES, WHATSAPP_SUPPORT, SUPPORT_EMAIL } from '@/lib/constants'
import { useAdminStore } from '@/lib/adminStore'
import { useState, useEffect } from 'react'

export default function Footer() {
  const { settings } = useAdminStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const siteName = mounted ? settings.site_name : 'Twin Angels International Development'
  const email = mounted ? settings.support_email : SUPPORT_EMAIL
  const whatsapp = mounted ? settings.whatsapp_number : WHATSAPP_SUPPORT
  const about = mounted ? settings.footer_about : "Zimbabwe's premier marketplace for industrial supplies, building materials, and quality furniture."

  return (
    <footer className="bg-ta-dark text-ta-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {mounted && settings.logo ? (
                <img src={settings.logo} alt={siteName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-ta-gold rounded-sm flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg">{mounted ? settings.logo_text || 'TA' : 'TA'}</span>
                </div>
              )}
              <div>
                <div className="font-display font-bold text-lg">{siteName.split(' ').slice(0, 2).join(' ')}</div>
                <div className="text-ta-gold text-xs font-mono tracking-widest uppercase">International</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{about}</p>
            <div className="flex gap-3">
              {mounted && settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-8 h-8 border border-gray-600 rounded-sm flex items-center justify-center hover:border-ta-gold hover:text-ta-gold transition-colors text-sm">f</a>
              )}
              {mounted && settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-8 h-8 border border-gray-600 rounded-sm flex items-center justify-center hover:border-ta-gold hover:text-ta-gold transition-colors text-sm">ig</a>
              )}
              {mounted && settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                  className="w-8 h-8 border border-gray-600 rounded-sm flex items-center justify-center hover:border-ta-gold hover:text-ta-gold transition-colors text-sm">𝕏</a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`}
                    className="text-gray-400 hover:text-ta-gold text-sm transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span><span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/track', label: 'Track Order' },
                { href: '/account', label: 'My Account' },
                { href: '/cart', label: 'Shopping Cart' },
                { href: '/checkout', label: 'Checkout' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-ta-gold text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-ta-gold mt-0.5">📧</span>
                <a href={`mailto:${email}`} className="hover:text-ta-gold transition-colors break-all">{email}</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ta-gold mt-0.5">💬</span>
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="hover:text-ta-gold transition-colors">WhatsApp Us</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ta-gold mt-0.5">📍</span>
                <span>Harare, Zimbabwe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ta-gold mt-0.5">🕐</span>
                <span>Mon–Fri: 8am–5pm<br />Sat: 8am–1pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/admin" className="hover:text-ta-gold transition-colors">Admin</Link>
            <span>•</span>
            <span>Built in Zimbabwe 🇿🇼</span>
            <span>•</span>
            <a href="mailto:edsonnyoni92@gmail.com"
              className="hover:text-ta-gold transition-colors">
              Developed by edsonnyoni92@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
