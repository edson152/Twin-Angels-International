'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useAdminStore } from '@/lib/adminStore'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore()
  const [local, setLocal] = useState({ ...settings })
  const logoRef = useRef<HTMLInputElement>(null)

  const update = (key: string, value: string | boolean | string[]) =>
    setLocal(s => ({ ...s, [key]: value }))

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update('logo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const save = () => {
    updateSettings(local)
    toast.success('Settings saved!')
  }

  const updatePromoStrip = (idx: number, val: string) => {
    const arr = [...local.promo_strip]
    arr[idx] = val
    update('promo_strip', arr)
  }

  const addPromoItem = () => update('promo_strip', [...local.promo_strip, ''])
  const removePromoItem = (idx: number) => update('promo_strip', local.promo_strip.filter((_, i) => i !== idx))

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">          <h1 className="font-bold">Site Settings</h1>
        </div>
        <button onClick={save} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
          Save Changes
        </button>
      </div>

      <div className="p-6 max-w-3xl space-y-6">

        {/* Logo & Branding */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">🏷️ Logo & Branding</h2>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-xl border-2 border-gray-700 overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer hover:border-ta-gold transition-colors group relative"
                onClick={() => logoRef.current?.click()}>
                {local.logo ? (
                  <img src={local.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-ta-gold transition-colors">
                    <span className="text-3xl font-bold">{local.logo_text || 'TA'}</span>
                    <span className="text-xs">Click to upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Change Logo</span>
                </div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              {local.logo && (
                <button onClick={() => update('logo', '')} className="text-xs text-red-400 mt-1 hover:underline block text-center">Remove</button>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Site Name</label>
                <input value={local.site_name} onChange={e => update('site_name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Logo Fallback Text (shown if no logo image)</label>
                <input value={local.logo_text} onChange={e => update('logo_text', e.target.value)} maxLength={4}
                  placeholder="TA"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
            </div>
          </div>
        </section>

        {/* General */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">⚙️ General</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Support Email</label>
                <input value={local.support_email} onChange={e => update('support_email', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">WhatsApp Number</label>
                <input value={local.whatsapp_number} onChange={e => update('whatsapp_number', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">USD to ZiG Exchange Rate</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">1 USD =</span>
                <input type="number" value={local.usd_to_zig_rate} onChange={e => update('usd_to_zig_rate', e.target.value)}
                  className="w-28 bg-gray-800 border border-gray-700 text-ta-gold font-mono font-bold px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                <span className="text-gray-500 text-sm">ZiG</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
              <div>
                <p className="font-semibold text-red-300 text-sm">Maintenance Mode</p>
                <p className="text-gray-500 text-xs">Show maintenance page to all visitors</p>
              </div>
              <button onClick={() => update('maintenance_mode', !local.maintenance_mode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${local.maintenance_mode ? 'bg-red-500' : 'bg-gray-700'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${local.maintenance_mode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Promo Strip */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ta-gold text-sm tracking-widest uppercase">📢 Homepage Promo Strip</h2>
            <button onClick={addPromoItem} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded border border-gray-700 transition-colors">+ Add Item</button>
          </div>
          <p className="text-gray-500 text-xs mb-3">These messages scroll across the gold bar beneath the hero banner.</p>
          <div className="space-y-2">
            {local.promo_strip.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={item} onChange={e => updatePromoStrip(idx, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                <button onClick={() => removePromoItem(idx)} className="text-red-400 hover:text-red-300 text-lg leading-none px-1">×</button>
              </div>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">🎨 Colors & Theme</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Gold Accent Color', key: 'primary_color' },
              { label: 'Dark Background Color', key: 'dark_color' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={local[field.key as keyof typeof local] as string}
                    onChange={e => update(field.key, e.target.value)}
                    className="w-10 h-10 rounded border border-gray-700 cursor-pointer bg-transparent" />
                  <input type="text" value={local[field.key as keyof typeof local] as string}
                    onChange={e => update(field.key, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-ta-gold" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">📱 Social Media</h2>
          <div className="space-y-3">
            {[
              { label: 'Facebook URL', key: 'facebook_url', placeholder: 'https://facebook.com/twinangels' },
              { label: 'Instagram URL', key: 'instagram_url', placeholder: 'https://instagram.com/twinangels' },
              { label: 'Twitter / X URL', key: 'twitter_url', placeholder: 'https://x.com/twinangels' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                <input type="url" placeholder={field.placeholder}
                  value={local[field.key as keyof typeof local] as string}
                  onChange={e => update(field.key, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold placeholder-gray-600" />
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">🔗 Footer Content</h2>
          <div>
            <label className="block text-gray-400 text-xs mb-1">About Description</label>
            <textarea rows={3} value={local.footer_about} onChange={e => update('footer_about', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold resize-none" />
          </div>
        </section>

        <button onClick={save} className="w-full bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-3 rounded transition-colors">
          Save All Settings
        </button>
      </div>
    </div>
  )
}
