import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { WHATSAPP_SUPPORT } from '@/lib/constants'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  const orderNumber = searchParams.order || 'TA-XXXXX'

  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto px-4 py-24 text-center page-enter">
        {/* Success animation */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="font-display text-4xl font-bold text-ta-dark mb-4">
          Order Placed!
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Thank you for shopping with Twin Angels.
        </p>
        <p className="text-gray-400 mb-8">
          Your order number is{' '}
          <span className="font-mono font-bold text-ta-gold text-xl">{orderNumber}</span>
        </p>

        {/* Next steps */}
        <div className="bg-white rounded-sm border border-gray-100 p-6 text-left mb-8">
          <h2 className="font-display font-semibold text-ta-dark mb-4">What happens next?</h2>
          <div className="space-y-4">
            {[
              { icon: '📱', step: '1', title: 'WhatsApp Confirmation', desc: "You'll receive a WhatsApp message shortly with your order details and payment instructions." },
              { icon: '💳', step: '2', title: 'Complete Payment', desc: 'Follow the payment instructions sent to your WhatsApp. Our team will verify your payment.' },
              { icon: '📦', step: '3', title: 'Order Processing', desc: 'Once payment is confirmed, your order moves to our warehouse for picking and packing.' },
              { icon: '🚚', step: '4', title: 'Delivery', desc: "You'll receive a WhatsApp notification when your order is dispatched with driver details." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 bg-ta-gold/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-ta-gold font-mono font-bold text-xs">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-ta-dark text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/track?order=${orderNumber}`} className="btn-primary">
            Track My Order
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi, my order number is ${orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            💬 WhatsApp Support
          </a>
          <Link href="/products" className="btn-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </StoreLayout>
  )
}
