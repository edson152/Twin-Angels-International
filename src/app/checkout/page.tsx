'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import { useCartStore } from '@/lib/store'
import { DELIVERY_ZONES, PAYMENT_METHODS } from '@/lib/constants'
import { useState } from 'react'
import { FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, subtotal, currency, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedZone, setSelectedZone] = useState('harare')
  const [selectedPayment, setSelectedPayment] = useState('ecocash')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', notes: '',
  })

  const symbol = currency === 'USD' ? '$' : 'ZiG'
  const zone = DELIVERY_ZONES.find(z => z.id === selectedZone)!
  const deliveryFee = currency === 'USD' ? zone.fee_usd : zone.fee_zig
  const total = subtotal() + deliveryFee

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          currency,
          delivery_zone: selectedZone,
          payment_method: selectedPayment,
          subtotal: subtotal(),
          delivery_fee: deliveryFee,
          total,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // Save to localStorage so track page works even after server restart
        try {
          const stored = JSON.parse(localStorage.getItem('ta_orders') || '{}')
          stored[data.order_number] = {
            order_number: data.order_number,
            status: 'pending',
            customer_name: `${customer.firstName} ${customer.lastName}`,
            total,
            currency,
            delivery_zone: selectedZone,
            created_at: new Date().toISOString(),
            estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            items: items.map(i => ({ name: i.name, quantity: i.quantity, price: currency === 'USD' ? i.price_usd : i.price_zig })),
            driver: null,
          }
          localStorage.setItem('ta_orders', JSON.stringify(stored))
        } catch {}
        clearCart()
        router.push(`/checkout/success?order=${data.order_number}`)
      } else {
        toast.error(data.error || 'Failed to place order')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-ta-dark mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-sm border border-gray-100 p-6">
                <h2 className="font-display font-semibold text-ta-dark mb-4">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required className="input-field" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required className="input-field" placeholder="Doe" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">WhatsApp / Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="+263 7XX XXX XXX" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Delivery Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} required className="input-field" placeholder="123 Main Street, Suburb" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Delivery Zone *</label>
                    <select name="city" value={selectedZone} onChange={e => setSelectedZone(e.target.value)} className="input-field">
                      {DELIVERY_ZONES.map(z => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Order Notes</label>
                    <input name="notes" value={form.notes} onChange={handleChange} className="input-field" placeholder="Any special instructions..." />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-sm border border-gray-100 p-6">
                <h2 className="font-display font-semibold text-ta-dark mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.filter(m => m.currencies.includes(currency)).map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${selectedPayment === method.id ? 'border-ta-gold bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                        className="accent-ta-gold"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-body font-medium text-sm">{method.name}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
                  <strong>📋 Offline Payment:</strong> After placing your order, our team will contact you via WhatsApp with payment instructions. Your order will be confirmed once payment is verified.
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-display font-bold text-ta-dark text-lg mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map(item => {
                    const price = currency === 'USD' ? item.price_usd : item.price_zig
                    return (
                      <div key={item.id} className="flex justify-between text-sm font-body">
                        <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                        <span className="font-medium shrink-0">{symbol} {(price * item.quantity).toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{symbol} {subtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-600">Delivery</span>
                    <span>{symbol} {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-lg border-t pt-3">
                    <span>Total</span>
                    <span className="text-ta-gold">{symbol} {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLock size={16} />
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StoreLayout>
  )
}
