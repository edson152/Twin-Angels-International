import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { WHATSAPP_SUPPORT, SUPPORT_EMAIL } from '@/lib/constants'

export default function ReturnsPage() {
  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Our policy</p>
          <h1 className="font-display text-4xl font-bold text-ta-dark mb-4">Returns & Refunds</h1>
          <p className="text-gray-500">We want you to be completely satisfied with your purchase.</p>
        </div>

        <div className="space-y-6">
          {[
            { icon: '📦', title: '7-Day Return Window', desc: 'You may return items within 7 days of delivery. Items must be unused, in original packaging, and in the same condition as received.' },
            { icon: '🔍', title: 'Eligible Returns', desc: 'Defective or damaged items, items not matching the product description, and incorrect items delivered are all eligible for a full refund or replacement.' },
            { icon: '❌', title: 'Non-Returnable Items', desc: 'Custom orders, cut fabric rolls, opened printing consumables, and items damaged through customer misuse are not eligible for returns.' },
            { icon: '💳', title: 'Refund Process', desc: 'Once your return is approved, refunds are processed within 3–5 business days via the same payment method used. Delivery fees are non-refundable.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 bg-white border border-gray-100 rounded-sm p-5">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-body font-semibold text-ta-dark mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-ta-dark rounded-sm p-6 text-center">
          <h2 className="font-display text-xl font-bold text-white mb-2">Want to make a return?</h2>
          <p className="text-gray-400 text-sm mb-5">Contact us first and we'll guide you through the process.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi, I'd like to return an item.`} target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-sm text-sm transition-colors">
              💬 WhatsApp Us
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="btn-secondary text-sm px-6 py-2.5">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
