import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import WaitlistsPage from '@/pages/waitlists/WaitlistsPage'
import SubscribersPage from '@/pages/subscribers/SubscribersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/waitlists', element: <WaitlistsPage /> },
      { path: '/subscribers', element: <SubscribersPage /> }
    ]
  }
])
