import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import WaitlistPageTemplate from '../../components/WaitlistPageTemplate'

export default function PreviewPublishPage() {
  const navigate = useNavigate()
  const [hostingOption, setHostingOption] = useState<'cdn' | 'export'>('cdn')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  const handlePublish = () => {
    console.log('Publishing with hosting option:', hostingOption)
    toast.success('Waitlist published successfully!')
    navigate('/waitlists')
  }

  const handleSubmit = async (email: string) => {
    console.log('Preview email:', email)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Waitlist</h1>
        <p className="text-muted-foreground mt-1">Step 2 of 2: Preview & Publish</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Preview</CardTitle>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'desktop' | 'mobile')}>
              <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
              <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`border rounded-lg overflow-hidden ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
            <div style={{ transform: viewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)', transformOrigin: 'top' }}>
              <WaitlistPageTemplate
                title="Product Launch 2024"
                description="Join our waitlist to be the first to know when we launch"
                subscriberCount={0}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Hosting Options:</h3>
            <RadioGroup value={hostingOption} onValueChange={(value) => setHostingOption(value as 'cdn' | 'export')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cdn" id="cdn" />
                <Label htmlFor="cdn">Platform Hosting (CDN)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="export" id="export" />
                <Label htmlFor="export">Export Static Files</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate('/waitlists/create')}>
              ← Back
            </Button>
            <Button onClick={handlePublish}>
              Publish ✓
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
