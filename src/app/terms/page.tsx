import StoreLayout from '@/components/layout/StoreLayout'
import { COMPANY_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: `By accessing and using the Twin Angels International Development e-commerce platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.` },
    { title: '2. Products & Pricing', content: `All prices are displayed in USD or ZiG as selected. We reserve the right to update pricing at any time. Product images are for illustrative purposes. We make every effort to accurately describe products but cannot guarantee complete accuracy.` },
    { title: '3. Orders & Payment', content: `Orders are confirmed once payment is verified by our team. We support EcoCash, OneMoney, InnBucks, Bank Transfer, and Visa/Mastercard. For offline payments, customers must provide a valid payment reference for verification.` },
    { title: '4. Delivery', content: `Delivery times vary by zone. We aim for same-day delivery in Harare and 1–3 business days for other cities. Delivery fees are non-refundable once an order has been dispatched.` },
    { title: '5. Returns & Refunds', content: `Items may be returned within 7 days of delivery if they are defective or not as described. Items must be unused and in original packaging. Contact us via WhatsApp or email to initiate a return.` },
    { title: '6. Privacy', content: `We collect your personal information solely to process orders and provide customer support. We do not sell or share your data with third parties. Your WhatsApp number is used only for order notifications.` },
    { title: '7. Limitation of Liability', content: `Twin Angels International Development is not liable for any indirect or consequential damages arising from the use of our platform or products. Our maximum liability is limited to the value of the order in question.` },
    { title: '8. Contact', content: `For any questions regarding these terms, contact us at ${SUPPORT_EMAIL}.` },
  ]

  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-ta-dark mb-2">Terms & Conditions</h1>
          <p className="text-gray-400 text-sm">Last updated: January 2024 · {COMPANY_NAME}</p>
        </div>
        <div className="space-y-8">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="font-display font-semibold text-ta-dark text-lg mb-3">{s.title}</h2>
              <p className="text-gray-600 leading-relaxed font-body text-sm">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </StoreLayout>
  )
}
