'use client'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'

export default function ClientProviders() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
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
  )
}
