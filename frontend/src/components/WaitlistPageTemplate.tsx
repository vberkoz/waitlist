import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const emailSchema = z.object({
  email: z.string().email('Invalid email address')
})

type EmailFormData = z.infer<typeof emailSchema>

interface WaitlistPageTemplateProps {
  logo?: string
  title: string
  description: string
  primaryColor?: string
  subscriberCount?: number
  onSubmit: (email: string) => Promise<void>
}

export default function WaitlistPageTemplate({
  logo,
  title,
  description,
  subscriberCount = 0,
  onSubmit
}: WaitlistPageTemplateProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema)
  })

  const handleFormSubmit = async (data: EmailFormData) => {
    await onSubmit(data.email)
    reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {logo && (
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
        )}

        <h1 className="text-4xl font-bold">{title}</h1>

        <p className="text-lg text-muted-foreground">{description}</p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="h-12"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-12 px-8">
              Join
            </Button>
          </div>
        </form>

        {subscriberCount > 0 && (
          <p className="text-muted-foreground">
            ✓ <Badge variant="secondary">{subscriberCount.toLocaleString()}</Badge> people already joined
          </p>
        )}
      </div>
    </div>
  )
}
