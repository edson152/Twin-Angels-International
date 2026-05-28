'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'payment_confirmed', 'processing', 'warehouse_picking', 'ready_for_dispatch', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled']
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/40',
  payment_confirmed: 'bg-green-900/20 text-green-400 border-green-700/40',
  processing: 'bg-blue-900/20 text-blue-400 border-blue-700/40',
  warehouse_picking: 'bg-indigo-900/20 text-indigo-400 border-indigo-700/40',
  ready_for_dispatch: 'bg-orange-900/20 text-orange-400 border-orange-700/40',
  dispatched: 'bg-purple-900/20 text-purple-400 border-purple-700/40',
  out_for_delivery: 'bg-cyan-900/20 text-cyan-400 border-cyan-700/40',
  delivered: 'bg-emerald-900/20 text-emerald-400 border-emerald-700/40',
  cancelled: 'bg-red-900/20 text-red-400 border-red-700/40',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<any | null>(null)

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (e) {
      toast.error('Could not load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const updateStatus = async (orderNumber: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success('Order status updated')
        loadOrders()
        if (selected?.order_number === orderNumber) setSelected((s: any) => ({ ...s, status }))
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">          <h1 className="font-bold">Orders</h1>
          <span className="text-gray-500 text-sm font-mono">{orders.length} total</span>
        </div>
        <button onClick={loadOrders} className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded transition-colors">⟳ Refresh</button>
      </div>

      <div className="p-6">
        {/* Status filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setFilter('')}
            className={`text-xs px-3 py-1.5 rounded border font-semibold transition-colors ${!filter ? 'bg-ta-gold text-white border-ta-gold' : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map(s => {
            const count = orders.filter(o => o.status === s).length
            if (count === 0) return null
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`text-xs px-3 py-1.5 rounded border font-semibold capitalize transition-colors ${filter === s ? 'bg-ta-gold text-white border-ta-gold' : `${STATUS_COLORS[s]} hover:opacity-80`}`}>
                {s.replace(/_/g, ' ')} ({count})
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500">No orders yet. Orders placed through the store will appear here.</p>
            <p className="text-gray-600 text-xs mt-2">Try placing a test order from the <Link href="/products" className="text-ta-gold hover:underline">products page</Link>.</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Order #</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase hidden md:table-cell">Customer</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Total</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Status</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase hidden lg:table-cell">Date</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.order_number} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-ta-gold">{order.order_number}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-gray-300">{order.customer_first_name} {order.customer_last_name}</div>
                      <div className="text-gray-600 text-xs">{order.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      {order.currency === 'USD' ? '$' : 'ZiG'} {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setSelected(order)}
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded">View</button>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.order_number, e.target.value)}
                          className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-1 py-1 rounded focus:outline-none focus:border-ta-gold">
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-ta-gold font-mono text-lg">{selected.order_number}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded p-3">
                  <div className="text-gray-500 text-xs mb-1">Customer</div>
                  <div className="text-white font-semibold">{selected.customer_first_name} {selected.customer_last_name}</div>
                  <div className="text-gray-400">{selected.customer_email}</div>
                  <div className="text-gray-400">{selected.customer_phone}</div>
                </div>
                <div className="bg-gray-800 rounded p-3">
                  <div className="text-gray-500 text-xs mb-1">Order Info</div>
                  <div className="text-ta-gold font-bold font-mono">{selected.currency === 'USD' ? '$' : 'ZiG'} {Number(selected.total).toLocaleString()}</div>
                  <div className="text-gray-400 capitalize">{selected.payment_method?.replace(/_/g, ' ')}</div>
                  <div className="text-gray-400">{selected.delivery_zone}</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-gray-500 text-xs mb-2">Delivery Address</div>
                <div className="text-gray-300">{selected.customer_address}</div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-gray-500 text-xs mb-2">Items</div>
                {(selected.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-300 py-1 border-b border-gray-700/50 last:border-0">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-mono">${item.price_usd || item.price || 0}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Update Status</label>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.order_number, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
