import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import ToastProvider from '@/components/ui/ToastProvider'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Twin Angels International Development',
    template: '%s | Twin Angels International',
  },
  description: "Zimbabwe's premier online marketplace for building materials, fabric rolls, printing machines, office & house furniture.",
  keywords: ['zimbabwe ecommerce', 'building materials harare', 'online shopping zimbabwe', 'twin angels'],
  openGraph: {
    type: 'website',
    locale: 'en_ZW',
    siteName: 'Twin Angels International',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="font-body antialiased bg-ta-cream min-h-screen">
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
