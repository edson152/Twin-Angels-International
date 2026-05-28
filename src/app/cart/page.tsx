'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'
import { DELIVERY_ZONES } from '@/lib/constants'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, currency } = useCartStore()
  const [selectedZone, setSelectedZone] = useState('harare')

  const symbol = currency === 'USD' ? '$' : 'ZiG'
  const zone = DELIVERY_ZONES.find(z => z.id === selectedZone)!
  const deliveryFee = currency === 'USD' ? zone.fee_usd : zone.fee_zig
  const total = subtotal() + deliveryFee

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="font-display text-3xl font-bold text-ta-dark mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-ta-dark mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = currency === 'USD' ? item.price_usd : item.price_zig
              return (
                <div key={item.id} className="bg-white rounded-sm border border-gray-100 p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-sm flex items-center justify-center text-3xl shrink-0">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-medium text-ta-dark text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="font-display font-bold text-ta-dark">
                      {symbol} {price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 py-1 font-mono text-sm font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-ta-dark font-mono">
                      {symbol} {(price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-display font-bold text-ta-dark text-lg mb-6">Order Summary</h2>

              <div className="mb-4">
                <label className="block text-sm font-body text-gray-600 mb-2">Delivery Zone</label>
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  className="input-field"
                >
                  {DELIVERY_ZONES.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {symbol} {currency === 'USD' ? z.fee_usd : z.fee_zig}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{symbol} {subtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-gray-600">Delivery ({zone.name})</span>
                  <span className="font-medium">{symbol} {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base font-display font-bold border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="text-ta-gold">{symbol} {total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout
                <FiArrowRight size={16} />
              </Link>

              <Link href="/products" className="btn-secondary w-full flex items-center justify-center mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
