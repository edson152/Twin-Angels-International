import Link from 'next/link'

export default function AdminPage() {
  const stats = [
    { label: 'Total Orders Today', value: '47', icon: '📦', color: 'text-blue-400' },
    { label: 'Pending Payment', value: '8', icon: '💳', color: 'text-yellow-400' },
    { label: 'In Warehouse', value: '12', icon: '🏭', color: 'text-purple-400' },
    { label: "Today's Revenue", value: '$3,842', icon: '💰', color: 'text-green-400' },
  ]

  const quickLinks = [
    { href: '/admin/orders', label: 'Manage Orders', icon: '📋', desc: 'View, process and update all orders' },
    { href: '/admin/products', label: 'Products & Stock', icon: '🛍️', desc: 'Add, edit and manage inventory' },
    { href: '/admin/categories', label: 'Categories', icon: '🗂️', desc: 'Manage product categories' },
    { href: '/admin/banners', label: 'Homepage Banners', icon: '🖼️', desc: 'Control sliding hero banners' },
    { href: '/admin/promotions', label: 'Promotions', icon: '🎯', desc: 'Create sales and discount codes' },
    { href: '/admin/delivery', label: 'Delivery Zones', icon: '🗺️', desc: 'Configure zones and fees' },
    { href: '/admin/payments', label: 'Payment Verification', icon: '✅', desc: 'Confirm offline payments' },
    { href: '/admin/drivers', label: 'Drivers & Vehicles', icon: '🚚', desc: 'Manage dispatch team' },
    { href: '/warehouse', label: 'Warehouse TV', icon: '📺', desc: 'Warehouse operations screen' },
    { href: '/dispatch', label: 'Dispatch TV', icon: '📡', desc: 'Dispatch monitoring screen' },
    { href: '/admin/settings', label: 'Site Settings', icon: '⚙️', desc: 'Colors, footer, social links' },
    { href: '/admin/customers', label: 'Customers', icon: '👥', desc: 'Manage customer accounts' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ta-gold rounded flex items-center justify-center font-bold text-black text-sm">TA</div>
          <span className="font-bold text-lg">Twin Angels Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">← View Store</Link>
          <button className="text-gray-400 hover:text-red-400 text-sm transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Good morning, Admin 👋</h1>
          <p className="text-gray-500 text-sm">Here's what's happening with Twin Angels today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`font-mono font-bold text-2xl ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-ta-gold/40 rounded-lg p-4 transition-all duration-200 group"
            >
              <span className="text-2xl block mb-2">{link.icon}</span>
              <h3 className="font-semibold text-white text-sm group-hover:text-ta-gold transition-colors mb-1">{link.label}</h3>
              <p className="text-gray-500 text-xs line-clamp-2">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders Preview */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-xs font-mono tracking-widest uppercase">Recent Orders</h2>
            <Link href="/admin/orders" className="text-ta-gold text-xs hover:underline">View All →</Link>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Order</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Customer</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Zone</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Total</th>
                  <th className="text-left text-gray-500 px-4 py-3 font-mono text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { num: 'TA-00047', name: 'John Moyo', zone: 'Harare', total: '$85', status: 'pending' },
                  { num: 'TA-00046', name: 'Sarah Ndlovu', zone: 'Bulawayo', total: '$420', status: 'processing' },
                  { num: 'TA-00045', name: 'Mike Choto', zone: 'Harare', total: '$135', status: 'dispatched' },
                ].map(order => (
                  <tr key={order.num} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-ta-gold font-mono font-semibold">{order.num}</td>
                    <td className="px-4 py-3 text-gray-300">{order.name}</td>
                    <td className="px-4 py-3 text-gray-400">{order.zone}</td>
                    <td className="px-4 py-3 text-white font-semibold">{order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        order.status === 'dispatched' ? 'bg-purple-900/50 text-purple-400' :
                        order.status === 'processing' ? 'bg-blue-900/50 text-blue-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
