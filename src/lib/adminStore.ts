'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CATEGORIES } from '@/lib/constants'

export interface Product {
  id: number
  name: string
  slug: string
  category: string
  description: string
  price_usd: number
  price_zig: number
  compare_price_usd: number
  stock: number
  is_active: boolean
  is_featured: boolean
  show_on_home: boolean
  is_on_sale: boolean
  images: string[] // base64 or URL
  created_at: string
}

export interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_url: string
  image: string // base64 or URL
  is_active: boolean
  sort_order: number
  bg_gradient: string
}

export interface SiteSettings {
  site_name: string
  logo: string // base64 or URL
  logo_text: string
  support_email: string
  whatsapp_number: string
  primary_color: string
  dark_color: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  footer_about: string
  maintenance_mode: boolean
  usd_to_zig_rate: string
  promo_strip: string[]
}

interface AdminStore {
  products: Product[]
  banners: Banner[]
  settings: SiteSettings
  addProduct: (p: Omit<Product, 'id' | 'created_at'>) => void
  updateProduct: (id: number, updates: Partial<Product>) => void
  deleteProduct: (id: number) => void
  addBanner: (b: Omit<Banner, 'id' | 'sort_order'>) => void
  updateBanner: (id: number, updates: Partial<Banner>) => void
  deleteBanner: (id: number) => void
  reorderBanners: (banners: Banner[]) => void
  updateSettings: (updates: Partial<SiteSettings>) => void
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Portland Cement 50kg', slug: 'portland-cement-50kg', category: 'Building Materials', description: 'High-quality Portland cement for construction.', price_usd: 12, price_zig: 840, compare_price_usd: 15, stock: 500, is_active: true, is_featured: true, show_on_home: true, is_on_sale: true, images: [], created_at: new Date().toISOString() },
  { id: 2, name: 'Executive Leather Chair', slug: 'executive-leather-office-chair', category: 'Office Furniture', description: 'Premium executive leather office chair.', price_usd: 185, price_zig: 12950, compare_price_usd: 220, stock: 15, is_active: true, is_featured: true, show_on_home: true, is_on_sale: true, images: [], created_at: new Date().toISOString() },
  { id: 3, name: 'Cotton Poplin Fabric 60m', slug: 'cotton-poplin-60m', category: 'Fabric Rolls', description: 'Premium cotton poplin fabric roll.', price_usd: 85, price_zig: 5950, compare_price_usd: 100, stock: 40, is_active: true, is_featured: false, show_on_home: false, is_on_sale: false, images: [], created_at: new Date().toISOString() },
  { id: 4, name: 'Digital Flatbed Printer A3', slug: 'digital-flatbed-printer-a3', category: 'Printing Machines', description: 'Professional A3 digital flatbed printer.', price_usd: 1200, price_zig: 84000, compare_price_usd: 1450, stock: 5, is_active: true, is_featured: true, show_on_home: true, is_on_sale: true, images: [], created_at: new Date().toISOString() },
  { id: 5, name: '3-Seater Fabric Sofa', slug: '3-seater-fabric-sofa', category: 'House Furniture', description: 'Comfortable 3-seater fabric sofa.', price_usd: 420, price_zig: 29400, compare_price_usd: 500, stock: 10, is_active: true, is_featured: false, show_on_home: false, is_on_sale: true, images: [], created_at: new Date().toISOString() },
]

const DEFAULT_BANNERS: Banner[] = [
  { id: 1, title: 'Build Your Vision', subtitle: 'Premium Building Materials', description: 'Quality cement, steel, tiles, and more — delivered to your site.', cta_text: 'Shop Now', cta_url: '/products?category=building-materials', image: '', is_active: true, sort_order: 1, bg_gradient: 'from-slate-900 via-slate-800 to-slate-700' },
  { id: 2, title: 'Fabric Excellence', subtitle: 'Premium Fabric Rolls', description: 'Extensive range of fabric rolls for fashion and industrial use.', cta_text: 'Browse Fabrics', cta_url: '/products?category=fabric-rolls', image: '', is_active: true, sort_order: 2, bg_gradient: 'from-amber-900 via-amber-800 to-stone-700' },
  { id: 3, title: 'Outfit Your Office', subtitle: 'Premium Office Furniture', description: 'Ergonomic chairs, desks, and storage solutions.', cta_text: 'View Furniture', cta_url: '/products?category=office-furniture', image: '', is_active: true, sort_order: 3, bg_gradient: 'from-zinc-900 via-zinc-800 to-neutral-700' },
]

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Twin Angels International Development',
  logo: '',
  logo_text: 'TA',
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
  promo_strip: ['🚚 Free delivery in Harare on orders over $100', '🔒 Secure offline payment verification', '📱 WhatsApp order tracking', '🏭 FIFO warehouse processing'],
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: DEFAULT_PRODUCTS,
      banners: DEFAULT_BANNERS,
      settings: DEFAULT_SETTINGS,

      addProduct: (p) => set(s => ({
        products: [...s.products, { ...p, id: Date.now(), created_at: new Date().toISOString() }]
      })),
      updateProduct: (id, updates) => set(s => ({
        products: s.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set(s => ({ products: s.products.filter(p => p.id !== id) })),

      addBanner: (b) => set(s => ({
        banners: [...s.banners, { ...b, id: Date.now(), sort_order: s.banners.length + 1 }]
      })),
      updateBanner: (id, updates) => set(s => ({
        banners: s.banners.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBanner: (id) => set(s => ({ banners: s.banners.filter(b => b.id !== id) })),
      reorderBanners: (banners) => set({ banners }),

      updateSettings: (updates) => set(s => ({ settings: { ...s.settings, ...updates } })),
    }),
    { name: 'ta-admin-store' }
  )
)
