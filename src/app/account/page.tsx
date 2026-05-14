import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { FiPackage, FiMapPin, FiUser, FiLock } from 'react-icons/fi'

export default function AccountPage() {
  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-ta-dark mb-8">My Account</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: FiPackage, title: 'My Orders', desc: 'View and track all your orders', href: '/track' },
            { icon: FiMapPin, title: 'Track Order', desc: 'Enter your order number to track delivery', href: '/track' },
            { icon: FiUser, title: 'Profile', desc: 'Update your personal details', href: '#' },
            { icon: FiLock, title: 'Change Password', desc: 'Update your account password', href: '#' },
          ].map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="bg-white border border-gray-100 rounded-sm p-6 flex items-start gap-4 hover:border-ta-gold hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-ta-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-ta-gold/20 transition-colors">
                <Icon size={22} className="text-ta-gold" />
              </div>
              <div>
                <h3 className="font-body font-semibold text-ta-dark mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white border border-gray-100 rounded-sm p-6">
          <h2 className="font-display font-semibold text-ta-dark mb-4">Sign In</h2>
          <p className="text-gray-500 text-sm mb-4">Sign in to view your orders and manage your account.</p>
          <div className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <button className="btn-primary w-full">Sign In</button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-ta-gold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </StoreLayout>
  )
}
