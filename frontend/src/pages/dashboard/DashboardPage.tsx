import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const navigate = useNavigate()

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
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Waitlists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {waitlists.map((waitlist) => (
            <Card key={waitlist.name}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <div className="font-medium">{waitlist.name}</div>
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="secondary">{waitlist.subscribers}</Badge> subscribers
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
    </div>
  )
}
