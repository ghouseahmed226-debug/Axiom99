import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const { agents, totalOpsCount } = useAgentStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastText, setBroadcastText] = useState('')

  const activeAgentsCount = agents.filter((a) => a.status === 'active').length

  const navItems = [
    { path: '/', label: 'Swarm Command', icon: '⚡' },
    { path: '/chat', label: 'Agent Chat', icon: '💬' },
    { path: '/war-room', label: 'War Room Debate', icon: '⚔️' },
    { path: '/neural-mesh', label: '3D Neural Mesh', icon: '🌐' },
    { path: '/builder', label: 'Flow Builder', icon: '🧩' },
    { path: '/workflows', label: 'Workflows', icon: '🔄' },
    { path: '/roster', label: '99-Agent Roster', icon: '👥' },
    { path: '/knowledge', label: 'Knowledge RAG', icon: '🧠' },
    { path: '/studio', label: 'Agent Studio', icon: '🛠️' },
    { path: '/settings', label: 'API & Config', icon: '⚙️' },
  ]

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastText.trim()) return
    useAgentStore.getState().broadcastSwarmMessage(broadcastText)
    setBroadcastText('')
    setBroadcastOpen(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0d14] text-slate-100 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`flex flex-col border-r border-slate-800/80 bg-[#0f1422]/90 backdrop-blur-md transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* LOGO & BRAND */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0d14]">
                <span className="text-xl">👑</span>
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 text-sm">
                  AXIOM 99
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-mono">
                  SWARM OPERATING SYSTEM
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* SWARM STATUS BADGE */}
        {sidebarOpen ? (
          <div className="mx-3 mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase font-mono">
                  Swarm Mesh Online
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                {activeAgentsCount}/{agents.length}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="mt-3 flex-1 space-y-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title={item.label}
              >
                <span className="text-base">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* BROADCAST BUTTON */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => setBroadcastOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-600/25 hover:from-cyan-500 hover:to-indigo-500 transition"
          >
            <span>📢</span>
            {sidebarOpen && <span>Broadcast Directive</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER BAR */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0d121f]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono flex items-center gap-2">
              <span className="text-cyan-400">❖</span>
              {location.pathname === '/' && 'Swarm Operations Command'}
              {location.pathname === '/chat' && 'Multi-Agent Interactive Playground'}
              {location.pathname === '/war-room' && 'Autonomous Multi-Agent War Room'}
              {location.pathname === '/neural-mesh' && '3D Swarm Neural Constellation'}
              {location.pathname === '/builder' && 'Visual Node Flowchart Builder'}
              {location.pathname === '/workflows' && 'Automated Multi-Agent Pipelines'}
              {location.pathname === '/roster' && '99-Agent Swarm Registry & Divisions'}
              {location.pathname === '/knowledge' && 'Agent Memory & Document RAG'}
              {location.pathname === '/studio' && 'Agent Creator & Architecture Studio'}
              {location.pathname === '/settings' && 'System Configuration & Model Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 text-xs font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Ops: {totalOpsCount.toLocaleString()}</span>
            </div>

            <Link
              to="/chat"
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition"
            >
              <span>💬</span>
              <span>Launch Chat</span>
            </Link>
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 overflow-y-auto bg-[#0a0d14] p-6">
          {children}
        </main>
      </div>

      {/* BROADCAST MODAL */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#0f1422] p-6 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-xl">📢</span>
                <h3 className="font-bold uppercase tracking-wider font-mono">
                  Broadcast Directive to 99 Agents
                </h3>
              </div>
              <button
                onClick={() => setBroadcastOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBroadcast} className="mt-4 space-y-4">
              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Enter strategic swarm directive..."
                className="w-full h-32 rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition"
                >
                  Transmit Directive 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
