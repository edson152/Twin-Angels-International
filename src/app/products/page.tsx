import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  page?: string
}

export default function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, search, sort = 'newest', page = '1' } = searchParams

  // Mock products - replace with DB query
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: ['Portland Cement 50kg', 'Steel Rebar 12mm', 'Cotton Fabric Roll', 'Office Desk', 'Printing Machine A3', 'Leather Chair'][i % 6],
    slug: `product-${i + 1}`,
    price_usd: [12, 45, 85, 220, 1200, 185][i % 6],
    price_zig: [840, 3150, 5950, 15400, 84000, 12950][i % 6],
    category: CATEGORIES[i % CATEGORIES.length].name,
    stock: Math.floor(Math.random() * 50) + 1,
    is_on_sale: i % 3 === 0,
    icon: CATEGORIES[i % CATEGORIES.length].icon,
  }))

  const activeCategory = CATEGORIES.find(c => c.slug === category)

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm font-body text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-ta-gold">Home</Link>
          <span>/</span>
          <span className="text-ta-dark">{activeCategory?.name || 'All Products'}</span>
        </nav>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-sm border border-gray-100 p-4 sticky top-24">
              <h3 className="font-display font-semibold text-ta-dark mb-4 text-sm">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-sm text-sm transition-colors ${!category ? 'bg-ta-gold text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    All Products
                  </Link>
                </li>
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors ${category === cat.slug ? 'bg-ta-gold text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-ta-dark">
                  {search ? `Search: "${search}"` : activeCategory?.name || 'All Products'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
              </div>
              <select
                className="border border-gray-200 rounded-sm px-3 py-2 text-sm font-body focus:outline-none focus:border-ta-gold"
                defaultValue={sort}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group card flex flex-col hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center text-5xl relative overflow-hidden">
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {product.icon}
                    </span>
                    {product.is_on_sale && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-sm">SALE</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-ta-gold font-mono uppercase mb-1">{product.category}</p>
                    <h3 className="font-body font-medium text-ta-dark text-sm mb-2 flex-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display font-bold text-ta-dark">${product.price_usd}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center gap-2">
              {[1, 2, 3].map(p => (
                <Link
                  key={p}
                  href={`/products?page=${p}${category ? `&category=${category}` : ''}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-sm text-sm font-body transition-colors ${Number(page) === p ? 'bg-ta-gold text-white' : 'bg-white border border-gray-200 hover:border-ta-gold'}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
