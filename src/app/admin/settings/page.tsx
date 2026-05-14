'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: 'Twin Angels International Development',
    support_email: 'edsonnyoni92@gmail.com',
    whatsapp_number: '+263XXXXXXXXX',
    primary_color: '#C8A96B',
    dark_color: '#1F2937',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    footer_about: "Zimbabwe's premier marketplace for industrial supplies, building materials, and quality furniture.",
    maintenance_mode: false,
    usd_to_zig_rate: '70',
  })

  const update = (key: string, value: string | boolean) =>
    setSettings(s => ({ ...s, [key]: value }))

  const save = () => toast.success('Settings saved successfully!')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold">Site Settings</h1>
        </div>
        <button onClick={save} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
          Save Changes
        </button>
      </div>

      <div className="p-6 max-w-3xl space-y-6">
        {/* General */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">⚙️ General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Site Name</label>
              <input value={settings.site_name} onChange={e => update('site_name', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Support Email</label>
                <input value={settings.support_email} onChange={e => update('support_email', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">WhatsApp Number</label>
                <input value={settings.whatsapp_number} onChange={e => update('whatsapp_number', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">USD to ZiG Exchange Rate</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">1 USD =</span>
                <input type="number" value={settings.usd_to_zig_rate} onChange={e => update('usd_to_zig_rate', e.target.value)}
                  className="w-28 bg-gray-800 border border-gray-700 text-ta-gold font-mono font-bold px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                <span className="text-gray-500 text-sm">ZiG</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
              <div>
                <p className="font-semibold text-red-300 text-sm">Maintenance Mode</p>
                <p className="text-gray-500 text-xs">Show a maintenance page to all visitors</p>
              </div>
              <button
                onClick={() => update('maintenance_mode', !settings.maintenance_mode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenance_mode ? 'bg-red-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenance_mode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Colors & Theme */}
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
                  <input
                    type="color"
                    value={settings[field.key as keyof typeof settings] as string}
                    onChange={e => update(field.key, e.target.value)}
                    className="w-10 h-10 rounded border border-gray-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings[field.key as keyof typeof settings] as string}
                    onChange={e => update(field.key, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-ta-gold"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">Note: Color changes require a site rebuild to apply. Contact your developer.</p>
        </section>

        {/* Social Media */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">📱 Social Media Links</h2>
          <div className="space-y-3">
            {[
              { label: 'Facebook Page URL', key: 'facebook_url', placeholder: 'https://facebook.com/twinangels' },
              { label: 'Instagram URL', key: 'instagram_url', placeholder: 'https://instagram.com/twinangels' },
              { label: 'Twitter / X URL', key: 'twitter_url', placeholder: 'https://x.com/twinangels' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                <input
                  type="url"
                  placeholder={field.placeholder}
                  value={settings[field.key as keyof typeof settings] as string}
                  onChange={e => update(field.key, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold placeholder-gray-600"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-ta-gold mb-4 text-sm tracking-widest uppercase">🔗 Footer Content</h2>
          <div>
            <label className="block text-gray-400 text-xs mb-1">About Description</label>
            <textarea
              rows={3}
              value={settings.footer_about}
              onChange={e => update('footer_about', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold resize-none"
            />
          </div>
        </section>

        <button onClick={save} className="w-full bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-3 rounded transition-colors">
          Save All Settings
        </button>
      </div>
    </div>
  )
}
