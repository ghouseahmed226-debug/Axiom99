import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'

export default function SwarmDashboard() {
  const navigate = useNavigate()
  const { agents, logs, totalOpsCount, selectAgent, selectDivision, workflows, runWorkflow } = useAgentStore()

  const activeCount = agents.filter((a) => a.status === 'active').length
  const customCount = agents.filter((a) => a.isCustom).length

  const handleLaunchAgentChat = (agentId: string) => {
    selectAgent(agentId)
    navigate('/chat')
  }

  const handleViewDivision = (divId: any) => {
    selectDivision(divId)
    navigate('/roster')
  }

  return (
    <div className="space-y-6">
      {/* HERO METRICS BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0d1627] via-[#101b33] to-[#0d1627] p-6 shadow-2xl shadow-cyan-950/40">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              SWARM INTELLIGENCE MESH // V2.4
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono">
              99-Agent Autonomous Swarm Command
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Coordinated multi-agent intelligence network divided into 9 specialized task forces executing systems optimization, reasoning pipelines, and real-time operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition"
            >
              <span>💬</span>
              <span>Open Swarm Chat</span>
            </button>
            <button
              onClick={() => navigate('/studio')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <span>🛠️</span>
              <span>Deploy Custom Agent</span>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-slate-800 bg-[#080d18]/80 p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Active Nodes</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{activeCount} / {agents.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">● 100% Online</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#080d18]/80 p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Divisions</div>
            <div className="text-xl font-bold font-mono text-indigo-400 mt-1">9 Squads</div>
            <div className="text-[10px] text-slate-400 mt-0.5">11 Agents / Div</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#080d18]/80 p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Total Ops</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{totalOpsCount.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+42 ops/min</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#080d18]/80 p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Mean Latency</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">48 ms</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Sub-60ms Edge</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#080d18]/80 p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Consensus Rate</div>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">99.8%</div>
            <div className="text-[10px] text-purple-400 mt-0.5">Zero Hallucinations</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#080d18]/80 p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Custom Agents</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">{customCount} Deployed</div>
            <div className="text-[10px] text-rose-400 mt-0.5">User Configured</div>
          </div>
        </div>
      </div>

      {/* 9 DIVISIONS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-mono text-white tracking-wider">
              ❖ 9-DIVISION OPERATIONAL MATRIX
            </h3>
            <p className="text-xs text-slate-400">Click any division to inspect and interact with assigned operative agents.</p>
          </div>
          <button
            onClick={() => navigate('/roster')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
          >
            View All 99 Agents →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENT_DIVISIONS.map((div) => {
            const divAgents = agents.filter((a) => a.divisionId === div.id)
            return (
              <div
                key={div.id}
                onClick={() => handleViewDivision(div.id)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-[#0f1422]/90 p-5 hover:border-cyan-500/50 hover:bg-[#12192c] transition-all duration-200 shadow-md hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                      {div.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          {div.code}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          ({divAgents.length} Agents)
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition">
                        {div.name}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {div.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px]">
                  <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Operational
                  </span>
                  <span className="font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                    Inspect Squad →
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BOTTOM DUAL SECTION: FEATURED AGENTS & TELEMETRY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KEY AGENTS READY FOR DISPATCH */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold font-mono text-white tracking-wider flex items-center gap-2">
              <span className="text-cyan-400">⚡</span> DIRECT AGENT DISPATCH
            </h3>
            <span className="text-xs text-slate-400 font-mono">Instant 1-Click Interactive Session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agents
              .filter((a) => ['agent-99', 'agent-1', 'agent-67', 'agent-34', 'agent-45', 'agent-88'].includes(a.id))
              .map((agent) => (
                <div
                  key={agent.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0f1422] p-4 hover:border-cyan-500/40 hover:bg-[#12192a] transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-lg bg-slate-800 border border-slate-700/60">
                      {agent.avatarIcon}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          {agent.code}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {agent.successRate}% Success
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 truncate">
                        {agent.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {agent.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {agent.model}
                    </span>
                    <button
                      onClick={() => handleLaunchAgentChat(agent.id)}
                      className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition"
                    >
                      Converse →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* REAL-TIME TELEMETRY LOGS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold font-mono text-white tracking-wider flex items-center gap-2">
              <span className="text-emerald-400">📡</span> LIVE SWARM TELEMETRY
            </h3>
            <span className="text-xs text-emerald-400 font-mono animate-pulse">STREAMING</span>
          </div>

          <div className="h-[360px] overflow-y-auto rounded-xl border border-slate-800 bg-[#080d18] p-3 space-y-2 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-8">No telemetry events logged yet.</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-slate-800/60 bg-slate-900/50 p-2.5 space-y-1 transition hover:border-slate-700"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        log.level === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : log.level === 'exec'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : log.level === 'warn'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      [{log.agentCode}] {log.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug break-words">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
