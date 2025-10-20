import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import DashboardPage from '../pages/dashboard/DashboardPage'
import WaitlistsPage from '../pages/waitlists/WaitlistsPage'
import SubscribersPage from '../pages/subscribers/SubscribersPage'
import CreateWaitlistPage from '../pages/waitlists/CreateWaitlistPage'
import PreviewPublishPage from '../pages/waitlists/PreviewPublishPage'
import SettingsPage from '../pages/settings/SettingsPage'
import LoginPage from '../pages/auth/LoginPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/waitlists', element: <WaitlistsPage /> },
      { path: '/waitlists/create', element: <CreateWaitlistPage /> },
      { path: '/waitlists/preview', element: <PreviewPublishPage /> },
      { path: '/subscribers', element: <SubscribersPage /> },
      { path: '/settings', element: <SettingsPage /> }
    ]
  }
])
