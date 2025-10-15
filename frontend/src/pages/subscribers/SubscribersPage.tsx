import { useUsers, useCreateUser } from '@/features/waitlists/hooks'

export default function SubscribersPage() {
  const { data: users, isLoading, error } = useUsers()
  const createUser = useCreateUser()

  if (isLoading) return <div className="text-neutral-600">Loading...</div>
  if (error) return <div className="text-error-500">Error loading users</div>

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-neutral-900">Subscribers</h1>
      
      <button
        onClick={() => createUser.mutate({ name: 'New User', email: 'new@example.com' })}
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
      >
        Add User
      </button>

      <div className="grid gap-4">
        {users?.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="font-semibold text-neutral-900">{user.name}</h3>
            <p className="text-neutral-600">{user.email}</p>
            <p className="text-neutral-500 text-sm">{user.phone}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
