'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from '@/lib/constants'

const MOCK_ORDERS = [
  { id: 1, order_number: 'TA-00047', customer: 'John Moyo', email: 'john@example.com', phone: '+263 77 123 4567', zone: 'Harare', total: 85, currency: 'USD', status: 'pending', payment: 'ecocash', items: 3, created_at: '2024-01-15T08:30:00', is_urgent: false },
  { id: 2, order_number: 'TA-00046', customer: 'Sarah Ndlovu', email: 'sarah@example.com', phone: '+263 71 987 6543', zone: 'Bulawayo', total: 420, currency: 'USD', status: 'processing', payment: 'bank_transfer', items: 2, created_at: '2024-01-15T07:45:00', is_urgent: true },
  { id: 3, order_number: 'TA-00045', customer: 'Michael Choto', email: 'mike@example.com', phone: '+263 73 555 8901', zone: 'Harare', total: 135, currency: 'USD', status: 'dispatched', payment: 'ecocash', items: 1, created_at: '2024-01-15T06:00:00', is_urgent: false },
  { id: 4, order_number: 'TA-00044', customer: 'Grace Mutasa', email: 'grace@example.com', phone: '+263 77 222 3344', zone: 'Mutare', total: 1200, currency: 'USD', status: 'payment_confirmed', payment: 'visa_mastercard', items: 1, created_at: '2024-01-14T16:20:00', is_urgent: false },
  { id: 5, order_number: 'TA-00043', customer: 'Peter Dube', email: 'peter@example.com', phone: '+263 73 111 2233', zone: 'Gweru', total: 320, currency: 'USD', status: 'delivered', payment: 'onemoney', items: 4, created_at: '2024-01-13T10:00:00', is_urgent: false },
]

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
  payment_pending: 'bg-orange-900/30 text-orange-400 border-orange-700/50',
  payment_confirmed: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
  processing: 'bg-indigo-900/30 text-indigo-400 border-indigo-700/50',
  warehouse_picking: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
  ready_for_dispatch: 'bg-cyan-900/30 text-cyan-400 border-cyan-700/50',
  dispatched: 'bg-teal-900/30 text-teal-400 border-teal-700/50',
  out_for_delivery: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50',
  delivered: 'bg-green-900/30 text-green-400 border-green-700/50',
  cancelled: 'bg-red-900/30 text-red-400 border-red-700/50',
}

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number[]>([])

  const filtered = MOCK_ORDERS.filter(o => {
    if (filterStatus && o.status !== filterStatus) return false
    if (search && !o.order_number.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
          <h1 className="font-bold text-white">Orders</h1>
        </div>
        <div className="text-gray-500 text-sm">{filtered.length} orders</div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search order # or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-ta-gold w-64"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-ta-gold"
          >
            <option value="">All Statuses</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {selected.length > 0 && (
            <div className="flex gap-2 ml-auto">
              <button className="bg-blue-900/30 border border-blue-700/50 text-blue-400 px-4 py-2 rounded text-sm hover:bg-blue-900/50 transition-colors">
                Mark as Processing ({selected.length})
              </button>
              <button className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-2 rounded text-sm hover:bg-red-900/50 transition-colors">
                Cancel Selected
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={e => setSelected(e.target.checked ? filtered.map(o => o.id) : [])}
                    className="accent-ta-gold"
                  />
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider hidden md:table-cell">Zone</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={e => setSelected(e.target.checked ? [...selected, order.id] : selected.filter(id => id !== order.id))}
                      className="accent-ta-gold"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-ta-gold font-mono font-bold">{order.order_number}</span>
                      {order.is_urgent && <span className="text-xs bg-red-900/50 text-red-400 border border-red-700/50 px-1.5 py-0.5 rounded-full">🔴 URGENT</span>}
                    </div>
                    <div className="text-gray-600 text-xs mt-0.5">{order.items} items · {order.payment}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-200">{order.customer}</div>
                    <div className="text-gray-500 text-xs">{order.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{order.zone}</td>
                  <td className="px-4 py-3 font-bold text-white">${order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLOR[order.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {new Date(order.created_at).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/orders/${order.order_number}`} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors">View</Link>
                      {order.status === 'pending' && (
                        <button className="text-xs bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-700/30 px-2 py-1 rounded transition-colors">
                          Confirm Pay
                        </button>
                      )}
                      {order.status === 'ready_for_dispatch' && (
                        <button className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-700/30 px-2 py-1 rounded transition-colors">
                          Dispatch
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
