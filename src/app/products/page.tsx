'use client'
import { useState, useEffect, useMemo } from 'react'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants'
import { useAdminStore } from '@/lib/adminStore'
import { Suspense } from 'react'

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { products: adminProducts } = useAdminStore()
  const [mounted, setMounted] = useState(false)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => { setMounted(true) }, [])

  const filtered = useMemo(() => {
    if (!mounted) return []
    let list = adminProducts.filter(p => p.is_active)
    if (category) list = list.filter(p => {
      const cat = CATEGORIES.find(c => c.slug === category)
      return cat ? p.category === cat.name : true
    })
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price_usd - b.price_usd)
    else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price_usd - a.price_usd)
    return list
  }, [mounted, adminProducts, category, search, sort])

  const PER_PAGE = 12
  const pages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const activeCategory = CATEGORIES.find(c => c.slug === category)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm font-body text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-ta-gold">Home</Link>
        <span>/</span>
        <span className="text-ta-dark">{activeCategory?.name || 'All Products'}</span>
      </nav>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-sm border border-gray-100 p-4 sticky top-24">
            <h3 className="font-display font-semibold text-ta-dark mb-4 text-sm">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => updateParam('category', '')}
                  className={`w-full text-left block px-3 py-2 rounded-sm text-sm transition-colors ${!category ? 'bg-ta-gold text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                  All Products
                </button>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors ${category === cat.slug ? 'bg-ta-gold text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-ta-dark">
                {search ? `Search: "${search}"` : activeCategory?.name || 'All Products'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{mounted ? filtered.length : '...'} products</p>
            </div>
            <div className="flex gap-3">
              {/* Search box */}
              <input
                type="text"
                placeholder="Search products..."
                defaultValue={search}
                onKeyDown={e => { if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value) }}
                className="border border-gray-200 rounded-sm px-3 py-2 text-sm font-body focus:outline-none focus:border-ta-gold w-48"
              />
              <select
                value={sort}
                onChange={e => updateParam('sort', e.target.value)}
                className="border border-gray-200 rounded-sm px-3 py-2 text-sm font-body focus:outline-none focus:border-ta-gold"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Mobile category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden">
            <button onClick={() => updateParam('category', '')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!category ? 'bg-ta-gold text-white border-ta-gold' : 'border-gray-300 text-gray-600'}`}>
              All
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => updateParam('category', cat.slug)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${category === cat.slug ? 'bg-ta-gold text-white border-ta-gold' : 'border-gray-300 text-gray-600'}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {!mounted ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-bold text-ta-dark mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try a different category or search term.</p>
              <button onClick={() => router.push('/products')} className="btn-primary">View All Products</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paged.map((product) => {
                  const catIcon = CATEGORIES.find(c => c.name === product.category)?.icon || '📦'
                  const discount = product.compare_price_usd > product.price_usd
                    ? Math.round((1 - product.price_usd / product.compare_price_usd) * 100) : 0
                  return (
                    <Link key={product.id} href={`/products/${product.slug}`}
                      className="group card flex flex-col hover:shadow-md hover:border-ta-gold transition-all duration-200">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <span className="text-5xl group-hover:scale-110 transition-transform duration-200">{catIcon}</span>
                        )}
                        {product.is_on_sale && discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-sm">-{discount}%</span>
                        )}
                        {product.is_featured && (
                          <span className="absolute top-2 right-2 bg-ta-gold text-white text-xs font-bold px-2 py-0.5 rounded-sm">⭐</span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs text-ta-gold font-mono uppercase mb-1">{product.category}</p>
                        <h3 className="font-body font-medium text-ta-dark text-sm mb-2 flex-1 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="font-display font-bold text-ta-dark">${product.price_usd}</span>
                            {product.compare_price_usd > product.price_usd && (
                              <span className="text-gray-400 text-xs line-through ml-2">${product.compare_price_usd}</span>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `${product.stock} left` : 'In Stock'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => updateParam('page', String(p))}
                      className={`w-10 h-10 flex items-center justify-center rounded-sm text-sm font-body transition-colors ${page === p ? 'bg-ta-gold text-white' : 'bg-white border border-gray-200 hover:border-ta-gold text-gray-700'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-96"><div className="text-gray-400">Loading products...</div></div>}>
        <ProductsContent />
      </Suspense>
    </StoreLayout>
  )
}
