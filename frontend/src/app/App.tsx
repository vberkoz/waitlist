import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster />
    </Providers>
  )
}

export default App
