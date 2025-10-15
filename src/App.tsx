import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-neutral-900">Design System</h1>
      
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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">Spacing</h2>
        <div className="space-y-2">
          <div className="bg-primary-200 h-1 w-full"></div>
          <div className="bg-primary-200 h-2 w-full"></div>
          <div className="bg-primary-200 h-4 w-full"></div>
          <div className="bg-primary-200 h-6 w-full"></div>
          <div className="bg-primary-200 h-8 w-full"></div>
        </div>
      </section>
    </div>
  )
}

function Dashboard() {
  return <h1 className="text-4xl font-bold text-neutral-900">Dashboard</h1>
}

function Waitlist() {
  return <h1 className="text-4xl font-bold text-neutral-900">Waitlist</h1>
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <div className="flex gap-6">
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">Home</Link>
              <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">Dashboard</Link>
              <Link to="/waitlist" className="text-primary-600 hover:text-primary-700 font-medium">Waitlist</Link>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/waitlist" element={<Waitlist />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
