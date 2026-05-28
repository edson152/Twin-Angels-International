'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

const MOCK_PROMOS = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, min_order: 50, uses: 23, max_uses: 100, is_active: true, expires: '2024-03-31' },
  { id: 2, code: 'HARARE5', type: 'fixed_usd', value: 5, min_order: 80, uses: 8, max_uses: 50, is_active: true, expires: '2024-02-28' },
  { id: 3, code: 'BULK20', type: 'percent', value: 20, min_order: 500, uses: 3, max_uses: 20, is_active: false, expires: '2024-01-31' },
]

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState(MOCK_PROMOS)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', min_order: '', max_uses: '', expires: '' })

  const toggle = (id: number) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
    toast.success('Promotion updated')
  }

  const deletePromo = (id: number) => {
    setPromos(prev => prev.filter(p => p.id !== id))
    toast.success('Promotion deleted')
  }

  const addPromo = () => {
    if (!form.code || !form.value) return
    setPromos(prev => [...prev, {
      id: Date.now(),
      code: form.code.toUpperCase(),
      type: form.type as 'percent' | 'fixed_usd',
      value: Number(form.value),
      min_order: Number(form.min_order) || 0,
      uses: 0,
      max_uses: Number(form.max_uses) || 999,
      is_active: true,
      expires: form.expires,
    }])
    setForm({ code: '', type: 'percent', value: '', min_order: '', max_uses: '', expires: '' })
    setShowAdd(false)
    toast.success('Promotion created!')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">          <h1 className="font-bold">Promotions & Discounts</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
          + Create Promo
        </button>
      </div>

      <div className="p-6 max-w-4xl">
        <div className="space-y-3">
          {promos.map(promo => (
            <div key={promo.id} className={`bg-gray-900 border rounded-xl p-5 flex flex-wrap items-center gap-4 ${promo.is_active ? 'border-gray-700' : 'border-gray-800 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-bold text-ta-gold text-lg tracking-widest">{promo.code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${promo.is_active ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>
                    Discount: <span className="text-white font-semibold">
                      {promo.type === 'percent' ? `${promo.value}% off` : `$${promo.value} off`}
                    </span>
                  </span>
                  {promo.min_order > 0 && <span>Min order: <span className="text-white">${promo.min_order}</span></span>}
                  <span>Used: <span className="text-white">{promo.uses}/{promo.max_uses}</span></span>
                  {promo.expires && <span>Expires: <span className="text-white">{promo.expires}</span></span>}
                </div>
                {/* Usage bar */}
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden w-48">
                  <div className="h-full bg-ta-gold rounded-full" style={{ width: `${(promo.uses / promo.max_uses) * 100}%` }} />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggle(promo.id)} className={`text-xs border px-3 py-1.5 rounded font-semibold transition-colors ${promo.is_active ? 'bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-400 border-yellow-700/40' : 'bg-green-900/20 hover:bg-green-900/40 text-green-400 border-green-700/40'}`}>
                  {promo.is_active ? 'Pause' : 'Activate'}
                </button>
                <button onClick={() => deletePromo(promo.id)} className="text-xs bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-700/40 px-3 py-1.5 rounded font-semibold transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-5">Create Promotion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Promo Code</label>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="WELCOME10"
                  className="w-full bg-gray-800 border border-gray-700 text-ta-gold font-mono font-bold px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold placeholder-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Discount Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold">
                    <option value="percent">Percentage %</option>
                    <option value="fixed_usd">Fixed USD $</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Discount Value</label>
                  <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                    placeholder={form.type === 'percent' ? '10' : '5'}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Min Order (USD)</label>
                  <input type="number" value={form.min_order} onChange={e => setForm(p => ({ ...p, min_order: e.target.value }))}
                    placeholder="50"
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Max Uses</label>
                  <input type="number" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))}
                    placeholder="100"
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Expiry Date</label>
                <input type="date" value={form.expires} onChange={e => setForm(p => ({ ...p, expires: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addPromo} className="flex-1 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-2.5 rounded transition-colors text-sm">Create Promotion</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
