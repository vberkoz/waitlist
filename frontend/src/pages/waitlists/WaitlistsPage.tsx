import { Link } from 'react-router-dom'

export default function WaitlistsPage() {
  const waitlists = [
    { id: 1, name: 'Product Launch 2024', subscribers: 234, createdAt: '2024-01-15' },
    { id: 2, name: 'Beta Program', subscribers: 89, createdAt: '2024-01-10' },
    { id: 3, name: 'Early Access Campaign', subscribers: 156, createdAt: '2024-01-08' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Waitlists</h1>
        <Link
          to="/waitlists/create"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          + Create New Waitlist
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-200 font-medium text-neutral-700">
          <div>Name</div>
          <div>Subscribers</div>
          <div>Created</div>
          <div>Actions</div>
        </div>
        {waitlists.map((waitlist) => (
          <div key={waitlist.id} className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-200 last:border-b-0 items-center">
            <div className="font-medium text-neutral-900">{waitlist.name}</div>
            <div className="text-neutral-700">{waitlist.subscribers}</div>
            <div className="text-neutral-700">{waitlist.createdAt}</div>
            <div className="flex gap-2">
              <button className="px-4 py-1 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">View</button>
              <button className="px-4 py-1 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
