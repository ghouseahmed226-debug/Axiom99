import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'
import { AgentDivisionId } from '../../types/agent'

export default function AgentRosterPage() {
  const navigate = useNavigate()
  const {
    agents,
    selectedDivisionId,
    selectDivision,
    searchQuery,
    setSearchQuery,
    selectAgent,
  } = useAgentStore()

  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
    setSearchQuery(e.target.value)
  }

  const handleLaunchChat = (agentId: string) => {
    selectAgent(agentId)
    navigate('/chat')
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesDiv =
      selectedDivisionId === 'all' || agent.divisionId === selectedDivisionId
    const query = localSearch.toLowerCase()
    const matchesSearch =
      agent.name.toLowerCase().includes(query) ||
      agent.code.toLowerCase().includes(query) ||
      agent.role.toLowerCase().includes(query) ||
      agent.specialty.toLowerCase().includes(query) ||
      agent.capabilities.some((c) => c.toLowerCase().includes(query))
    return matchesDiv && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0d172a] via-[#11213d] to-[#0d172a] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-cyan-300">
              SWARM ROSTER DIRECTORY //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              The 99-Agent Swarm Division Matrix
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Inspect and deploy operatives across all 9 specialized engineering divisions. Each agent maintains distinct cognitive roles and system directives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/studio')}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition"
            >
              + Create Custom Operative
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#0d121f] p-4">
        {/* SEARCH */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by code (A1), name, specialty, capability..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('')
                setSearchQuery('')
              }}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* DIVISION PILLS */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          <button
            onClick={() => selectDivision('all')}
            className={`rounded-lg px-3 py-1.5 font-bold transition ${
              selectedDivisionId === 'all'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Divisions ({agents.length})
          </button>
          {AGENT_DIVISIONS.map((div) => {
            const count = agents.filter((a) => a.divisionId === div.id).length
            return (
              <button
                key={div.id}
                onClick={() => selectDivision(div.id)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                  selectedDivisionId === div.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {div.icon} {div.code} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* AGENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => {
          const divInfo = AGENT_DIVISIONS.find((d) => d.id === agent.divisionId)
          return (
            <div
              key={agent.id}
              className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 flex flex-col justify-between hover:border-cyan-500/40 hover:bg-[#101728] transition duration-200 space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700/80">
                      {agent.avatarIcon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {agent.code}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {divInfo ? divInfo.code : 'CUSTOM'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {agent.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {agent.successRate}% SR
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="text-xs font-semibold text-indigo-300">
                    {agent.role}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {agent.specialty}
                  </p>
                </div>

                {/* CAPABILITY TAGS */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* FOOTER ACTION */}
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 text-[11px]">
                  {agent.model}
                </span>
                <button
                  onClick={() => handleLaunchChat(agent.id)}
                  className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 font-semibold text-cyan-400 hover:bg-cyan-500/20 transition flex items-center gap-1.5"
                >
                  <span>💬</span>
                  <span>Converse</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
