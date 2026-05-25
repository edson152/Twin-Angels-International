'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '🛒' },
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: '💳' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'warehouse_picking', label: 'Being Picked', icon: '📦' },
  { key: 'ready_for_dispatch', label: 'Ready to Ship', icon: '✅' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '📍' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
]

function TrackContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/${orderNumber.trim().toUpperCase()}/track`)
      if (res.ok) {
        setOrder(await res.json())
      } else {
        setError('Order not found. Please check your order number.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-ta-dark mb-3">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number to see real-time status</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-3 mb-8">
        <input
          type="text"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value.toUpperCase())}
          placeholder="e.g. TA-12345"
          className="input-field flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary px-8 shrink-0 disabled:opacity-50">
          {loading ? '...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-ta-dark p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Order Number</p>
                <p className="font-mono font-bold text-ta-gold text-2xl">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Total</p>
                <p className="font-mono font-bold text-xl">
                  {order.currency === 'USD' ? '$' : 'ZiG'} {Number(order.total).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-300">
              <span>{order.customer_name}</span>
              {order.delivery_zone && <span className="ml-4">📍 {order.delivery_zone}</span>}
            </div>
          </div>

          {/* Progress */}
          <div className="p-6">
            <h2 className="font-display font-semibold text-ta-dark mb-6">Order Progress</h2>
            <div className="space-y-4">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex
                const isCurrent = idx === currentStepIndex
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2 transition-all ${
                      isCurrent ? 'border-ta-gold bg-ta-gold/10 scale-110' :
                      isDone ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isDone ? 'text-ta-dark' : 'text-gray-400'}`}>{step.label}</p>
                      {isCurrent && <p className="text-xs text-ta-gold font-semibold mt-0.5">Current Status</p>}
                    </div>
                    {isDone && !isCurrent && <span className="text-green-500 text-sm">✓</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Driver info */}
          {order.driver && (
            <div className="px-6 pb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                <h3 className="font-semibold text-blue-800 text-sm mb-2">🚚 Your Driver</h3>
                <p className="text-blue-700 text-sm">{order.driver.name}</p>
                {order.driver.phone && (
                  <a href={`tel:${order.driver.phone}`} className="text-blue-600 text-sm hover:underline">{order.driver.phone}</a>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          {order.items?.length > 0 && (
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-ta-dark text-sm mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-mono">{order.currency === 'USD' ? '$' : 'ZiG'} {Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-96"><div className="text-gray-400">Loading...</div></div>}>
        <TrackContent />
      </Suspense>
    </StoreLayout>
  )
}
