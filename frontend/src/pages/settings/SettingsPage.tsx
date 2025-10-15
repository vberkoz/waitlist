export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">API Keys</h2>
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <code className="text-sm text-neutral-700">sk_live_••••••••••••••••</code>
                <button className="text-error-500 hover:text-error-600 text-sm font-medium">Revoke</button>
              </div>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
              Generate New Key
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
