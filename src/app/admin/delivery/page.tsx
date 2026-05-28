'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_ZONES = [
  { id: 1, name: 'Harare', slug: 'harare', fee_usd: 5, fee_zig: 350, is_active: true },
  { id: 2, name: 'Bulawayo', slug: 'bulawayo', fee_usd: 15, fee_zig: 1050, is_active: true },
  { id: 3, name: 'Mutare', slug: 'mutare', fee_usd: 18, fee_zig: 1260, is_active: true },
  { id: 4, name: 'Gweru', slug: 'gweru', fee_usd: 12, fee_zig: 840, is_active: true },
  { id: 5, name: 'Masvingo', slug: 'masvingo', fee_usd: 20, fee_zig: 1400, is_active: true },
  { id: 6, name: 'Custom Rural Zone', slug: 'rural', fee_usd: 25, fee_zig: 1750, is_active: true },
]

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState(INITIAL_ZONES)
  const [editId, setEditId] = useState<number | null>(null)
  const [editData, setEditData] = useState({ fee_usd: 0, fee_zig: 0 })
  const [zigRate, setZigRate] = useState(70)

  const startEdit = (zone: typeof zones[0]) => {
    setEditId(zone.id)
    setEditData({ fee_usd: zone.fee_usd, fee_zig: zone.fee_zig })
  }

  const saveEdit = (id: number) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, ...editData } : z))
    setEditId(null)
    toast.success('Delivery zone updated')
  }

  const toggleZone = (id: number) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, is_active: !z.is_active } : z))
  }

  const syncZigFromUsd = () => {
    setZones(prev => prev.map(z => ({ ...z, fee_zig: Math.round(z.fee_usd * zigRate) })))
    toast.success(`ZiG fees synced at rate 1 USD = ${zigRate} ZiG`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">          <h1 className="font-bold">Delivery Zones & Fees</h1>
        </div>
      </div>

      <div className="p-6 max-w-3xl">
        {/* Exchange Rate Card */}
        <div className="bg-gray-900 border border-ta-gold/30 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-ta-gold mb-3">💱 USD to ZiG Exchange Rate</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">1 USD =</span>
              <input
                type="number"
                value={zigRate}
                onChange={e => setZigRate(Number(e.target.value))}
                className="w-24 bg-gray-800 border border-gray-700 text-ta-gold font-mono font-bold px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold"
              />
              <span className="text-gray-400 text-sm">ZiG</span>
            </div>
            <button
              onClick={syncZigFromUsd}
              className="bg-ta-gold/20 hover:bg-ta-gold/30 border border-ta-gold/40 text-ta-gold text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              Sync ZiG Fees
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">Updating this rate and clicking Sync will auto-calculate all ZiG delivery fees based on the USD fees.</p>
        </div>

        {/* Zones table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold">Delivery Zones</h2>
            <span className="text-gray-500 text-sm">{zones.filter(z => z.is_active).length} active zones</span>
          </div>
          <div className="divide-y divide-gray-800">
            {zones.map(zone => (
              <div key={zone.id} className={`px-5 py-4 flex items-center gap-4 ${!zone.is_active ? 'opacity-50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">📍 {zone.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${zone.is_active ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                      {zone.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  {editId === zone.id ? (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 text-xs">USD:</span>
                        <input
                          type="number"
                          value={editData.fee_usd}
                          onChange={e => setEditData(p => ({ ...p, fee_usd: Number(e.target.value) }))}
                          className="w-20 bg-gray-800 border border-ta-gold/50 text-white px-2 py-1 rounded text-sm font-mono focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 text-xs">ZiG:</span>
                        <input
                          type="number"
                          value={editData.fee_zig}
                          onChange={e => setEditData(p => ({ ...p, fee_zig: Number(e.target.value) }))}
                          className="w-24 bg-gray-800 border border-ta-gold/50 text-white px-2 py-1 rounded text-sm font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-ta-gold font-mono font-bold">${zone.fee_usd}</span>
                      <span className="text-gray-500 text-xs">·</span>
                      <span className="text-gray-400 font-mono">ZiG {zone.fee_zig.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  {editId === zone.id ? (
                    <>
                      <button onClick={() => saveEdit(zone.id)} className="text-xs bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-700/50 px-3 py-1.5 rounded font-semibold transition-colors">Save</button>
                      <button onClick={() => setEditId(null)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-1.5 rounded font-semibold transition-colors">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(zone)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded font-semibold transition-colors">Edit Fees</button>
                      <button onClick={() => toggleZone(zone.id)} className={`text-xs border px-3 py-1.5 rounded font-semibold transition-colors ${zone.is_active ? 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-700/40' : 'bg-green-900/20 hover:bg-green-900/40 text-green-400 border-green-700/40'}`}>
                        {zone.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => toast.success('Delivery zones saved!')}
          className="mt-6 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm"
        >
          Save All Changes
        </button>
      </div>
    </div>
  )
}
