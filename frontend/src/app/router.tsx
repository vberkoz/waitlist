import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import DashboardPage from '../pages/dashboard/DashboardPage'
import WaitlistsPage from '../pages/waitlists/WaitlistsPage'
import SubscribersPage from '../pages/subscribers/SubscribersPage'
import CreateWaitlistPage from '../pages/waitlists/CreateWaitlistPage'
import PreviewPublishPage from '../pages/waitlists/PreviewPublishPage'
import SettingsPage from '../pages/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
