'use client'
import StoreLayout from '@/components/layout/StoreLayout'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Account created! Please sign in.')
        router.push('/account')
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StoreLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-ta-dark rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-ta-gold font-display font-bold text-2xl">TA</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-ta-dark">Create Account</h1>
            <p className="text-gray-500 mt-2 text-sm">Join Twin Angels International</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required
                    className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required
                    className="input-field" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="input-field" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone / WhatsApp</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="input-field" placeholder="+263 7XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required
                  className="input-field" placeholder="At least 6 characters" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm Password *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
                  className="input-field" placeholder="Repeat your password" />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/account" className="text-ta-gold hover:underline font-medium">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
