'use client'
import dynamic from 'next/dynamic'
import Navbar from './Navbar'
import Footer from './Footer'

// These use localStorage/Zustand — must be client-only to avoid hydration mismatch
const FloatingWhatsApp = dynamic(() => import('@/components/ui/FloatingWhatsApp'), { ssr: false })
const FloatingSocial = dynamic(() => import('@/components/ui/FloatingSocial'), { ssr: false })

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingSocial />
    </div>
  )
}
