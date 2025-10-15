import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-neutral-900">Waitlist Platform</div>
          <div className="flex gap-4">
            <button className="text-neutral-700 hover:text-neutral-900">Profile</button>
            <button className="text-neutral-700 hover:text-neutral-900">Logout</button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-neutral-200 p-6">
          <nav className="space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${isActive('/') ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/waitlists"
              className={`block px-4 py-2 rounded-lg ${isActive('/waitlists') ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
            >
              Waitlists
            </Link>
            <Link
              to="/subscribers"
              className={`block px-4 py-2 rounded-lg ${isActive('/subscribers') ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
            >
              Subscribers
            </Link>
            <Link
              to="/settings"
              className={`block px-4 py-2 rounded-lg ${isActive('/settings') ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
            >
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
