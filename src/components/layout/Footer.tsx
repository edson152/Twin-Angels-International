import Link from 'next/link'
import { CATEGORIES, WHATSAPP_SUPPORT, SUPPORT_EMAIL, COMPANY_NAME } from '@/lib/constants'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-ta-dark text-ta-cream">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-ta-gold rounded-sm flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">TA</span>
              </div>
              <div>
                <div className="font-display font-bold text-lg">Twin Angels</div>
                <div className="text-ta-gold text-xs font-mono tracking-widest uppercase">
                  International
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Zimbabwe&apos;s premier marketplace for industrial supplies, building materials, and
              quality furniture. Serving Harare and beyond.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 border border-gray-600 rounded-sm flex items-center justify-center hover:border-ta-gold hover:text-ta-gold transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-gray-400 hover:text-ta-gold text-sm transition-colors flex items-center gap-2"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Track My Order', href: '/track' },
                { label: 'My Account', href: '/account' },
                { label: 'Shopping Cart', href: '/cart' },
                { label: 'Delivery Zones', href: '/delivery' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Returns Policy', href: '/returns' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-ta-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin size={16} className="text-ta-gold mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">Harare, Zimbabwe</span>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-ta-gold text-sm transition-colors"
                >
                  <FiMail size={16} className="text-ta-gold shrink-0" />
                  <span>{SUPPORT_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_SUPPORT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-ta-gold text-sm transition-colors"
                >
                  <FiPhone size={16} className="text-ta-gold shrink-0" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi Twin Angels, I need help with my order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-sm transition-colors w-full justify-center"
            >
              <span>💬</span>
              <span>WhatsApp Us Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs">Payments accepted:</span>
            <div className="flex gap-2">
              {['EcoCash', 'OneMoney', 'InnBucks', 'Visa'].map((p) => (
                <span
                  key={p}
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-sm font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
