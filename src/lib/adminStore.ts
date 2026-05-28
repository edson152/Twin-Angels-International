import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  images: string[]
  created_at: string
}

export interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_url: string
  image: string
  is_active: boolean
  sort_order: number
  bg_gradient: string
}

export interface SiteSettings {
  site_name: string
  logo: string
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
  {
    id: 1, name: 'Portland Cement 50kg Bag', slug: 'portland-cement-50kg',
    category: 'Building Materials',
    description: 'High-strength Portland cement ideal for all construction works including bricklaying, plastering, and concrete production. Meets ZABS standards. 50kg per bag.',
    price_usd: 12, price_zig: 840, compare_price_usd: 15, stock: 500,
    is_active: true, is_featured: true, show_on_home: true, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 2, name: 'Executive Leather Office Chair', slug: 'executive-leather-office-chair',
    category: 'Office Furniture',
    description: 'Premium executive leather office chair with adjustable lumbar support, height adjustment, and 360° swivel. Suitable for long working hours. Rated for up to 150kg.',
    price_usd: 185, price_zig: 12950, compare_price_usd: 220, stock: 15,
    is_active: true, is_featured: true, show_on_home: true, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 3, name: 'Cotton Poplin Fabric Roll 60m', slug: 'cotton-poplin-60m',
    category: 'Fabric Rolls',
    description: 'Premium 100% cotton poplin fabric roll. Smooth finish, ideal for shirts, dresses, and uniforms. 60m per roll, 150cm wide. Available in multiple colours — contact us for colour options.',
    price_usd: 85, price_zig: 5950, compare_price_usd: 100, stock: 40,
    is_active: true, is_featured: false, show_on_home: true, is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 4, name: 'Digital Flatbed Printer A3', slug: 'digital-flatbed-printer-a3',
    category: 'Printing Machines',
    description: 'Professional A3 digital flatbed UV printer. Prints on rigid surfaces including wood, glass, acrylic, metal, and leather. Resolution up to 1440 DPI. Includes starter ink set.',
    price_usd: 1200, price_zig: 84000, compare_price_usd: 1450, stock: 5,
    is_active: true, is_featured: true, show_on_home: true, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 5, name: '3-Seater Fabric Sofa', slug: '3-seater-fabric-sofa',
    category: 'House Furniture',
    description: 'Comfortable 3-seater fabric sofa with high-density foam cushions. Solid hardwood frame for durability. Available in grey, beige, and navy. Dimensions: 220cm × 90cm × 85cm.',
    price_usd: 420, price_zig: 29400, compare_price_usd: 500, stock: 10,
    is_active: true, is_featured: false, show_on_home: true, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 6, name: 'Steel Rebar 12mm × 6m', slug: 'steel-rebar-12mm',
    category: 'Building Materials',
    description: 'High tensile deformed steel rebar for reinforced concrete construction. 12mm diameter, 6m length. Grade 60 (420 MPa yield strength). Price per bar.',
    price_usd: 45, price_zig: 3150, compare_price_usd: 52, stock: 300,
    is_active: true, is_featured: false, show_on_home: false, is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 7, name: 'Ceramic Floor Tiles 60×60cm', slug: 'ceramic-floor-tiles-60x60',
    category: 'Building Materials',
    description: 'Premium glazed ceramic floor tiles. 60cm × 60cm per tile, 8mm thick. Anti-slip surface. Frost resistant. Suitable for indoor and covered outdoor areas. Price per square metre (4 tiles).',
    price_usd: 18, price_zig: 1260, compare_price_usd: 22, stock: 800,
    is_active: true, is_featured: false, show_on_home: false, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 8, name: 'Height-Adjustable Standing Desk', slug: 'height-adjustable-standing-desk',
    category: 'Office Furniture',
    description: 'Electric height-adjustable standing desk. Dual motor for smooth lifting. Height range: 70–120cm. Desktop size: 160cm × 80cm. Supports up to 100kg. Memory presets for 4 heights.',
    price_usd: 320, price_zig: 22400, compare_price_usd: 380, stock: 8,
    is_active: true, is_featured: false, show_on_home: false, is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 9, name: 'Polyester Satin Fabric 50m', slug: 'polyester-satin-50m',
    category: 'Fabric Rolls',
    description: 'Smooth, lustrous polyester satin fabric roll. 50m per roll, 150cm wide. Suitable for evening wear, linings, and décor. Multiple colours available on request.',
    price_usd: 65, price_zig: 4550, compare_price_usd: 75, stock: 25,
    is_active: true, is_featured: false, show_on_home: false, is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 10, name: 'Large Format UV Flatbed Printer', slug: 'large-format-uv-printer',
    category: 'Printing Machines',
    description: 'Industrial large format UV flatbed printer. Print area: 2.5m × 1.3m. Suitable for billboards, signage, PVC banners, glass, and aluminium. Speed: up to 30 m²/hour. Includes RIP software.',
    price_usd: 3500, price_zig: 245000, compare_price_usd: 4200, stock: 2,
    is_active: true, is_featured: true, show_on_home: false, is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 11, name: 'Queen Size Bed Frame', slug: 'queen-bed-frame',
    category: 'House Furniture',
    description: 'Solid eucalyptus wood queen size bed frame with upholstered headboard. Slat support system included. Dimensions: 210cm × 165cm × 120cm (H). Fits standard 160cm × 200cm mattress.',
    price_usd: 280, price_zig: 19600, compare_price_usd: 330, stock: 12,
    is_active: true, is_featured: false, show_on_home: false, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: 12, name: 'TV & Entertainment Stand', slug: 'tv-entertainment-stand',
    category: 'House Furniture',
    description: 'Modern TV entertainment stand with cable management and storage. Supports TVs up to 75 inches (max 80kg). Two cabinets with adjustable shelves. Dimensions: 160cm × 45cm × 55cm.',
    price_usd: 150, price_zig: 10500, compare_price_usd: 185, stock: 20,
    is_active: true, is_featured: false, show_on_home: false, is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80'],
    created_at: new Date().toISOString(),
  },
]

const DEFAULT_BANNERS: Banner[] = [
  { id: 1, title: 'Build Your Vision', subtitle: 'Premium Building Materials', description: 'Quality cement, steel, tiles — delivered to your site across Zimbabwe.', cta_text: 'Shop Now', cta_url: '/products?category=building-materials', image: '', is_active: true, sort_order: 1, bg_gradient: 'from-slate-900 via-slate-800 to-slate-700' },
  { id: 2, title: 'Fabric Excellence', subtitle: 'Premium Fabric Rolls', description: 'Extensive range of cotton, polyester and specialty fabrics for fashion and industry.', cta_text: 'Browse Fabrics', cta_url: '/products?category=fabric-rolls', image: '', is_active: true, sort_order: 2, bg_gradient: 'from-amber-900 via-amber-800 to-stone-700' },
  { id: 3, title: 'Outfit Your Office', subtitle: 'Premium Office Furniture', description: 'Ergonomic chairs, desks, and storage solutions at trade prices.', cta_text: 'View Furniture', cta_url: '/products?category=office-furniture', image: '', is_active: true, sort_order: 3, bg_gradient: 'from-zinc-900 via-zinc-800 to-neutral-700' },
]

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Twin Angels International Development',
  logo: '', logo_text: 'TA',
  support_email: 'edsonnyoni92@gmail.com',
  whatsapp_number: '+263XXXXXXXXX',
  primary_color: '#C8A96B',
  dark_color: '#1F2937',
  facebook_url: '', instagram_url: '', twitter_url: '',
  footer_about: "Zimbabwe's premier marketplace for industrial supplies, building materials, quality furniture, fabric rolls, and printing machines.",
  maintenance_mode: false,
  usd_to_zig_rate: '70',
  promo_strip: ['🚚 Free delivery in Harare on orders over $100', '🔒 Secure offline payment verification', '📱 WhatsApp order tracking', '🏭 FIFO warehouse processing'],
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,
      banners: DEFAULT_BANNERS,
      settings: DEFAULT_SETTINGS,
      addProduct: (p) => set(s => ({ products: [...s.products, { ...p, id: Date.now(), created_at: new Date().toISOString() }] })),
      updateProduct: (id, updates) => set(s => ({ products: s.products.map(p => p.id === id ? { ...p, ...updates } : p) })),
      deleteProduct: (id) => set(s => ({ products: s.products.filter(p => p.id !== id) })),
      addBanner: (b) => set(s => ({ banners: [...s.banners, { ...b, id: Date.now(), sort_order: s.banners.length + 1 }] })),
      updateBanner: (id, updates) => set(s => ({ banners: s.banners.map(b => b.id === id ? { ...b, ...updates } : b) })),
      deleteBanner: (id) => set(s => ({ banners: s.banners.filter(b => b.id !== id) })),
      reorderBanners: (banners) => set({ banners }),
      updateSettings: (updates) => set(s => ({ settings: { ...s.settings, ...updates } })),
    }),
    { name: 'ta-admin-store' }
  )
)
