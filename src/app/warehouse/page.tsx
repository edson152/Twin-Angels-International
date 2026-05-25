'use client'
import { useState, useEffect, useCallback } from 'react'

const MOCK_ORDERS = [
  { id: 1, order_number: 'TA-00041', customer: 'John Moyo', items: 'Portland Cement ×10, Steel Rebar ×5', zone: 'Harare', status: 'warehouse_picking', is_urgent: true, created_at: '2024-01-15T08:30:00', picker: null },
  { id: 2, order_number: 'TA-00042', customer: 'Sarah Ndlovu', items: 'Office Chair ×2, Desk ×1', zone: 'Bulawayo', status: 'processing', is_urgent: false, created_at: '2024-01-15T08:45:00', picker: 'Tendai' },
  { id: 3, order_number: 'TA-00043', customer: 'Michael Choto', items: 'Fabric Roll Cotton 60m ×3', zone: 'Harare', status: 'warehouse_picking', is_urgent: false, created_at: '2024-01-15T09:00:00', picker: null },
  { id: 4, order_number: 'TA-00044', customer: 'Grace Mutasa', items: 'Printing Machine A3 ×1', zone: 'Mutare', status: 'ready_for_dispatch', is_urgent: false, created_at: '2024-01-15T07:15:00', picker: 'Rudo' },
  { id: 5, order_number: 'TA-00045', customer: 'Peter Dube', items: 'House Sofa ×1, Coffee Table ×1', zone: 'Gweru', status: 'processing', is_urgent: true, created_at: '2024-01-15T09:10:00', picker: null },
  { id: 6, order_number: 'TA-00046', customer: 'Alice Zimba', items: 'Tiles 60×60 ×50', zone: 'Harare', status: 'warehouse_picking', is_urgent: false, created_at: '2024-01-15T09:20:00', picker: 'Farai' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  processing: { label: 'QUEUED', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-600/50' },
  warehouse_picking: { label: 'PICKING', color: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-600/50' },
  ready_for_dispatch: { label: 'READY ✓', color: 'text-green-400', bg: 'bg-green-900/30 border-green-600/50' },
}

export default function WarehouseDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [timeStr, setTimeStr] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [refreshStr, setRefreshStr] = useState('')
  const [mounted, setMounted] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        const warehouseOrders = (data.orders || []).filter((o: any) =>
          ['processing', 'warehouse_picking', 'ready_for_dispatch'].includes(o.status)
        ).map((o: any) => ({
          id: o.id || o.order_number,
          order_number: o.order_number,
          customer: `${o.customer_first_name} ${o.customer_last_name}`,
          items: (o.items || []).map((i: any) => `${i.name} ×${i.quantity}`).join(', ') || 'See order',
          zone: o.delivery_zone,
          status: o.status,
          is_urgent: false,
          created_at: o.created_at,
          picker: null,
        }))
        if (warehouseOrders.length > 0) setOrders(warehouseOrders)
      }
    } catch {
      // Keep mock data on error
    }
    setRefreshStr(new Date().toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }, [])

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDateStr(now.toLocaleDateString('en-ZW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }
    tick()
    fetchOrders()
    const clockTimer = setInterval(tick, 1000)
    const refreshTimer = setInterval(fetchOrders, 30000)
    return () => { clearInterval(clockTimer); clearInterval(refreshTimer) }
  }, [fetchOrders])

  const urgentOrders = orders.filter(o => o.is_urgent)
  const normalOrders = orders.filter(o => !o.is_urgent)
  const sortedOrders = [...urgentOrders, ...normalOrders]

  const stats = {
    queued: orders.filter(o => o.status === 'processing').length,
    picking: orders.filter(o => o.status === 'warehouse_picking').length,
    ready: orders.filter(o => o.status === 'ready_for_dispatch').length,
    urgent: urgentOrders.length,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ta-gold rounded flex items-center justify-center font-bold text-black">TA</div>
            <div>
              <div className="text-white font-bold text-lg leading-none">WAREHOUSE</div>
              <div className="text-ta-gold text-xs tracking-widest">OPERATIONS CENTRE</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-yellow-900/40 border border-yellow-700/50 text-yellow-400 rounded">QUEUED: {stats.queued}</span>
            <span className="px-3 py-1 bg-blue-900/40 border border-blue-700/50 text-blue-400 rounded">PICKING: {stats.picking}</span>
            <span className="px-3 py-1 bg-green-900/40 border border-green-700/50 text-green-400 rounded">READY: {stats.ready}</span>
            {stats.urgent > 0 && (
              <span className="px-3 py-1 bg-red-900/40 border border-red-700/50 text-red-400 rounded animate-pulse">🔴 URGENT: {stats.urgent}</span>
            )}
          </div>
        </div>
        <div className="text-right min-w-[10rem]">
          <div className="text-2xl font-bold text-ta-gold tracking-wider">{mounted ? timeStr : ''}</div>
          <div className="text-gray-500 text-xs mt-1">{mounted && refreshStr ? `Last refresh: ${refreshStr}` : ''}</div>
        </div>
      </div>

      {/* Order Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedOrders.map((order, idx) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing
            const timeSince = mounted ? Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000) : 0
            return (
              <div key={order.id}
                className={`relative border rounded-lg p-5 ${config.bg} ${order.is_urgent ? 'border-red-500 shadow-lg shadow-red-900/30' : ''}`}>
                {order.is_urgent && (
                  <div className="absolute -top-2.5 left-4 bg-red-600 text-white text-xs font-bold px-3 py-0.5 rounded-full animate-pulse">
                    ⚡ URGENT
                  </div>
                )}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/60 flex items-center justify-center text-gray-400 text-xs font-bold">
                  #{idx + 1}
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-ta-gold font-bold text-lg tracking-wider">{order.order_number}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${config.color}`}>{config.label}</span>
                  </div>
                  <div className="text-gray-300 text-sm">{order.customer}</div>
                </div>
                <div className="text-gray-400 text-sm mb-3 leading-relaxed border-t border-gray-700/50 pt-3">
                  <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Items</span>
                  {order.items}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">📍 {order.zone}</span>
                    {mounted && <span className="text-gray-600">⏱ {timeSince}m ago</span>}
                  </div>
                  <div>
                    {order.picker
                      ? <span className="text-green-400 font-semibold">👤 {order.picker}</span>
                      : <span className="text-gray-600 italic">Unassigned</span>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {orders.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-gray-500 text-xl">No active orders</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-gray-800 px-8 py-2 flex justify-between items-center text-xs text-gray-500">
        <span>FIFO Order Processing — Urgent orders override queue priority</span>
        <span>Auto-refreshes every 30 seconds</span>
        <span>{mounted ? dateStr : ''}</span>
      </div>
    </div>
  )
}
