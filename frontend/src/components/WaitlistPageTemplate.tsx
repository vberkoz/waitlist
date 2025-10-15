import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
  primaryColor = '#3b82f6',
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {logo && (
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
        )}

        <h1 className="text-4xl font-bold text-neutral-900">{title}</h1>

        <p className="text-lg text-neutral-700">{description}</p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="flex-1">
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              />
              {errors.email && (
                <p className="text-error-500 text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              Join
            </button>
          </div>
        </form>

        {subscriberCount > 0 && (
          <p className="text-neutral-600">
            ✓ {subscriberCount.toLocaleString()} people already joined
          </p>
        )}
      </div>
    </div>
  )
}
