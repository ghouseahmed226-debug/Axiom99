import React from 'react'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'

export default function SwarmAnalyticsPage() {
  const { agents, totalOpsCount, totalTokensEmitted, estimatedComputeCostUsd, isSimulationActive, toggleSimulation } =
    useAgentStore()

  const sortedAgentsByOps = [...agents].sort((a, b) => b.taskCount - a.taskCount).slice(0, 8)

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0d211a] via-[#123126] to-[#0d211a] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-emerald-300">
              OBSERVABILITY & COST INTELLIGENCE //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Swarm Telemetry & Performance Analytics
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Real-time monitoring of token throughput, latency percentiles, compute costs across model providers, and autonomous agent node leaderboards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSimulation}
              className={`rounded-xl px-4 py-2 text-xs font-mono font-semibold transition border ${
                isSimulationActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isSimulationActive ? '● Simulation Active (60Hz)' : '○ Simulation Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Swarm Operations</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">{totalOpsCount.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-mono">↑ 14.8% vs last epoch</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Tokens Emitted</span>
          <div className="text-2xl font-bold font-mono text-indigo-400">{totalTokensEmitted.toLocaleString()}</div>
          <span className="text-[10px] text-indigo-300 font-mono">Mean 184 tok/s</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Estimated Compute Cost</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">${estimatedComputeCostUsd.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500 font-mono">$0.000002 / token avg</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Consensus Rate</span>
          <div className="text-2xl font-bold font-mono text-purple-400">99.82%</div>
          <span className="text-[10px] text-purple-300 font-mono">Zero Hallucinations</span>
        </div>
      </div>

      {/* CHARTS DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DIVISION THROUGHPUT BARS */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider">
              TOKEN THROUGHPUT BY DIVISION (TOKENS / SEC)
            </h3>
            <span className="text-xs font-mono text-emerald-400">LIVE GAUGES</span>
          </div>

          <div className="space-y-3 pt-1">
            {AGENT_DIVISIONS.map((div, i) => {
              const val = 120 + ((i * 37) % 180)
              const pct = (val / 300) * 100
              return (
                <div key={div.id} className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span>{div.icon}</span>
                      <span className="font-bold text-cyan-400">{div.code}</span>
                      <span className="text-slate-400 truncate max-w-xs">{div.name}</span>
                    </span>
                    <span className="text-slate-400">{val} tok/s</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* LATENCY PERCENTILES & COST BREAKDOWN */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider border-b border-slate-800 pb-3">
              LATENCY PERCENTILES (SLA)
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="text-[10px] text-slate-400">p50 MEDIAN</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">28 ms</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="text-[10px] text-slate-400">p95 TAIL</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">64 ms</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="text-[10px] text-slate-400">p99 WORST</div>
                <div className="text-lg font-bold text-amber-400 mt-1">98 ms</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider border-b border-slate-800 pb-3">
              COMPUTE COST BY MODEL PROVIDER
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">Google Gemini 1.5 Pro</span>
                <span className="text-emerald-400 font-bold">$0.62 / 500k tok</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">Claude 3.5 Sonnet</span>
                <span className="text-indigo-400 font-bold">$0.54 / 500k tok</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">OpenAI GPT-4o</span>
                <span className="text-cyan-400 font-bold">$0.32 / 500k tok</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP AGENTS PERFORMANCE LEADERBOARD */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
        <h3 className="text-xs font-bold font-mono text-white tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>OPERATIVE PERFORMANCE LEADERBOARD</span>
          <span className="text-slate-500 font-normal">Ranked by Tasks Executed & Latency</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 text-[11px]">
                <th className="pb-2">RANK</th>
                <th className="pb-2">OPERATIVE</th>
                <th className="pb-2">ROLE</th>
                <th className="pb-2">TASKS EXECUTED</th>
                <th className="pb-2">MEAN LATENCY</th>
                <th className="pb-2">SUCCESS RATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedAgentsByOps.map((ag, idx) => (
                <tr key={ag.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 text-cyan-400 font-bold">#{idx + 1}</td>
                  <td className="py-2.5 font-bold text-white flex items-center gap-2">
                    <span>{ag.avatarIcon}</span>
                    <span>{ag.name} ({ag.code})</span>
                  </td>
                  <td className="py-2.5 text-slate-400">{ag.role}</td>
                  <td className="py-2.5 text-slate-200">{ag.taskCount.toLocaleString()} ops</td>
                  <td className="py-2.5 text-amber-400">{ag.avgLatencyMs} ms</td>
                  <td className="py-2.5 text-emerald-400">{ag.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
