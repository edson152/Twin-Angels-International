'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useAdminStore, Banner } from '@/lib/adminStore'
import toast from 'react-hot-toast'

const BG_OPTIONS = [
  { label: 'Dark Slate', value: 'from-slate-900 via-slate-800 to-slate-700' },
  { label: 'Amber Warm', value: 'from-amber-900 via-amber-800 to-stone-700' },
  { label: 'Deep Zinc', value: 'from-zinc-900 via-zinc-800 to-neutral-700' },
  { label: 'Deep Blue', value: 'from-blue-950 via-blue-900 to-slate-800' },
  { label: 'Forest Green', value: 'from-green-950 via-green-900 to-emerald-800' },
  { label: 'Deep Purple', value: 'from-purple-950 via-purple-900 to-indigo-800' },
]

const EMPTY_BANNER = {
  title: '', subtitle: '', description: '', cta_text: 'Shop Now',
  cta_url: '', image: '', is_active: true, bg_gradient: BG_OPTIONS[0].value,
}

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...EMPTY_BANNER })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const sortedBanners = [...banners].sort((a, b) => a.sort_order - b.sort_order)

  const openAdd = () => { setForm({ ...EMPTY_BANNER }); setEditingId(null); setShowForm(true) }
  const openEdit = (b: Banner) => {
    setForm({ title: b.title, subtitle: b.subtitle, description: b.description,
      cta_text: b.cta_text, cta_url: b.cta_url, image: b.image,
      is_active: b.is_active, bg_gradient: b.bg_gradient })
    setEditingId(b.id); setShowForm(true)
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!form.title.trim()) { toast.error('Banner title required'); return }
    if (editingId) {
      updateBanner(editingId, form)
      toast.success('Banner updated!')
    } else {
      addBanner(form)
      toast.success('Banner added!')
    }
    setShowForm(false)
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const arr = [...sortedBanners]
    ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
    reorderBanners(arr.map((b, i) => ({ ...b, sort_order: i + 1 })))
  }

  const moveDown = (idx: number) => {
    if (idx === sortedBanners.length - 1) return
    const arr = [...sortedBanners]
    ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
    reorderBanners(arr.map((b, i) => ({ ...b, sort_order: i + 1 })))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold">Homepage Banners</h1>
        </div>
        <button onClick={openAdd} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
          + Add Banner
        </button>
      </div>

      <div className="p-6 max-w-4xl">
        <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-4 mb-6 text-sm text-blue-300">
          🖼️ Active banners rotate on the homepage every 6 seconds. Use ▲▼ to reorder.
        </div>

        <div className="space-y-3">
          {sortedBanners.map((banner, idx) => (
            <div key={banner.id} className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${banner.is_active ? 'border-gray-700' : 'border-gray-800 opacity-60'}`}>
              <div className="flex items-stretch">
                {/* Preview swatch */}
                <div className={`w-24 shrink-0 bg-gradient-to-br ${banner.bg_gradient} flex items-center justify-center relative`}>
                  {banner.image ? (
                    <img src={banner.image} alt="" className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <span className="text-3xl">🖼️</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-70" />
                </div>

                <div className="flex-1 p-4 flex items-center gap-4">
                  {/* Position controls */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-20 text-xs px-1.5 py-0.5 bg-gray-800 rounded">▲</button>
                    <span className="text-center text-gray-600 font-mono text-xs">{idx + 1}</span>
                    <button onClick={() => moveDown(idx)} disabled={idx === sortedBanners.length - 1} className="text-gray-500 hover:text-white disabled:opacity-20 text-xs px-1.5 py-0.5 bg-gray-800 rounded">▼</button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{banner.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${banner.is_active ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                        {banner.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{banner.subtitle}</p>
                    {banner.description && <p className="text-gray-600 text-xs mt-1 line-clamp-1">{banner.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>CTA: <span className="text-ta-gold">{banner.cta_text}</span></span>
                      <span className="font-mono truncate max-w-48">{banner.cta_url}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => updateBanner(banner.id, { is_active: !banner.is_active })}
                      className={`text-xs px-3 py-1.5 rounded border font-semibold transition-colors ${banner.is_active ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50 hover:bg-yellow-900/50' : 'bg-green-900/30 text-green-400 border-green-700/50 hover:bg-green-900/50'}`}>
                      {banner.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => openEdit(banner)} className="text-xs px-3 py-1.5 rounded border bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 font-semibold">
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(banner.id)} className="text-xs px-3 py-1.5 rounded border bg-red-900/30 text-red-400 border-red-700/50 hover:bg-red-900/50 font-semibold">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sortedBanners.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <div className="text-4xl mb-3">🖼️</div>
              <p>No banners yet. Add your first banner!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-400 text-xs mb-2">Banner Image</label>
              <div className="relative h-36 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 cursor-pointer group"
                onClick={() => fileRef.current?.click()}>
                {form.image ? (
                  <>
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${form.bg_gradient} flex flex-col items-center justify-center gap-2`}>
                    <span className="text-3xl">📷</span>
                    <span className="text-white/70 text-sm">Click to upload banner image</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
              {form.image && (
                <button onClick={() => setForm(f => ({ ...f, image: '' }))} className="text-xs text-red-400 mt-1 hover:underline">Remove image</button>
              )}
            </div>

            {/* Background Gradient */}
            <div className="mb-4">
              <label className="block text-gray-400 text-xs mb-2">Background Gradient (used when no image)</label>
              <div className="grid grid-cols-3 gap-2">
                {BG_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setForm(f => ({ ...f, bg_gradient: opt.value }))}
                    className={`h-12 rounded bg-gradient-to-br ${opt.value} border-2 transition-all ${form.bg_gradient === opt.value ? 'border-ta-gold' : 'border-transparent hover:border-gray-600'}`}>
                    <span className="text-white text-xs font-semibold drop-shadow">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Title *', key: 'title', placeholder: 'Build Your Vision' },
                { label: 'Subtitle', key: 'subtitle', placeholder: 'Premium Building Materials' },
                { label: 'Description', key: 'description', placeholder: 'Short description shown on banner...' },
                { label: 'CTA Button Text', key: 'cta_text', placeholder: 'Shop Now' },
                { label: 'CTA Link URL', key: 'cta_url', placeholder: '/products?category=building-materials' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
              ))}

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded bg-gray-800 hover:bg-gray-750 transition-colors">
                <div className="relative">
                  <input type="checkbox" checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="sr-only" />
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
                <span className="text-gray-300 text-sm">Active (show on homepage)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={save} className="flex-1 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-2.5 rounded text-sm">{editingId ? 'Save Changes' : 'Add Banner'}</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-800/50 rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2 text-red-400">Delete Banner?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteBanner(deleteConfirm); toast.success('Banner deleted'); setDeleteConfirm(null) }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
