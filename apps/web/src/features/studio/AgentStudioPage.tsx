import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'
import { AgentDivisionId } from '../../types/agent'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'

export default function AgentStudioPage() {
  const navigate = useNavigate()
  const { customAgents, createCustomAgent, deleteCustomAgent, selectAgent } =
    useAgentStore()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [divisionId, setDivisionId] = useState<AgentDivisionId>('div-6')
  const [specialty, setSpecialty] = useState('')
  const [description, setDescription] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [avatarIcon, setAvatarIcon] = useState('🤖')
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState('Gemini 1.5 Pro')
  const [capabilitiesStr, setCapabilitiesStr] = useState(
    'Task Automation, Logic Synthesis, Custom Telemetry'
  )
  const [successNotice, setSuccessNotice] = useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !role.trim() || !systemPrompt.trim()) return

    const caps = capabilitiesStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    const created = createCustomAgent({
      code: 'CX',
      name,
      divisionId,
      role,
      specialty: specialty || 'Autonomous specialized workflow',
      description: description || `Custom autonomous agent created for ${role}`,
      systemPrompt,
      avatarIcon,
      status: 'active',
      temperature,
      model,
      capabilities: caps.length > 0 ? caps : ['Custom Execution', 'Swarm Link'],
    })

    setSuccessNotice(true)
    setTimeout(() => setSuccessNotice(false), 3500)

    // Reset form
    setName('')
    setRole('')
    setSpecialty('')
    setDescription('')
    setSystemPrompt('')
  }

  const handleLaunchChat = (agentId: string) => {
    selectAgent(agentId)
    navigate('/chat')
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#140e2b] via-[#1b143a] to-[#140e2b] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-purple-500/20 border border-purple-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-purple-300">
              AGENT ARCHITECTURE STUDIO //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Custom AI Agent Builder & Deployer
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Create, customize directives, bind LLM models, and seamlessly deploy new autonomous agents directly into the 99-agent swarm hierarchy.
            </p>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>Custom Agent deployed successfully into the Axiom99 swarm hierarchy!</span>
        </div>
      )}

      {/* DUAL COLUMN: BUILDER FORM & CUSTOM AGENTS ROSTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BUILDER FORM */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-5">
          <h3 className="text-md font-bold font-mono text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-cyan-400">🛠️</span> CONFIGURE OPERATIVE PARAMETERS
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Agent Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quantum Code Reviewer"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Role / Job Title *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Refactoring Lead"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Assign Division</label>
                <select
                  value={divisionId}
                  onChange={(e) => setDivisionId(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  {AGENT_DIVISIONS.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.code} - {div.name}
                    </option>
                  ))}
                  <option value="custom">Custom Squad</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Model Engine</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="Local / Ollama Llama-3">Local / Ollama Llama-3</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Avatar Icon</label>
                <select
                  value={avatarIcon}
                  onChange={(e) => setAvatarIcon(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="🤖">🤖 Robot</option>
                  <option value="⚡">⚡ Lightning</option>
                  <option value="🧠">🧠 Brain</option>
                  <option value="🛡️">🛡️ Shield</option>
                  <option value="📡">📡 Antenna</option>
                  <option value="🧬">🧬 DNA</option>
                  <option value="🚀">🚀 Rocket</option>
                  <option value="💎">💎 Diamond</option>
                  <option value="🔮">🔮 Crystal</option>
                  <option value="👑">👑 Crown</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Domain Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Automated AST transformation and memory leak isolation"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">System Directives & Persona Prompt *</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are an autonomous operative specialized in... Always provide structured markdown with code examples..."
                rows={4}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Capabilities (Comma Separated)</label>
              <input
                type="text"
                value={capabilitiesStr}
                onChange={(e) => setCapabilitiesStr(e.target.value)}
                placeholder="e.g. AST Parse, Profiling, Benchmarks"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Temperature (Creativity vs Determinism)</span>
                <span className="text-cyan-400 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-cyan-500 transition"
            >
              Deploy Agent to Swarm Roster 🚀
            </button>
          </form>
        </div>

        {/* CUSTOM AGENTS ROSTER LIST */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold font-mono text-white tracking-wider flex items-center gap-2">
              <span className="text-purple-400">👑</span> CUSTOM SWARM OPERATIVES
            </h3>
            <span className="text-xs font-mono text-slate-400">
              ({customAgents.length} Active)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {customAgents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-2">
                <span className="text-3xl">🧩</span>
                <p className="text-xs">No custom agents deployed yet.</p>
                <p className="text-[11px] text-slate-600 max-w-xs">
                  Fill out the parameters on the left to deploy your first custom swarm agent.
                </p>
              </div>
            ) : (
              customAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 hover:border-purple-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {agent.avatarIcon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-purple-400">
                            {agent.code}
                          </span>
                          <h4 className="font-bold text-xs text-white">
                            {agent.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {agent.role}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCustomAgent(agent.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs transition"
                      title="Decommission Agent"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {agent.systemPrompt}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] font-mono text-slate-400">
                    <span>Model: {agent.model}</span>
                    <button
                      onClick={() => handleLaunchChat(agent.id)}
                      className="rounded bg-purple-500/20 border border-purple-500/40 px-2.5 py-1 font-semibold text-purple-300 hover:bg-purple-500/30 transition"
                    >
                      Converse →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
