import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useState } from 'react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

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
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <Progress value={Math.random() * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0">
                <CardTitle>Recent Waitlists</CardTitle>
                <span className="text-sm">{isOpen ? '−' : '+'}</span>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {waitlists.map((waitlist) => (
                <Card key={waitlist.name}>
                  <CardContent className="pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="font-medium">{waitlist.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <Badge variant="secondary">{waitlist.subscribers}</Badge> subscribers
                      </div>
                      <Progress value={(waitlist.subscribers / 500) * 100} className="w-full md:w-48 h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
    </div>
  )
}
