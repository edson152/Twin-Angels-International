'use client'
import { useState, useEffect, useCallback } from 'react'

const MOCK_DISPATCH = [
  { id: 1, order_number: 'TA-00038', customer: 'John Moyo', phone: '+263 77 123 4567', address: '15 Avondale, Harare', zone: 'Harare', total: '$85.00', driver: 'Takudzwa M.', vehicle: 'Toyota Hilux ZH-123', status: 'dispatched' },
  { id: 2, order_number: 'TA-00039', customer: 'Sarah Ndlovu', phone: '+263 71 987 6543', address: '42 Suburbs, Bulawayo', zone: 'Bulawayo', total: '$420.00', driver: null, vehicle: null, status: 'ready_for_dispatch' },
  { id: 3, order_number: 'TA-00040', customer: 'Michael Choto', phone: '+263 73 555 8901', address: '7 CBD, Harare', zone: 'Harare', total: '$135.00', driver: 'Blessing K.', vehicle: 'Isuzu Truck ZH-456', status: 'out_for_delivery' },
  { id: 4, order_number: 'TA-00044', customer: 'Grace Mutasa', phone: '+263 77 222 3344', address: '89 Main Rd, Mutare', zone: 'Mutare', total: '$1,200.00', driver: null, vehicle: null, status: 'ready_for_dispatch' },
]

const DRIVERS = ['Takudzwa M.', 'Blessing K.', 'Farai N.', 'Tendai Z.']
const VEHICLES = ['Toyota Hilux ZH-123', 'Isuzu Truck ZH-456', 'Ford Ranger ZH-789', 'Toyota Land Cruiser ZH-321']

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ready_for_dispatch: { label: '📦 READY', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/40' },
  dispatched: { label: '🚚 DISPATCHED', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/40' },
  out_for_delivery: { label: '📍 OUT FOR DELIVERY', color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-700/40' },
  delivered: { label: '✅ DELIVERED', color: 'text-green-400', bg: 'bg-green-900/20 border-green-700/40' },
}

export default function DispatchDashboard() {
  const [orders, setOrders] = useState(MOCK_DISPATCH)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = {
    ready: orders.filter(o => o.status === 'ready_for_dispatch').length,
    dispatched: orders.filter(o => o.status === 'dispatched').length,
    delivering: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  // Group by zone
  const byZone = orders.reduce<Record<string, typeof orders>>((acc, o) => {
    acc[o.zone] = acc[o.zone] || []
    acc[o.zone].push(o)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ta-gold rounded flex items-center justify-center font-bold text-black">TA</div>
            <div>
              <div className="text-white font-bold text-lg leading-none">DISPATCH</div>
              <div className="text-ta-gold text-xs tracking-widest">OPERATIONS CENTRE</div>
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            {[
              { label: 'READY', value: stats.ready, color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700/40' },
              { label: 'DISPATCHED', value: stats.dispatched, color: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-700/40' },
              { label: 'DELIVERING', value: stats.delivering, color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-700/40' },
              { label: 'COMPLETED', value: stats.delivered, color: 'text-green-400', bg: 'bg-green-900/30 border-green-700/40' },
            ].map(s => (
              <span key={s.label} className={`px-3 py-1 border rounded text-xs font-bold ${s.color} ${s.bg}`}>
                {s.label}: {s.value}
              </span>
            ))}
          </div>
        </div>
        <div className="text-2xl font-bold text-ta-gold tracking-wider">
          {currentTime.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Two-panel layout: Orders + Driver Board */}
      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders by Zone */}
        <div className="xl:col-span-2 space-y-6">
          {Object.entries(byZone).map(([zone, zoneOrders]) => (
            <div key={zone}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-ta-gold font-bold text-sm tracking-widest uppercase">📍 {zone}</span>
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-500 text-xs">{zoneOrders.length} orders</span>
              </div>
              <div className="grid gap-3">
                {zoneOrders.map(order => {
                  const config = STATUS_CONFIG[order.status]
                  return (
                    <div key={order.id} className={`border rounded-lg p-4 ${config.bg}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-ta-gold font-bold text-lg">{order.order_number}</span>
                          <div className="text-gray-300 text-sm mt-0.5">{order.customer}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{order.phone}</div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                          <div className="text-ta-gold font-bold mt-1">{order.total}</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm mb-3">📍 {order.address}</div>
                      <div className="flex items-center justify-between border-t border-gray-700/50 pt-3">
                        <div>
                          {order.driver ? (
                            <div>
                              <span className="text-green-400 text-xs">👤 {order.driver}</span>
                              {order.vehicle && <span className="text-gray-500 text-xs ml-3">🚗 {order.vehicle}</span>}
                            </div>
                          ) : (
                            <span className="text-red-400 text-xs italic">⚠️ No driver assigned</span>
                          )}
                        </div>
                        {order.status === 'ready_for_dispatch' && !order.driver && (
                          <button className="text-xs bg-ta-gold/20 hover:bg-ta-gold/30 text-ta-gold border border-ta-gold/30 px-3 py-1 rounded transition-colors">
                            Assign Driver
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <button className="text-xs bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-700/40 px-3 py-1 rounded transition-colors">
                            Mark Delivered ✓
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Driver Board */}
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="text-ta-gold font-bold text-sm tracking-widest uppercase mb-4">🚗 Driver Board</h3>
            <div className="space-y-3">
              {DRIVERS.map(driver => {
                const driverOrder = orders.find(o => o.driver === driver)
                return (
                  <div key={driver} className={`border rounded-lg p-3 ${driverOrder ? 'bg-blue-900/20 border-blue-700/40' : 'bg-gray-800/50 border-gray-700/50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">👤 {driver}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${driverOrder ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>
                        {driverOrder ? 'ON ROUTE' : 'AVAILABLE'}
                      </span>
                    </div>
                    {driverOrder && (
                      <div className="text-xs text-gray-400 mt-1">
                        <div>{driverOrder.order_number} → {driverOrder.zone}</div>
                        <div className="text-gray-600 mt-0.5">{driverOrder.vehicle}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Vehicles */}
            <h3 className="text-ta-gold font-bold text-sm tracking-widest uppercase mt-6 mb-4">🚗 Vehicles</h3>
            <div className="space-y-2">
              {VEHICLES.map(v => {
                const inUse = orders.find(o => o.vehicle === v)
                return (
                  <div key={v} className={`text-xs px-3 py-2 rounded border ${inUse ? 'bg-blue-900/20 border-blue-700/40 text-blue-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                    <div className="font-semibold">{v}</div>
                    <div className="text-gray-500">{inUse ? `On route: ${inUse.order_number}` : 'Available'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-gray-800 px-8 py-2 flex justify-between text-xs text-gray-500">
        <span>Twin Angels International — Dispatch Operations</span>
        <span>Auto-refreshes every 30 seconds</span>
        <span>{currentTime.toLocaleDateString('en-ZW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  )
}
