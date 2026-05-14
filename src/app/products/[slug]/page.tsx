'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiMinus, FiPlus, FiShare2 } from 'react-icons/fi'
import { WHATSAPP_SUPPORT } from '@/lib/constants'

// Mock product - in production, fetch from DB by slug
const MOCK_PRODUCT = {
  id: 1,
  name: 'Portland Cement 50kg Bag',
  slug: 'portland-cement-50kg',
  description: `High-strength Portland cement, ideal for all construction works including bricklaying, plastering, and concrete production.

This premium cement meets ZABS standards and is suitable for both residential and commercial construction.

**Key Features:**
- 50kg per bag
- CEM II/B-L 32.5N strength class  
- Suitable for general construction
- Low heat of hydration
- ZABS certified`,
  price_usd: 12,
  price_zig: 840,
  compare_price_usd: 15,
  stock: 500,
  category: 'Building Materials',
  category_slug: 'building-materials',
  is_on_sale: true,
  sku: 'BM-PC-50KG',
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { addItem, currency } = useCartStore()
  const [qty, setQty] = useState(1)

  const product = MOCK_PRODUCT // In production: fetch by params.slug
  const symbol = currency === 'USD' ? '$' : 'ZiG'
  const price = currency === 'USD' ? product.price_usd : product.price_zig
  const comparePrice = currency === 'USD' ? product.compare_price_usd : product.compare_price_usd * 70
  const discount = Math.round((1 - price / comparePrice) * 100)

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price_usd: product.price_usd, price_zig: product.price_zig, quantity: qty, image: '/placeholder-product.jpg', stock: product.stock, slug: product.slug })
    toast.success(`${qty}× ${product.name} added to cart`)
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm font-body text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-ta-gold">Home</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category_slug}`} className="hover:text-ta-gold">{product.category}</Link>
          <span>/</span>
          <span className="text-ta-dark line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center text-8xl relative">
            🧱
            {product.is_on_sale && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-sm">
                -{discount}% OFF
              </span>
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
              <span className="text-gray-400 text-xl line-through">
                {symbol} {comparePrice.toLocaleString()}
              </span>
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                Save {symbol} {(comparePrice - price).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6">SKU: <span className="font-mono">{product.sku}</span></p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-green-700 text-sm font-medium">{product.stock} units in stock</span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-body text-gray-600 mb-2">Quantity</label>
              <div className="flex items-center border border-gray-200 rounded-sm w-32">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-gray-50 transition-colors">
                  <FiMinus size={16} />
                </button>
                <span className="flex-1 text-center font-mono font-bold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-3 hover:bg-gray-50 transition-colors">
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <FiShoppingCart size={18} />
                Add to Cart
              </button>
              <Link href="/checkout" className="btn-secondary px-6">Buy Now</Link>
              <a
                href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi, I'm interested in: ${product.name} (${product.sku})`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-500 text-green-600 hover:bg-green-50 font-semibold px-4 rounded-sm transition-colors text-sm flex items-center gap-1.5 uppercase tracking-wide"
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
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-ta-dark mb-6 pb-3 border-b border-gray-100">Product Description</h2>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line font-body">
            {product.description}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
