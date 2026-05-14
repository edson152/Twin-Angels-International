'use client'
import Link from 'next/link'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/constants'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Portland Cement 50kg', slug: 'portland-cement-50kg', category: 'Building Materials', price_usd: 12, stock: 500, is_active: true, is_featured: false, is_on_sale: true },
  { id: 2, name: 'Executive Leather Chair', slug: 'executive-leather-office-chair', category: 'Office Furniture', price_usd: 185, stock: 15, is_active: true, is_featured: true, is_on_sale: true },
  { id: 3, name: 'Cotton Poplin Fabric 60m', slug: 'cotton-poplin-60m', category: 'Fabric Rolls', price_usd: 85, stock: 40, is_active: true, is_featured: false, is_on_sale: false },
  { id: 4, name: 'Digital Flatbed Printer A3', slug: 'digital-flatbed-printer-a3', category: 'Printing Machines', price_usd: 1200, stock: 5, is_active: true, is_featured: true, is_on_sale: true },
  { id: 5, name: '3-Seater Fabric Sofa', slug: '3-seater-fabric-sofa', category: 'House Furniture', price_usd: 420, stock: 10, is_active: true, is_featured: false, is_on_sale: true },
  { id: 6, name: 'Steel Rebar 12mm × 6m', slug: 'steel-rebar-12mm-6m', category: 'Building Materials', price_usd: 8.5, stock: 300, is_active: true, is_featured: false, is_on_sale: false },
]

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (catFilter && p.category !== catFilter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold">Products & Inventory</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: MOCK_PRODUCTS.length, color: 'text-white' },
            { label: 'In Stock', value: MOCK_PRODUCTS.filter(p => p.stock > 0).length, color: 'text-green-400' },
            { label: 'Low Stock (<10)', value: MOCK_PRODUCTS.filter(p => p.stock < 10).length, color: 'text-yellow-400' },
            { label: 'Out of Stock', value: MOCK_PRODUCTS.filter(p => p.stock === 0).length, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className={`text-2xl font-bold font-mono mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-ta-gold w-64"
          />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-ta-gold"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase">Product</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase">Price</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase hidden lg:table-cell">Flags</th>
                <th className="px-4 py-3 text-left text-gray-500 font-mono text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-200">{p.name}</div>
                    <div className="text-gray-600 text-xs font-mono">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.category}</td>
                  <td className="px-4 py-3 font-mono font-bold text-ta-gold">${p.price_usd}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold text-sm ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1">
                      {p.is_featured && <span className="text-xs px-1.5 py-0.5 bg-purple-900/30 text-purple-400 border border-purple-700/40 rounded-full">Featured</span>}
                      {p.is_on_sale && <span className="text-xs px-1.5 py-0.5 bg-red-900/30 text-red-400 border border-red-700/40 rounded-full">Sale</span>}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border ${p.is_active ? 'bg-green-900/30 text-green-400 border-green-700/40' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors">Edit</button>
                      <button className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-700/30 px-2 py-1 rounded transition-colors">Stock</button>
                      <button className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/30 px-2 py-1 rounded transition-colors">Hide</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Add New Product</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Product Name', name: 'name', col: 2 },
                { label: 'URL Slug', name: 'slug', col: 2 },
                { label: 'Price (USD)', name: 'price_usd', type: 'number' },
                { label: 'Price (ZiG)', name: 'price_zig', type: 'number' },
                { label: 'Compare Price (USD)', name: 'compare_price_usd', type: 'number' },
                { label: 'Stock Quantity', name: 'stock', type: 'number' },
              ].map(field => (
                <div key={field.name} className={field.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-gray-400 text-xs mb-1">Category</label>
                <select className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold">
                  {CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-400 text-xs mb-1">Description</label>
                <textarea rows={3} className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold resize-none" />
              </div>
              <div className="col-span-2 flex gap-4">
                {['is_featured', 'is_on_sale'].map(f => (
                  <label key={f} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input type="checkbox" className="accent-ta-gold" />
                    {f === 'is_featured' ? 'Featured Product' : 'On Sale'}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-2.5 rounded transition-colors text-sm">
                Add Product
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
