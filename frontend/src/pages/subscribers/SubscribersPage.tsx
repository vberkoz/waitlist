export default function SubscribersPage() {
  const subscribers = [
    { id: 1, email: 'user@email.com', date: '2024-01-15' },
    { id: 2, email: 'john@example.com', date: '2024-01-14' },
    { id: 3, email: 'jane@test.com', date: '2024-01-13' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Subscribers - Product Launch 2024</h1>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search"
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50">Filter ▼</button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">Export CSV</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-neutral-200 font-medium text-neutral-700">
          <div>Email</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {subscribers.map((sub) => (
          <div key={sub.id} className="grid grid-cols-3 gap-4 p-4 border-b border-neutral-200 last:border-b-0 items-center">
            <div className="text-neutral-900">{sub.email}</div>
            <div className="text-neutral-700">{sub.date}</div>
            <div>
              <button className="text-error-500 hover:text-error-600 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-neutral-600">
        <div>Showing 1-10 of 234</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50">&lt;</button>
          <button className="px-3 py-1 bg-primary-600 text-white rounded">1</button>
          <button className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50">2</button>
          <button className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50">3</button>
          <button className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50">...</button>
          <button className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50">24</button>
          <button className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50">&gt;</button>
        </div>
      </div>
    </div>
  )
}
