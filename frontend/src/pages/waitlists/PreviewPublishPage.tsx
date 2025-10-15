import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WaitlistPageTemplate from '@/components/WaitlistPageTemplate'

export default function PreviewPublishPage() {
  const navigate = useNavigate()
  const [hostingOption, setHostingOption] = useState<'cdn' | 'export'>('cdn')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  const handlePublish = () => {
    console.log('Publishing with hosting option:', hostingOption)
    alert('Waitlist published successfully!')
    navigate('/waitlists')
  }

  const handleSubmit = async (email: string) => {
    console.log('Preview email:', email)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Create New Waitlist</h1>
        <p className="text-neutral-600 mt-1">Step 2 of 2: Preview & Publish</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-neutral-900">Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'desktop'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'mobile'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Mobile
            </button>
          </div>
        </div>

        <div className={`border border-neutral-300 rounded-lg overflow-hidden ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
          <div className="bg-white" style={{ transform: viewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)', transformOrigin: 'top' }}>
            <WaitlistPageTemplate
              title="Product Launch 2024"
              description="Join our waitlist to be the first to know when we launch"
              subscriberCount={0}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-neutral-200">
          <h3 className="font-medium text-neutral-900">Hosting Options:</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="hosting"
                value="cdn"
                checked={hostingOption === 'cdn'}
                onChange={(e) => setHostingOption(e.target.value as 'cdn')}
                className="w-4 h-4"
              />
              <span className="text-neutral-700">Platform Hosting (CDN)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="hosting"
                value="export"
                checked={hostingOption === 'export'}
                onChange={(e) => setHostingOption(e.target.value as 'export')}
                className="w-4 h-4"
              />
              <span className="text-neutral-700">Export Static Files</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/waitlists/create')}
            className="px-6 py-2 border border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50"
          >
            ← Back
          </button>
          <button
            onClick={handlePublish}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Publish ✓
          </button>
        </div>
      </div>
    </div>
  )
}
