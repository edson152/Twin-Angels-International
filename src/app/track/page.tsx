'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '🛒', desc: 'Your order has been received' },
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: '💳', desc: 'Payment verified by our team' },
  { key: 'processing', label: 'Processing', icon: '⚙️', desc: 'Order is being prepared' },
  { key: 'warehouse_picking', label: 'Being Picked', icon: '📦', desc: 'Items being collected from warehouse' },
  { key: 'ready_for_dispatch', label: 'Ready to Ship', icon: '✅', desc: 'Order packed and ready to go' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚚', desc: 'On its way to your area' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '📍', desc: 'Driver is heading to your address' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Successfully delivered!' },
]

// Demo orders for testing — always available
const DEMO_ORDERS: Record<string, any> = {
  'TA-00001': {
    order_number: 'TA-00001',
    status: 'out_for_delivery',
    customer_name: 'Demo Customer',
    total: 97,
    currency: 'USD',
    delivery_zone: 'Harare',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimated_delivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    items: [
      { name: 'Portland Cement 50kg × 5', quantity: 5, price: 12 },
      { name: 'Steel Rebar 12mm × 1', quantity: 1, price: 45 },
    ],
    driver: { name: 'Takudzwa Moyo', phone: '+263 77 111 2222' },
  },
  'TA-00002': {
    order_number: 'TA-00002',
    status: 'processing',
    customer_name: 'Demo Customer',
    total: 185,
    currency: 'USD',
    delivery_zone: 'Bulawayo',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ name: 'Executive Leather Chair', quantity: 1, price: 185 }],
    driver: null,
  },
  'TA-00003': {
    order_number: 'TA-00003',
    status: 'delivered',
    customer_name: 'Demo Customer',
    total: 420,
    currency: 'USD',
    delivery_zone: 'Harare',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimated_delivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ name: '3-Seater Fabric Sofa', quantity: 1, price: 420 }],
    driver: null,
  },
}

function TrackContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-track if order number in URL
  useEffect(() => {
    const num = searchParams.get('order')
    if (num) handleTrack(null, num)
  }, [])

  const handleTrack = async (e: React.FormEvent | null, overrideNum?: string) => {
    if (e) e.preventDefault()
    const num = (overrideNum || orderNumber).trim().toUpperCase()
    if (!num) return
    setLoading(true)
    setError('')
    setOrder(null)

    // Check demo orders first (always available)
    if (DEMO_ORDERS[num]) {
      setOrder(DEMO_ORDERS[num])
      setLoading(false)
      return
    }

    // Check localStorage for orders placed this session
    try {
      const stored = localStorage.getItem('ta_orders')
      if (stored) {
        const localOrders = JSON.parse(stored)
        if (localOrders[num]) {
          setOrder(localOrders[num])
          setLoading(false)
          return
        }
      }
    } catch {}

    // Try API (works if server hasn't restarted)
    try {
      const res = await fetch(`/api/orders/${num}/track`)
      if (res.ok) {
        setOrder(await res.json())
        setLoading(false)
        return
      }
    } catch {}

    setError('Order not found. If you just placed an order, please save your order number. Try demo orders: TA-00001, TA-00002, or TA-00003')
    setLoading(false)
  }

  const currentStepIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-ta-gold/10 border border-ta-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
        <h1 className="font-display text-4xl font-bold text-ta-dark mb-3">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number to see real-time delivery status</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleTrack} className="flex gap-3 mb-4">
        <input
          type="text"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value.toUpperCase())}
          placeholder="Enter order number e.g. TA-00001"
          className="input-field flex-1 font-mono text-lg"
        />
        <button type="submit" disabled={loading}
          className="btn-primary px-8 shrink-0 disabled:opacity-50 flex items-center gap-2">
          {loading ? <span className="animate-spin">⟳</span> : '🔍'} Track
        </button>
      </form>

      {/* Demo hint */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs text-gray-400">Try demo:</span>
        {['TA-00001', 'TA-00002', 'TA-00003'].map(n => (
          <button key={n} onClick={() => { setOrderNumber(n); handleTrack(null, n) }}
            className="text-xs bg-gray-100 hover:bg-ta-gold/10 hover:text-ta-gold border border-gray-200 hover:border-ta-gold/30 px-2 py-1 rounded font-mono transition-colors">
            {n}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Order header */}
          <div className="bg-ta-dark text-white p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-mono">Order Number</p>
                <p className="font-mono font-bold text-ta-gold text-2xl">{order.order_number}</p>
                <p className="text-gray-300 text-sm mt-1">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-mono">Order Total</p>
                <p className="font-mono font-bold text-xl">{order.currency === 'USD' ? '$' : 'ZiG '}{Number(order.total).toLocaleString()}</p>
                {order.delivery_zone && (
                  <p className="text-gray-400 text-sm mt-1">📍 {order.delivery_zone}</p>
                )}
              </div>
            </div>
            {/* Estimated delivery */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-6 text-sm text-gray-400">
              <span>📅 Ordered: <span className="text-white">{new Date(order.created_at).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
              {order.estimated_delivery && (
                <span>🚚 Est. delivery: <span className="text-ta-gold font-semibold">{new Date(order.estimated_delivery).toLocaleDateString('en-ZW', { weekday: 'short', day: 'numeric', month: 'short' })}</span></span>
              )}
            </div>
          </div>

          {/* Progress tracker */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-display font-bold text-ta-dark mb-5">Delivery Progress</h2>
            <div className="space-y-1">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex
                const isCurrent = idx === currentStepIndex
                return (
                  <div key={step.key} className="flex items-start gap-4 py-2">
                    {/* Icon + line */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                        isCurrent ? 'bg-ta-gold shadow-lg shadow-ta-gold/30 scale-110' :
                        isDone ? 'bg-green-100 border-2 border-green-400' :
                        'bg-gray-100 border border-gray-200'
                      }`}>
                        {step.icon}
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 h-4 mt-1 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-ta-gold' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-xs bg-ta-gold/10 text-ta-gold border border-ta-gold/20 px-2 py-0.5 rounded-full font-bold">CURRENT</span>}
                      </p>
                      {(isDone || isCurrent) && (
                        <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                      )}
                    </div>
                    {isDone && !isCurrent && <span className="text-green-500 shrink-0 pt-2">✓</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Driver info */}
          {order.driver && (
            <div className="p-6 border-b border-gray-100 bg-blue-50">
              <h3 className="font-semibold text-blue-900 text-sm mb-3">🚚 Your Delivery Driver</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-800">{order.driver.name}</p>
                  {order.driver.phone && <p className="text-blue-600 text-sm">{order.driver.phone}</p>}
                </div>
                {order.driver.phone && (
                  <a href={`https://wa.me/${order.driver.phone.replace(/\D/g,'')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
                    💬 WhatsApp Driver
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          {order.items?.length > 0 && (
            <div className="p-6">
              <h3 className="font-semibold text-ta-dark text-sm mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ''}</span>
                    <span className="font-mono font-semibold">{order.currency === 'USD' ? '$' : 'ZiG '}{Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ta-dark text-sm">Need help with your order?</p>
                <p className="text-gray-400 text-xs mt-0.5">Contact our support team</p>
              </div>
              <a href="https://wa.me/263?text=Hi, I need help with my order"
                target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tip when no order */}
      {!order && !error && (
        <div className="text-center text-gray-400 py-8 text-sm">
          <p>Your order number was sent to your email and WhatsApp when you placed your order.</p>
          <Link href="/products" className="mt-4 inline-block text-ta-gold hover:underline">← Back to shopping</Link>
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-96 text-gray-400">Loading...</div>}>
        <TrackContent />
      </Suspense>
    </StoreLayout>
  )
}
