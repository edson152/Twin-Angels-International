/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ta-dark-grey': '#4B5563',
        'ta-cream': '#F8F5F0',
        'ta-dark': '#1F2937',
        'ta-gold': '#C8A96B',
        'ta-gold-light': '#D4B97E',
        'ta-gold-dark': '#A88A52',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,169,107,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200,169,107,0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C8A96B 0%, #D4B97E 50%, #A88A52 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
      },
    },
  },
  plugins: [],
}
