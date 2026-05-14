import StoreLayout from '@/components/layout/StoreLayout'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT } from '@/lib/constants'
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi'

export default function ContactPage() {
  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Get in touch</p>
          <h1 className="font-display text-4xl font-bold text-ta-dark">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white border border-gray-100 rounded-sm p-6">
            <h2 className="font-display font-semibold text-ta-dark mb-5">Send us a message</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name</label>
                  <input type="text" className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                  <input type="text" className="input-field" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" className="input-field" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone / WhatsApp</label>
                <input type="text" className="input-field" placeholder="+263 7XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Subject</label>
                <input type="text" className="input-field" placeholder="Order enquiry, product info..." />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea rows={4} className="input-field resize-none" placeholder="How can we help you?" />
              </div>
              <button className="btn-primary w-full">Send Message</button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            {[
              { icon: FiPhone, title: 'WhatsApp Support', value: WHATSAPP_SUPPORT, href: `https://wa.me/${WHATSAPP_SUPPORT}`, sub: 'Fastest response — click to chat' },
              { icon: FiMail, title: 'Email', value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}`, sub: 'We reply within 24 hours' },
              { icon: FiMapPin, title: 'Location', value: 'Harare, Zimbabwe', href: '#', sub: 'Serving all major cities' },
              { icon: FiClock, title: 'Business Hours', value: 'Mon – Sat: 8am – 6pm', href: '#', sub: 'Sunday: 9am – 1pm' },
            ].map(({ icon: Icon, title, value, href, sub }) => (
              <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-sm p-5 hover:border-ta-gold transition-colors group">
                <div className="w-10 h-10 bg-ta-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-ta-gold group-hover:text-white transition-colors">
                  <Icon size={18} className="text-ta-gold group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-0.5">{title}</p>
                  <p className="font-body font-medium text-ta-dark">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </a>
            ))}

            <a
              href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi Twin Angels, I need some help.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-sm transition-colors text-sm"
            >
              💬 Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
