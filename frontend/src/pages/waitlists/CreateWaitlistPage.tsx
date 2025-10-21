import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateWaitlist } from '@/features/waitlists/hooks/useWaitlists'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/i, 'Invalid color format'),
  logo: z.any().optional()
})

type FormData = z.infer<typeof formSchema>

export default function CreateWaitlistPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Product Launch 2024',
      description: 'Be the first to know when we launch our revolutionary new product. Join our waitlist and get exclusive early access.',
      primaryColor: '#3b82f6'
    }
  })

  const createMutation = useCreateWaitlist()

  const handleNext = async () => {
    const isValid = await form.trigger()
    if (isValid) setStep(2)
  }

  const generateStaticHTML = (data: FormData): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { max-width: 600px; width: 100%; background: white; border-radius: 12px; padding: 48px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { width: 64px; height: 64px; background: ${data.primaryColor}; border-radius: 50%; margin: 0 auto 24px; }
    h1 { font-size: 36px; font-weight: bold; color: ${data.primaryColor}; margin-bottom: 16px; }
    p { color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 32px; }
    .form { display: flex; flex-direction: column; gap: 12px; }
    input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; }
    input:focus { outline: none; border-color: ${data.primaryColor}; box-shadow: 0 0 0 3px ${data.primaryColor}20; }
    button { width: 100%; padding: 12px 16px; background: ${data.primaryColor}; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .success { display: none; color: #10b981; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"></div>
    <h1>${data.name}</h1>
    <p>${data.description}</p>
    <form class="form" onsubmit="handleSubmit(event)">
      <input type="email" id="email" placeholder="Enter your email" required />
      <button type="submit">Join Waitlist</button>
    </form>
    <div class="success" id="success">✓ Thank you for joining!</div>
  </div>
  <script>
    function handleSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      // Add your API endpoint here
      console.log('Email submitted:', email);
      document.getElementById('success').style.display = 'block';
      e.target.reset();
    }
  </script>
</body>
</html>`
  }

  const downloadStaticHTML = () => {
    const data = form.getValues()
    const html = generateStaticHTML(data)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.name.toLowerCase().replace(/\s+/g, '-')}-waitlist.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Waitlist page downloaded successfully!')
  }

  const onSubmit = (data: FormData) => {
    if (hostingOption === 'export') {
      downloadStaticHTML()
      return
    }
    createMutation.mutate(data, {
      onSuccess: (response) => {
        const url = response.waitlist.publicUrl
        setPublishedUrl(url)
        toast.success('Waitlist published successfully!')
      },
      onError: (error: any) => {
        const message = error?.response?.data?.error || 'Failed to create waitlist'
        toast.error(message)
        console.error('Create waitlist error:', error)
      }
    })
  }

  const formValues = form.watch()
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [hostingOption, setHostingOption] = useState<'cdn' | 'export'>('cdn')
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Waitlist</h1>
        <p className="text-muted-foreground mt-1">Step {step} of 2: {step === 1 ? 'Basic Information' : 'Preview & Publish'}</p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <Form {...form}>
            {step === 1 ? (
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Branding</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="#3b82f6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Input {...field} type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/waitlists')}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next: Preview
                </Button>
              </div>
            </form>
            ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Preview</h3>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant={previewMode === 'desktop' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      Desktop
                    </Button>
                    <Button 
                      type="button" 
                      variant={previewMode === 'mobile' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-8 bg-neutral-50 flex justify-center">
                  <div 
                    className="bg-white rounded-lg shadow-sm p-8 text-center space-y-6" 
                    style={{ width: previewMode === 'desktop' ? '600px' : '375px' }}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full" style={{ backgroundColor: formValues.primaryColor }} />
                    <h2 className="text-3xl font-bold" style={{ color: formValues.primaryColor }}>{formValues.name}</h2>
                    <p className="text-neutral-600">{formValues.description}</p>
                    <div className="space-y-3">
                      <Input placeholder="Enter your email" type="email" disabled />
                      <Button className="w-full" style={{ backgroundColor: formValues.primaryColor }}>→</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Hosting Options:</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={hostingOption === 'cdn'} 
                      onChange={() => setHostingOption('cdn')}
                    />
                    <span>Platform Hosting (CDN)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={hostingOption === 'export'} 
                      onChange={() => setHostingOption('export')}
                    />
                    <span>Export Static Files</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={createMutation.isPending}>
                  {hostingOption === 'export' ? 'Download' : (createMutation.isPending ? 'Publishing...' : 'Publish ✓')}
                </Button>
              </div>
            </div>
            )}
          </Form>
        </CardContent>
      </Card>

      {publishedUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-bold">Waitlist Published! 🎉</h2>
              <p className="text-sm text-muted-foreground">Your waitlist is now live at:</p>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline break-all">
                  {publishedUrl}
                </a>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(publishedUrl)
                    toast.success('URL copied to clipboard!')
                  }}
                >
                  Copy URL
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => navigate('/waitlists')}
                >
                  View All Waitlists
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
