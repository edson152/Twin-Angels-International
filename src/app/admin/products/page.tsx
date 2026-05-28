'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useAdminStore, Product } from '@/lib/adminStore'
import { CATEGORIES } from '@/lib/constants'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', slug: '', category: 'Building Materials', description: '',
  price_usd: 0, price_zig: 0, compare_price_usd: 0, stock: 0,
  is_active: true, is_featured: false, show_on_home: false, is_on_sale: false,
  images: [] as string[],
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = products.filter(p => {
    if (catFilter && p.category !== catFilter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openAdd = () => {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, category: p.category, description: p.description,
      price_usd: p.price_usd, price_zig: p.price_zig, compare_price_usd: p.compare_price_usd,
      stock: p.stock, is_active: p.is_active, is_featured: p.is_featured,
      show_on_home: p.show_on_home, is_on_sale: p.is_on_sale, images: p.images || [],
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setForm(f => ({ ...f, images: [...f.images, ev.target?.result as string] }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  const save = () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return }
    if (form.price_usd <= 0) { toast.error('Price must be greater than 0'); return }
    const slug = form.slug || slugify(form.name)
    if (editingId) {
      updateProduct(editingId, { ...form, slug })
      toast.success('Product updated!')
    } else {
      addProduct({ ...form, slug })
      toast.success('Product added!')
    }
    setShowForm(false)
  }

  const confirmDelete = (id: number) => setDeleteConfirm(id)
  const doDelete = () => {
    if (deleteConfirm) { deleteProduct(deleteConfirm); toast.success('Product deleted') }
    setDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">          <h1 className="font-bold">Products & Inventory</h1>
        </div>
        <button onClick={openAdd} className="bg-ta-gold hover:bg-ta-gold-dark text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
          + Add Product
        </button>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: products.length, color: 'text-white' },
            { label: 'Show on Home', value: products.filter(p => p.show_on_home).length, color: 'text-ta-gold' },
            { label: 'Low Stock (<10)', value: products.filter(p => p.stock < 10).length, color: 'text-yellow-400' },
            { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className={`text-2xl font-bold font-mono mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-ta-gold w-64" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-ta-gold">
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
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded border border-gray-700" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-gray-600 text-xs">No img</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-200">{p.name}</div>
                        <div className="text-gray-600 text-xs font-mono">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.category}</td>
                  <td className="px-4 py-3 font-mono font-bold text-ta-gold">${p.price_usd}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold text-sm ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.show_on_home && <span className="text-xs px-1.5 py-0.5 bg-ta-gold/20 text-ta-gold border border-ta-gold/30 rounded-full">Home</span>}
                      {p.is_featured && <span className="text-xs px-1.5 py-0.5 bg-purple-900/30 text-purple-400 border border-purple-700/40 rounded-full">Featured</span>}
                      {p.is_on_sale && <span className="text-xs px-1.5 py-0.5 bg-red-900/30 text-red-400 border border-red-700/40 rounded-full">Sale</span>}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border ${p.is_active ? 'bg-green-900/30 text-green-400 border-green-700/40' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors">Edit</button>
                      <button onClick={() => updateProduct(p.id, { show_on_home: !p.show_on_home })}
                        className={`text-xs px-2 py-1 rounded transition-colors border ${p.show_on_home ? 'bg-ta-gold/20 text-ta-gold border-ta-gold/30' : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-ta-gold/30 hover:text-ta-gold'}`}>
                        {p.show_on_home ? '🏠 Home' : 'Home?'}
                      </button>
                      <button onClick={() => confirmDelete(p.id)} className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/30 px-2 py-1 rounded transition-colors">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-600">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="space-y-4">
              {/* Images */}
              <div>
                <label className="block text-gray-400 text-xs mb-2">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded border border-gray-700" />
                      <button onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center">×</button>
                    </div>
                  ))}
                  <button onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-gray-700 hover:border-ta-gold rounded flex flex-col items-center justify-center text-gray-500 hover:text-ta-gold transition-colors text-xs gap-1">
                    <span className="text-2xl">+</span>
                    <span>Add</span>
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-400 text-xs mb-1">Product Name *</label>
                  <input value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-400 text-xs mb-1">URL Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-400 px-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-ta-gold" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Price (USD) *</label>
                  <input type="number" value={form.price_usd || ''}
                    onChange={e => setForm(f => ({ ...f, price_usd: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Price (ZiG)</label>
                  <input type="number" value={form.price_zig || ''}
                    onChange={e => setForm(f => ({ ...f, price_zig: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Compare Price (USD)</label>
                  <input type="number" value={form.compare_price_usd || ''}
                    onChange={e => setForm(f => ({ ...f, compare_price_usd: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Stock Quantity</label>
                  <input type="number" value={form.stock || ''}
                    onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold" />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-400 text-xs mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold">
                    {CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-400 text-xs mb-1">Description</label>
                  <textarea rows={3} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-ta-gold resize-none" />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { key: 'is_active', label: '✅ Active (visible in store)', color: 'green' },
                  { key: 'show_on_home', label: '🏠 Show on Homepage', color: 'gold' },
                  { key: 'is_featured', label: '⭐ Featured Product', color: 'purple' },
                  { key: 'is_on_sale', label: '🔥 On Sale', color: 'red' },
                ].map(({ key, label, color }) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors">
                    <div className="relative">
                      <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                        className="sr-only" />
                      <div className={`w-9 h-5 rounded-full transition-colors ${form[key as keyof typeof form] ? 
                        color === 'gold' ? 'bg-ta-gold' : color === 'purple' ? 'bg-purple-500' : color === 'red' ? 'bg-red-500' : 'bg-green-500'
                        : 'bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                    </div>
                    <span className="text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={save} className="flex-1 bg-ta-gold hover:bg-ta-gold-dark text-white font-semibold py-2.5 rounded transition-colors text-sm">
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-800/50 rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2 text-red-400">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={doDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
