import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/i, 'Invalid color format'),
  logo: z.any().optional()
})

type FormData = z.infer<typeof formSchema>

export default function CreateWaitlistPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
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
        <h1 className="text-2xl font-bold text-neutral-900">Create New Waitlist</h1>
        <p className="text-neutral-600 mt-1">Step 1 of 2: Basic Information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Project Name *
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.name && <p className="text-error-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.description && <p className="text-error-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Branding</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  {...register('primaryColor')}
                  type="color"
                  className="h-10 w-20 border border-neutral-300 rounded-lg"
                />
                <input
                  {...register('primaryColor')}
                  type="text"
                  placeholder="#3b82f6"
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.primaryColor && <p className="text-error-500 text-sm mt-1">{errors.primaryColor.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Logo
              </label>
              <input
                {...register('logo')}
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/waitlists')}
            className="px-6 py-2 border border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Next: Preview →
          </button>
        </div>
      </form>
    </div>
  )
}
