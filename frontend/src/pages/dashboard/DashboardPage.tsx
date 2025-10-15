import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type FormData = z.infer<typeof formSchema>

export default function DashboardPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    reset()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-neutral-900">Dashboard</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
          <input
            {...register('name')}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.name && <p className="text-error-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
          <input
            {...register('phone')}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.phone && <p className="text-error-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.message && <p className="text-error-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
