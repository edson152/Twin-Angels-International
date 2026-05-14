'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_BANNERS = [
  { id: 1, title: 'Build Your Vision', subtitle: 'Premium Building Materials', cta_text: 'Shop Now', cta_url: '/products?category=building-materials', is_active: true, sort_order: 1 },
  { id: 2, title: 'Fabric Excellence', subtitle: 'Premium Fabric Rolls', cta_text: 'Browse Fabrics', cta_url: '/products?category=fabric-rolls', is_active: true, sort_order: 2 },
  { id: 3, title: 'Outfit Your Office', subtitle: 'Premium Office Furniture', cta_text: 'View Furniture', cta_url: '/products?category=office-furniture', is_active: true, sort_order: 3 },
]

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(INITIAL_BANNERS)
  const [showAdd, setShowAdd] = useState(false)
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', cta_text: 'Shop Now', cta_url: '' })

  const toggleActive = (id: number) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b))
    toast.success('Banner updated')
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const arr = [...banners]
    ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
    setBanners(arr)
  }

  const moveDown = (idx: number) => {
    if (idx === banners.length - 1) return
    const arr = [...banners]
    ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
    setBanners(arr)
  }

  const deleteBanner = (id: number) => {
    setBanners(prev => prev.filter(b => b.id !== id))
    toast.success('Banner deleted')
  }

  const addBanner = () => {
    if (!newBanner.title) return
    setBanners(prev => [...prev, { id: Date.now(), ...newBanner, is_active: true, sort_order: prev.length + 1 }])
    setNewBanner({ title: '', subtitle: '', cta_text: 'Shop Now', cta_url: '' })
    setShowAdd(false)
    toast.success('Banner added')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold">Homepage Banners</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
          + Add Banner
        </button>
      </div>

      <div className="p-6 max-w-4xl">
        <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-4 mb-6 text-sm text-blue-300">
          🖼️ Drag to reorder banners. Active banners rotate automatically on the homepage every 6 seconds.
        </div>

        <div className="space-y-3">
          {banners.map((banner, idx) => (
            <div key={banner.id} className={`bg-gray-900 border rounded-xl p-5 flex items-center gap-4 transition-all ${banner.is_active ? 'border-gray-700' : 'border-gray-800 opacity-60'}`}>
              {/* Position controls */}
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-20 text-xs px-2 py-1 bg-gray-800 rounded transition-colors">▲</button>
                <span className="text-center text-gray-600 font-mono text-xs">{idx + 1}</span>
                <button onClick={() => moveDown(idx)} disabled={idx === banners.length - 1} className="text-gray-500 hover:text-white disabled:opacity-20 text-xs px-2 py-1 bg-gray-800 rounded transition-colors">▼</button>
              </div>

              {/* Banner info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{banner.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${banner.is_active ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                    {banner.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{banner.subtitle}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>CTA: <span className="text-ta-gold">{banner.cta_text}</span></span>
                  <span>→ <span className="font-mono">{banner.cta_url}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleActive(banner.id)} className={`text-xs px-3 py-1.5 rounded border font-semibold transition-colors ${banner.is_active ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50 hover:bg-yellow-900/50' : 'bg-green-900/30 text-green-400 border-green-700/50 hover:bg-green-900/50'}`}>
                  {banner.is_active ? 'Hide' : 'Show'}
                </button>
                <button className="text-xs px-3 py-1.5 rounded border bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 transition-colors font-semibold">
                  Edit
                </button>
                <button onClick={() => deleteBanner(banner.id)} className="text-xs px-3 py-1.5 rounded border bg-red-900/30 text-red-400 border-red-700/50 hover:bg-red-900/50 transition-colors font-semibold">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={() => toast.success('Banner order saved!')}
          className="mt-6 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm"
        >
          Save Order
        </button>
      </div>

      {/* Add Banner Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-5">Add New Banner</h2>
            <div className="space-y-4">
              {[
                { label: 'Title', key: 'title', placeholder: 'Build Your Vision' },
                { label: 'Subtitle', key: 'subtitle', placeholder: 'Premium Building Materials' },
                { label: 'CTA Button Text', key: 'cta_text', placeholder: 'Shop Now' },
                { label: 'CTA Link URL', key: 'cta_url', placeholder: '/products?category=building-materials' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={newBanner[field.key as keyof typeof newBanner]}
                    onChange={e => setNewBanner(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-400 text-xs mb-1">Upload Image (optional)</label>
                <input type="file" accept="image/*" className="w-full bg-gray-800 border border-gray-700 text-gray-400 px-3 py-2 rounded text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addBanner} className="flex-1 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-2.5 rounded transition-colors text-sm">Add Banner</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
