import { HashRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LoadingScreen from './features/console/LoadingScreen'
import AppLayout from './components/layout/AppLayout'

const SwarmDashboard = lazy(() => import('./features/dashboard/SwarmDashboard'))
const AgentChatPage = lazy(() => import('./features/chat/AgentChatPage'))
const AgentRosterPage = lazy(() => import('./features/roster/AgentRosterPage'))
const SwarmWorkflowsPage = lazy(() => import('./features/workflows/SwarmWorkflowsPage'))
const AgentStudioPage = lazy(() => import('./features/studio/AgentStudioPage'))
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'))

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingScreen />}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<SwarmDashboard />} />
            <Route path="/chat" element={<AgentChatPage />} />
            <Route path="/roster" element={<AgentRosterPage />} />
            <Route path="/workflows" element={<SwarmWorkflowsPage />} />
            <Route path="/studio" element={<AgentStudioPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </Suspense>
    </HashRouter>
  )
}