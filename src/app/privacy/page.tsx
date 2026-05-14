import StoreLayout from '@/components/layout/StoreLayout'
import { COMPANY_NAME, SUPPORT_EMAIL } from '@/lib/constants'

export default function PrivacyPage() {
  const sections = [
    { title: 'Information We Collect', content: 'We collect your name, email address, phone number, and delivery address when you place an order. We also collect payment reference numbers for verification purposes.' },
    { title: 'How We Use Your Information', content: 'Your information is used solely to process your orders, send WhatsApp delivery notifications, and provide customer support. We do not use your data for marketing without your consent.' },
    { title: 'WhatsApp Notifications', content: 'By providing your phone number, you consent to receiving automated WhatsApp messages related to your order status. These include order confirmation, payment confirmation, dispatch updates, and delivery confirmation.' },
    { title: 'Data Security', content: 'We take reasonable measures to protect your personal information. Payment references are verified and then stored securely. We do not store full card numbers.' },
    { title: 'Third Parties', content: 'We do not sell, trade, or share your personal information with third parties except as necessary to complete your order (e.g. delivery drivers receive your address and phone number).' },
    { title: 'Your Rights', content: 'You may request to view, update, or delete your personal information at any time by contacting us at ' + SUPPORT_EMAIL + '.' },
    { title: 'Changes to This Policy', content: 'We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.' },
  ]

  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-ta-dark mb-2">Privacy Policy</h1>
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
