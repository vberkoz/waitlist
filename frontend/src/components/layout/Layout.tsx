import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useState, useEffect } from 'react'
import { Home, Users, Settings, List } from 'lucide-react'
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const menuItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Waitlists', url: '/waitlists', icon: List },
    { title: 'Subscribers', url: '/subscribers', icon: Users },
    { title: 'Settings', url: '/settings', icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="text-lg font-bold">Waitlist Platform</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{user?.email || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { logout(); navigate('/login') }}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="bg-background border-b px-4 py-3 flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <Button
              variant="outline"
              className="text-sm text-muted-foreground ml-auto"
              onClick={() => setOpen(true)}
            >
              Search... <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">⌘K</kbd>
            </Button>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { window.location.href = '/'; setOpen(false) }}>
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => { window.location.href = '/waitlists'; setOpen(false) }}>
              Waitlists
            </CommandItem>
            <CommandItem onSelect={() => { window.location.href = '/subscribers'; setOpen(false) }}>
              Subscribers
            </CommandItem>
            <CommandItem onSelect={() => { window.location.href = '/settings'; setOpen(false) }}>
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { window.location.href = '/waitlists/create'; setOpen(false) }}>
              Create New Waitlist
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  )
}
