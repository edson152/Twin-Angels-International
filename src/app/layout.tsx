import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import '../styles/globals.css'

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
  title: {
    default: 'Twin Angels International Development',
    template: '%s | Twin Angels International',
  },
  description:
    "Zimbabwe's premier online marketplace for building materials, fabric rolls, printing machines, office & house furniture.",
  keywords: [
    'zimbabwe ecommerce',
    'building materials harare',
    'online shopping zimbabwe',
    'twin angels',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_ZW',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Twin Angels International',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="font-body antialiased bg-ta-cream min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-dm-sans)',
              background: '#1F2937',
              color: '#F8F5F0',
              border: '1px solid #C8A96B',
            },
            success: { iconTheme: { primary: '#C8A96B', secondary: '#1F2937' } },
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
