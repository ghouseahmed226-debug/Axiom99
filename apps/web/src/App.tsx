import { HashRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LoadingScreen from './features/console/LoadingScreen'
import AppLayout from './components/layout/AppLayout'

const SwarmDashboard = lazy(() => import('./features/dashboard/SwarmDashboard'))
const AgentChatPage = lazy(() => import('./features/chat/AgentChatPage'))
const WarRoomPage = lazy(() => import('./features/warroom/WarRoomPage'))
const NeuralMeshPage = lazy(() => import('./features/neural/NeuralMeshPage'))
const WorkflowBuilderPage = lazy(() => import('./features/builder/WorkflowBuilderPage'))
const SwarmAnalyticsPage = lazy(() => import('./features/analytics/SwarmAnalyticsPage'))
const CodebaseArtifactsPage = lazy(() => import('./features/artifacts/CodebaseArtifactsPage'))
const ApiGatewayPage = lazy(() => import('./features/gateway/ApiGatewayPage'))
const SwarmWorkflowsPage = lazy(() => import('./features/workflows/SwarmWorkflowsPage'))
const AgentRosterPage = lazy(() => import('./features/roster/AgentRosterPage'))
const KnowledgeBasePage = lazy(() => import('./features/knowledge/KnowledgeBasePage'))
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
            <Route path="/war-room" element={<WarRoomPage />} />
            <Route path="/neural-mesh" element={<NeuralMeshPage />} />
            <Route path="/builder" element={<WorkflowBuilderPage />} />
            <Route path="/analytics" element={<SwarmAnalyticsPage />} />
            <Route path="/artifacts" element={<CodebaseArtifactsPage />} />
            <Route path="/api-gateway" element={<ApiGatewayPage />} />
            <Route path="/workflows" element={<SwarmWorkflowsPage />} />
            <Route path="/roster" element={<AgentRosterPage />} />
            <Route path="/knowledge" element={<KnowledgeBasePage />} />
            <Route path="/studio" element={<AgentStudioPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </Suspense>
    </HashRouter>
  )
}