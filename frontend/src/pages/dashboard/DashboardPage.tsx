import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const stats = [
    { label: 'Subs', value: '1,234' },
    { label: 'Active', value: '567' },
    { label: 'Rate', value: '89%' },
    { label: 'Today', value: '45' }
  ]

  const waitlists = [
    { name: 'Product Launch 2024', subscribers: 234 },
    { name: 'Beta Program', subscribers: 89 }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Quick Stats</h2>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-neutral-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Recent Waitlists</h2>
        <div className="space-y-4">
          {waitlists.map((waitlist) => (
            <div key={waitlist.name} className="bg-neutral-50 p-6 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium text-neutral-900">{waitlist.name}</div>
                <div className="text-sm text-neutral-600">{waitlist.subscribers} subscribers</div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100">View</button>
                <button className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/waitlists/create"
        className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
      >
        + Create New Waitlist
      </Link>
    </div>
  )
}
