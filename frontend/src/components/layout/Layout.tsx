import { Outlet, Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Waitlist Platform</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r p-6">
          <nav className="space-y-2">
            <Link to="/">
              <Button variant={isActive('/') ? 'secondary' : 'ghost'} className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link to="/waitlists">
              <Button variant={isActive('/waitlists') ? 'secondary' : 'ghost'} className="w-full justify-start">
                Waitlists
              </Button>
            </Link>
            <Link to="/subscribers">
              <Button variant={isActive('/subscribers') ? 'secondary' : 'ghost'} className="w-full justify-start">
                Subscribers
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant={isActive('/settings') ? 'secondary' : 'ghost'} className="w-full justify-start">
                Settings
              </Button>
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
