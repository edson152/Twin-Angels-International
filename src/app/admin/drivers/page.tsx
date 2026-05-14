'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

const MOCK_DRIVERS = [
  { id: 1, first_name: 'Takudzwa', last_name: 'Moyo', phone: '+263 77 111 2222', is_active: true, current_order: 'TA-00038' },
  { id: 2, first_name: 'Blessing', last_name: 'Kupara', phone: '+263 71 333 4444', is_active: true, current_order: 'TA-00040' },
  { id: 3, first_name: 'Farai', last_name: 'Nhema', phone: '+263 73 555 6666', is_active: true, current_order: null },
  { id: 4, first_name: 'Tendai', last_name: 'Zimba', phone: '+263 77 777 8888', is_active: false, current_order: null },
]

const MOCK_VEHICLES = [
  { id: 1, plate: 'ZH-123-BP', make: 'Toyota', model: 'Hilux', is_active: true, driver: 'Takudzwa M.' },
  { id: 2, plate: 'ZH-456-BP', make: 'Isuzu', model: 'Truck', is_active: true, driver: 'Blessing K.' },
  { id: 3, plate: 'ZH-789-BP', make: 'Ford', model: 'Ranger', is_active: true, driver: null },
  { id: 4, plate: 'ZH-321-BP', make: 'Toyota', model: 'Land Cruiser', is_active: false, driver: null },
]

export default function AdminDriversPage() {
  const [tab, setTab] = useState<'drivers' | 'vehicles'>('drivers')
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [newDriver, setNewDriver] = useState({ first_name: '', last_name: '', phone: '' })

  const addDriver = () => {
    if (!newDriver.first_name) return
    toast.success(`Driver ${newDriver.first_name} added!`)
    setNewDriver({ first_name: '', last_name: '', phone: '' })
    setShowAddDriver(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold">Drivers & Vehicles</h1>
        </div>
        <button onClick={() => setShowAddDriver(true)} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
          + Add Driver
        </button>
      </div>

      <div className="p-6 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['drivers', 'vehicles'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded text-sm font-semibold capitalize transition-colors ${tab === t ? 'bg-ta-gold text-white' : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
              {t === 'drivers' ? `👤 Drivers (${MOCK_DRIVERS.length})` : `🚗 Vehicles (${MOCK_VEHICLES.length})`}
            </button>
          ))}
        </div>

        {tab === 'drivers' && (
          <div className="space-y-3">
            {MOCK_DRIVERS.map(driver => (
              <div key={driver.id} className={`bg-gray-900 border rounded-xl p-5 flex items-center gap-4 ${!driver.is_active ? 'opacity-50 border-gray-800' : 'border-gray-700'}`}>
                <div className="w-12 h-12 bg-ta-gold/20 rounded-full flex items-center justify-center text-ta-gold font-bold text-lg shrink-0">
                  {driver.first_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{driver.first_name} {driver.last_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${driver.is_active ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                      {driver.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {driver.current_order && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-700/50 font-bold">
                        🚚 ON ROUTE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{driver.phone}</p>
                  {driver.current_order && (
                    <p className="text-blue-400 text-xs mt-1 font-mono">Delivering: {driver.current_order}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`https://wa.me/${driver.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-700/30 px-3 py-1.5 rounded font-semibold transition-colors">
                    WhatsApp
                  </a>
                  <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded font-semibold transition-colors">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'vehicles' && (
          <div className="space-y-3">
            {MOCK_VEHICLES.map(vehicle => (
              <div key={vehicle.id} className={`bg-gray-900 border rounded-xl p-5 flex items-center gap-4 ${!vehicle.is_active ? 'opacity-50 border-gray-800' : 'border-gray-700'}`}>
                <div className="text-3xl">🚗</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-ta-gold">{vehicle.plate}</span>
                    <span className="text-gray-400 text-sm">{vehicle.make} {vehicle.model}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${vehicle.driver ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' : vehicle.is_active ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                      {vehicle.driver ? 'IN USE' : vehicle.is_active ? 'Available' : 'Inactive'}
                    </span>
                  </div>
                  {vehicle.driver && <p className="text-gray-400 text-sm">Driver: {vehicle.driver}</p>}
                </div>
                <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded font-semibold transition-colors">Edit</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-5">Add New Driver</h2>
            <div className="space-y-4">
              {[
                { label: 'First Name', key: 'first_name' },
                { label: 'Last Name', key: 'last_name' },
                { label: 'Phone / WhatsApp', key: 'phone' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-gray-400 text-xs mb-1">{f.label}</label>
                  <input value={newDriver[f.key as keyof typeof newDriver]} onChange={e => setNewDriver(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addDriver} className="flex-1 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-2.5 rounded transition-colors text-sm">Add Driver</button>
              <button onClick={() => setShowAddDriver(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
