'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/lib/store'

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price_usd: number
  price_zig: number
  compare_price_usd?: number
  image?: string
  category: string
  stock: number
  is_featured: boolean
  is_on_sale: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, currency } = useCartStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Use USD as default to match server render, switch after mount
  const activeCurrency = mounted ? currency : 'USD'
  const price = activeCurrency === 'USD' ? product.price_usd : product.price_zig
  const comparePrice = activeCurrency === 'USD' ? product.compare_price_usd : (product.compare_price_usd ? product.compare_price_usd * 70 : undefined)
  const symbol = activeCurrency === 'USD' ? '$' : 'ZiG '
  const discount = comparePrice && comparePrice > price ? Math.round((1 - price / comparePrice) * 100) : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price_usd: product.price_usd,
      price_zig: product.price_zig,
      quantity: 1,
      image: product.image || '',
      stock: product.stock,
      slug: product.slug,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link href={`/products/${product.slug}`}
      className="group card flex flex-col hover:shadow-lg hover:border-ta-gold transition-all duration-200">
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden rounded-t-sm">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-5xl">📦</span>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
        )}
        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-ta-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">⭐</span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-9 h-9 bg-ta-gold text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-ta-gold-dark shadow-lg text-sm"
          title="Add to cart"
        >
          🛒
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-ta-gold font-mono uppercase mb-1">{product.category}</p>
        <h3 className="font-body font-medium text-ta-dark text-sm mb-auto line-clamp-2 group-hover:text-ta-gold transition-colors">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-display font-bold text-ta-dark">{symbol}{price.toLocaleString()}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-gray-400 text-xs line-through ml-1">{symbol}{comparePrice.toLocaleString()}</span>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? `${product.stock} left` : 'In stock'}
          </span>
        </div>
      </div>
    </Link>
  )
}
