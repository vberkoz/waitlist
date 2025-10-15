export default function WaitlistsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-neutral-900">Waitlists</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary-500 text-white p-6 rounded-lg">Primary</div>
          <div className="bg-secondary-500 text-white p-6 rounded-lg">Secondary</div>
          <div className="bg-success-500 text-white p-6 rounded-lg">Success</div>
          <div className="bg-warning-500 text-white p-6 rounded-lg">Warning</div>
          <div className="bg-error-500 text-white p-6 rounded-lg">Error</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg">Primary</button>
          <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-2 rounded-lg">Secondary</button>
          <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-2 rounded-lg">Outline</button>
          <button className="text-primary-600 hover:bg-primary-50 px-6 py-2 rounded-lg">Ghost</button>
        </div>
      </section>
    </div>
  )
}
