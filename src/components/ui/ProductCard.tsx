'use client'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useCartStore } from '@/lib/store'
import { FiShoppingCart, FiEye } from 'react-icons/fi'

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price_usd: number
  price_zig: number
  compare_price_usd?: number
  image: string
  category: string
  stock: number
  is_featured: boolean
  is_on_sale: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, currency } = useCartStore()

  const price = currency === 'USD' ? product.price_usd : product.price_zig
  const comparePrice =
    currency === 'USD' ? product.compare_price_usd : product.compare_price_usd
      ? product.compare_price_usd * 70
      : undefined
  const symbol = currency === 'USD' ? '$' : 'ZiG'

  const discount =
    comparePrice && comparePrice > price
      ? Math.round((1 - price / comparePrice) * 100)
      : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    addItem({
      id: product.id,
      name: product.name,
      price_usd: product.price_usd,
      price_zig: product.price_zig,
      quantity: 1,
      image: product.image,
      stock: product.stock,
      slug: product.slug,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group card flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_on_sale && discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-ta-dark text-xs font-semibold px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow">
            <FiEye size={14} />
            Quick View
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-ta-gold font-mono uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-body font-medium text-ta-dark text-sm leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display font-bold text-lg text-ta-dark">
            {symbol} {price.toLocaleString()}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-gray-400 text-sm line-through font-body">
              {symbol} {comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-body font-semibold rounded-sm transition-all duration-200 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-ta-dark hover:bg-ta-gold text-white'
          }`}
        >
          <FiShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
