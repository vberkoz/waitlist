import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/i, 'Invalid color format'),
  logo: z.any().optional()
})

type FormData = z.infer<typeof formSchema>

export default function CreateWaitlistPage() {
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Product Launch 2024',
      description: 'Be the first to know when we launch our revolutionary new product. Join our waitlist and get exclusive early access.',
      primaryColor: '#3b82f6'
    }
  })

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data)
    navigate('/waitlists/preview')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Waitlist</h1>
        <p className="text-muted-foreground mt-1">Step 1 of 2: Basic Information</p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Button type="submit">
                  Next: Preview →
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
