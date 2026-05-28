'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { useAdminStore } from '@/lib/adminStore'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { CATEGORIES, WHATSAPP_SUPPORT } from '@/lib/constants'

// Fallback product data if slug doesn&apos;t match admin store
const FALLBACK_PRODUCTS: Record<string, any> = {
  'portland-cement-50kg': { id: 1, name: 'Portland Cement 50kg Bag', category: 'Building Materials', category_slug: 'building-materials', description: 'High-strength Portland cement, ideal for all construction works including bricklaying, plastering, and concrete production.\n\nThis premium cement meets ZABS standards and is suitable for both residential and commercial construction.\n\nKey Features:\n- 50kg per bag\n- CEM II/B-L 32.5N strength class\n- Suitable for general construction\n- ZABS certified', price_usd: 12, price_zig: 840, compare_price_usd: 15, stock: 500, is_on_sale: true, sku: 'BM-PC-50KG', images: [] },
  'executive-leather-office-chair': { id: 2, name: 'Executive Leather Chair', category: 'Office Furniture', category_slug: 'office-furniture', description: 'Premium executive leather office chair with lumbar support and adjustable height.', price_usd: 185, price_zig: 12950, compare_price_usd: 220, stock: 15, is_on_sale: true, sku: 'OF-ELC-001', images: [] },
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { addItem, currency } = useCartStore()
  const { products: adminProducts } = useAdminStore()
  const [qty, setQty] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  const adminProduct = mounted ? adminProducts.find(p => p.slug === params.slug) : null
  const fallback = FALLBACK_PRODUCTS[params.slug]
  const product = adminProduct || fallback

  if (!mounted) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-sm" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-100 rounded w-1/3" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </StoreLayout>
    )
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="font-display text-3xl font-bold text-ta-dark mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">This product may have been removed or the link is incorrect.</p>
          <Link href="/products" className="btn-primary">Browse All Products</Link>
        </div>
      </StoreLayout>
    )
  }

  const symbol = currency === 'USD' ? '$' : 'ZiG'
  const price = currency === 'USD' ? product.price_usd : product.price_zig
  const comparePrice = currency === 'USD' ? product.compare_price_usd : (product.compare_price_usd * 70)
  const discount = comparePrice > price ? Math.round((1 - price / comparePrice) * 100) : 0
  const catIcon = CATEGORIES.find(c => c.name === product.category)?.icon || '📦'

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price_usd: product.price_usd,
      price_zig: product.price_zig,
      quantity: qty,
      image: product.images?.[0] || '',
      stock: product.stock,
      slug: params.slug,
    })
    toast.success(`${qty}× ${product.name} added to cart`)
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm font-body text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-ta-gold">Home</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category_slug || product.category?.toLowerCase().replace(/ /g, '-')}`} className="hover:text-ta-gold">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ta-dark line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center relative overflow-hidden mb-3">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-contain p-4" />
              ) : (
                <span className="text-8xl">{catIcon}</span>
              )}
              {product.is_on_sale && discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-sm">-{discount}% OFF</span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded border-2 overflow-hidden transition-colors ${selectedImage === i ? 'border-ta-gold' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-ta-gold font-mono text-xs tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="font-display text-3xl font-bold text-ta-dark mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display text-4xl font-bold text-ta-dark">
                {symbol} {price.toLocaleString()}
              </span>
              {comparePrice > price && (
                <span className="text-gray-400 text-xl line-through">
                  {symbol} {comparePrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                  Save {symbol} {(comparePrice - price).toLocaleString()}
                </span>
              )}
            </div>
            {product.sku && <p className="text-gray-500 text-sm mb-4">SKU: <span className="font-mono">{product.sku}</span></p>}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? `Only ${product.stock} units left` : `${product.stock} units in stock`}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-body text-gray-600 mb-2">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded-sm w-32">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-gray-50 transition-colors text-lg">−</button>
                  <span className="flex-1 text-center font-mono font-bold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-3 hover:bg-gray-50 transition-colors text-lg">+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {product.stock > 0 ? (
                <>
                  <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2">
                    🛒 Add to Cart
                  </button>
                  <Link href="/checkout" className="btn-secondary px-6">Buy Now</Link>
                </>
              ) : (
                <div className="flex-1 py-3 text-center bg-gray-100 text-gray-400 rounded-sm font-semibold text-sm uppercase tracking-wide">
                  Out of Stock
                </div>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi, I&apos;m interested in: ${product.name}`}
                target="_blank" rel="noopener noreferrer"
                className="border border-green-500 text-green-600 hover:bg-green-50 font-semibold px-4 rounded-sm transition-colors text-sm flex items-center gap-1.5 uppercase tracking-wide py-3"
              >
                💬 WhatsApp
              </a>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100 text-sm">
              {[
                { icon: '🚚', text: 'Delivery to all zones' },
                { icon: '💳', text: 'Multiple payment options' },
                { icon: '📱', text: 'WhatsApp order tracking' },
                { icon: '✅', text: 'Quality guaranteed' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 text-gray-600">
                  <span>{item.icon}</span><span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-ta-dark mb-6 pb-3 border-b border-gray-100">Product Description</h2>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line font-body">
              {product.description}
            </div>
          </div>
        )}

        {/* Related products */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ta-dark mb-6">More in {product.category}</h2>
          <div className="text-center py-8 text-gray-400">
            <Link href={`/products?category=${product.category_slug || ''}`} className="btn-secondary">
              Browse {product.category}
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
