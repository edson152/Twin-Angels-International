import StoreLayout from '@/components/layout/StoreLayout'
import { DELIVERY_ZONES } from '@/lib/constants'
import Link from 'next/link'

export default function DeliveryPage() {
  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Shipping info</p>
          <h1 className="font-display text-4xl font-bold text-ta-dark mb-4">Delivery Zones & Fees</h1>
          <p className="text-gray-500">We deliver across Zimbabwe. Select your zone at checkout — fees are calculated automatically.</p>
        </div>

        {/* Zone Table */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden mb-8">
          <div className="bg-ta-dark px-6 py-4">
            <div className="grid grid-cols-3 text-ta-gold font-mono text-xs uppercase tracking-wider">
              <span>Zone</span>
              <span>USD Fee</span>
              <span>ZiG Fee</span>
            </div>
          </div>
          {DELIVERY_ZONES.map((zone, i) => (
            <div key={zone.id} className={`px-6 py-4 grid grid-cols-3 items-center border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="font-body font-medium text-ta-dark">{zone.name}</span>
              </div>
              <span className="font-mono font-bold text-ta-gold">${zone.fee_usd}</span>
              <span className="font-mono text-gray-600">ZiG {zone.fee_zig.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: '🚚', title: 'Free delivery in Harare', desc: 'On all orders over $100 within Harare.' },
            { icon: '⏱️', title: 'Delivery time', desc: 'Harare: same day. Other cities: 1–3 business days.' },
            { icon: '📱', title: 'Real-time tracking', desc: 'Get WhatsApp updates from dispatch to your door.' },
          ].map(card => (
            <div key={card.title} className="bg-white border border-gray-100 rounded-sm p-5 text-center">
              <span className="text-3xl block mb-3">{card.icon}</span>
              <h3 className="font-body font-semibold text-ta-dark text-sm mb-2">{card.title}</h3>
              <p className="text-gray-500 text-xs">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    </StoreLayout>
  )
}
