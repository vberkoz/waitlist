import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <div className="flex gap-6">
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">Dashboard</Link>
            <Link to="/waitlists" className="text-primary-600 hover:text-primary-700 font-medium">Waitlists</Link>
            <Link to="/subscribers" className="text-primary-600 hover:text-primary-700 font-medium">Subscribers</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto p-8">
        <Outlet />
      </div>
    </div>
  )
}
