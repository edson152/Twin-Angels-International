import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price_usd: number
  price_zig: number
  quantity: number
  image: string
  stock: number
  slug: string
}

interface CartStore {
  items: CartItem[]
  currency: 'USD' | 'ZIG'
  setCurrency: (c: 'USD' | 'ZIG') => void
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'USD',

      setCurrency: (currency) => set({ currency }),

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => {
        const { items, currency } = get()
        return items.reduce((sum, i) => {
          const price = currency === 'USD' ? i.price_usd : i.price_zig
          return sum + price * i.quantity
        }, 0)
      },
    }),
    { name: 'ta-cart' }
  )
)
