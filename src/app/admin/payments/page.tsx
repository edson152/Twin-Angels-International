'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

const MOCK_PAYMENTS = [
  { id: 1, order_number: 'TA-00047', customer: 'John Moyo', phone: '+263 77 123 4567', method: 'EcoCash', amount: 85, currency: 'USD', reference: 'ECO2024011512345', submitted_at: '2024-01-15T08:35:00', status: 'pending' },
  { id: 2, order_number: 'TA-00046', customer: 'Sarah Ndlovu', phone: '+263 71 987 6543', method: 'Bank Transfer', amount: 420, currency: 'USD', reference: 'ZB-TXN-20240115-9987', submitted_at: '2024-01-15T07:50:00', status: 'pending' },
  { id: 3, order_number: 'TA-00044', customer: 'Grace Mutasa', phone: '+263 77 222 3344', method: 'Visa/Mastercard', amount: 1200, currency: 'USD', reference: 'CARD-XXXX-1234', submitted_at: '2024-01-14T16:25:00', status: 'verified' },
  { id: 4, order_number: 'TA-00042', customer: 'Peter Dube', phone: '+263 73 111 2233', method: 'OneMoney', amount: 22400, currency: 'ZIG', reference: 'OM20240114-77821', submitted_at: '2024-01-14T12:10:00', status: 'rejected' },
]

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')

  const displayed = activeTab === 'pending' ? payments.filter(p => p.status === 'pending') : payments

  const handleVerify = (id: number) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'verified' } : p))
    toast.success('Payment verified! Customer notified via WhatsApp.')
  }

  const handleReject = (id: number) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
    toast.error('Payment rejected. Customer will be notified.')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">          <h1 className="font-bold">Payment Verification</h1>
        </div>
        <span className="bg-yellow-900/40 border border-yellow-700/50 text-yellow-400 text-xs px-3 py-1 rounded-full font-semibold">
          {payments.filter(p => p.status === 'pending').length} pending
        </span>
      </div>

      <div className="p-6">
        {/* Info box */}
        <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-4 mb-6 text-sm text-blue-300">
          <strong>📋 Offline Payment Process:</strong> Customers submit payment references after completing EcoCash, Bank Transfer, or other offline payments. Verify the reference against your payment records before confirming.
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-ta-gold text-white' : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'}`}
            >
              {tab === 'pending' ? `Pending (${payments.filter(p => p.status === 'pending').length})` : 'All Payments'}
            </button>
          ))}
        </div>

        {/* Payment cards */}
        <div className="space-y-4">
          {displayed.map(payment => (
            <div key={payment.id} className={`bg-gray-900 border rounded-xl p-5 ${payment.status === 'pending' ? 'border-yellow-700/40' : payment.status === 'verified' ? 'border-green-700/30' : 'border-red-700/30'}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-ta-gold font-mono font-bold text-lg">{payment.order_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${
                      payment.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50' :
                      payment.status === 'verified' ? 'bg-green-900/30 text-green-400 border-green-700/50' :
                      'bg-red-900/30 text-red-400 border-red-700/50'
                    }`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Customer</p>
                      <p className="text-gray-200 font-medium">{payment.customer}</p>
                      <p className="text-gray-500 text-xs">{payment.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Payment Method</p>
                      <p className="text-gray-200 font-medium">{payment.method}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Amount</p>
                      <p className="text-ta-gold font-bold font-mono">{payment.currency === 'USD' ? '$' : 'ZiG'}{payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Submitted</p>
                      <p className="text-gray-400 text-xs">{new Date(payment.submitted_at).toLocaleString('en-ZW', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">Payment Reference</p>
                    <p className="text-white font-mono font-bold tracking-wider">{payment.reference}</p>
                  </div>
                </div>

                {payment.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(payment.id)}
                      className="bg-green-900/30 hover:bg-green-900/60 border border-green-700/50 text-green-400 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      ✅ Verify Payment
                    </button>
                    <button
                      onClick={() => handleReject(payment.id)}
                      className="bg-red-900/30 hover:bg-red-900/60 border border-red-700/50 text-red-400 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      ❌ Reject
                    </button>
                    <a
                      href={`https://wa.me/${payment.phone.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-800/20 hover:bg-green-800/40 border border-green-800/40 text-green-500 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors text-center"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {displayed.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <div className="text-4xl mb-3">✅</div>
              <p>No pending payments to verify.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
