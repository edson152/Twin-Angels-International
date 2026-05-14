'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import { useState } from 'react'
import { ORDER_STATUS_LABELS } from '@/lib/constants'

const STATUS_STEPS = [
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: '💳' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'warehouse_picking', label: 'Being Picked', icon: '📦' },
  { key: 'ready_for_dispatch', label: 'Ready to Ship', icon: '✅' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '📍' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
]

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<null | {
    order_number: string
    status: string
    customer_name: string
    total: number
    currency: string
    created_at: string
    estimated_delivery: string
    items: Array<{ name: string; quantity: number; price: number }>
    driver?: { name: string; phone: string }
  }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/${orderNumber.trim()}/track`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        setError('Order not found. Please check your order number and try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex(s => s.key === order.status)
    : -1

  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">Real-time</p>
          <h1 className="font-display text-4xl font-bold text-ta-dark mb-4">Track Your Order</h1>
          <p className="text-gray-500">Enter your order number to see live delivery status.</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-0 mb-8">
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="Enter order number e.g. TA-00123"
            className="flex-1 border border-gray-200 rounded-l-sm px-4 py-3 text-sm focus:outline-none focus:border-ta-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-ta-gold hover:bg-ta-gold-dark text-white px-8 py-3 font-semibold text-sm rounded-r-sm transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm mb-6">
            {error}
          </div>
        )}

        {order && (
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-ta-dark text-white px-6 py-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">Order Number</p>
                  <h2 className="font-display text-xl font-bold text-ta-gold">{order.order_number}</h2>
                </div>
                <span className={`badge-status-${order.status.includes('deliver') ? 'delivered' : order.status.includes('dispatch') ? 'dispatched' : 'processing'} text-sm`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="px-6 py-8">
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-ta-gold transition-all duration-500"
                  style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                />
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step.key} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        idx <= currentStepIndex
                          ? 'bg-ta-gold border-ta-gold shadow-lg shadow-ta-gold/20'
                          : 'bg-white border-gray-200'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-xs font-body text-center hidden sm:block ${idx <= currentStepIndex ? 'text-ta-gold font-semibold' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Driver info if dispatched */}
            {order.driver && (
              <div className="mx-6 mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-center gap-4">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-body font-semibold text-green-800 text-sm">Driver Assigned</p>
                  <p className="text-green-700 text-sm">{order.driver.name} — <a href={`tel:${order.driver.phone}`} className="underline">{order.driver.phone}</a></p>
                </div>
              </div>
            )}

            {/* Order details */}
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-body mb-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Customer</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Ordered</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Est. Delivery</p>
                  <p className="font-medium">{order.estimated_delivery || 'TBC'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Total</p>
                  <p className="font-bold text-ta-gold">{order.currency} {order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
