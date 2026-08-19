// [Agent-19] Main app shell with HashRouter for zero-config static deployments
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy }             from 'react'
import LoadingScreen                  from './features/console/LoadingScreen'

const ConsolePage  = lazy(() => import('./features/console/ConsolePage'))
const LobbyPage    = lazy(() => import('./features/lobby/LobbyPage'))
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'))

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/"         element={<ConsolePage />} />
          <Route path="/lobby"    element={<LobbyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}