import React, { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'

export default function WarRoomPage() {
  const { warRoom, isWarRoomDebating, startWarRoomDebate, resetWarRoom, agents } =
    useAgentStore()

  const [topic, setTopic] = useState(warRoom.topic)
  const [objective, setObjective] = useState(warRoom.objective)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    warRoom.participantAgentIds
  )
  const [showAddDelegate, setShowAddDelegate] = useState(false)

  const toggleParticipant = (agentId: string) => {
    if (selectedParticipants.includes(agentId)) {
      if (selectedParticipants.length <= 2) return // keep at least 2
      setSelectedParticipants(selectedParticipants.filter((id) => id !== agentId))
    } else {
      setSelectedParticipants([...selectedParticipants, agentId])
    }
  }

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || isWarRoomDebating) return
    startWarRoomDebate(topic, objective, selectedParticipants)
  }

  const handleExportMarkdown = () => {
    const md =
      `# Axiom99 Autonomous War Room Deliberation Report\n\n` +
      `**Topic:** ${warRoom.topic}\n` +
      `**Objective:** ${warRoom.objective}\n` +
      `**Timestamp:** ${new Date().toISOString()}\n\n` +
      `## Participating Operatives\n` +
      selectedParticipants
        .map((id) => {
          const a = agents.find((ag) => ag.id === id)
          return `- **${a?.name}** (${a?.code}) - *${a?.role}*`
        })
        .join('\n') +
      `\n\n` +
      `## Deliberation Transcripts\n\n` +
      warRoom.messages
        .map(
          (m) =>
            `### [${m.agentCode}] ${m.agentName} (Round ${m.round} - ${m.perspectiveType.toUpperCase()})\n` +
            `*${m.timestamp}*\n\n` +
            `> ${m.content}\n`
        )
        .join('\n') +
      `\n\n` +
      `${warRoom.consensusSummary || ''}`

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `war-room-${Date.now()}.md`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-[#200e16] via-[#2a121e] to-[#200e16] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-rose-300">
              AUTONOMOUS ROUNDTABLE //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Multi-Agent Swarm War Room
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Convene high-stakes group debates where specialized agents critique architectures, evaluate security risks, debate tradeoffs, and establish unanimous swarm consensus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {warRoom.status === 'completed' && (
              <button
                onClick={handleExportMarkdown}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition"
              >
                📄 Export Consensus Report
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONTROLS & DELEGATES */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="text-rose-400">⚔️</span> WAR ROOM DIRECTIVE
            </h3>

            <form onSubmit={handleStart} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Debate Topic *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isWarRoomDebating}
                  className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">Strategic Objective</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  disabled={isWarRoomDebating}
                  rows={3}
                  className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isWarRoomDebating || !topic.trim()}
                  className="w-full rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 transition"
                >
                  {isWarRoomDebating ? 'Deliberation in Progress...' : 'Convene War Room Debate ⚡'}
                </button>
              </div>
            </form>
          </div>

          {/* ACTIVE DELEGATES LIST */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold font-mono text-white">
                Roundtable Delegates ({selectedParticipants.length})
              </h4>
              <button
                onClick={() => setShowAddDelegate(!showAddDelegate)}
                className="text-[11px] font-mono text-rose-400 hover:text-rose-300 transition"
              >
                {showAddDelegate ? 'Done' : '+ Add/Edit'}
              </button>
            </div>

            {showAddDelegate ? (
              <div className="max-h-60 overflow-y-auto space-y-1 divide-y divide-slate-800/40 text-xs">
                {agents.slice(0, 30).map((ag) => {
                  const isChecked = selectedParticipants.includes(ag.id)
                  return (
                    <div
                      key={ag.id}
                      onClick={() => toggleParticipant(ag.id)}
                      className={`p-2 flex items-center justify-between cursor-pointer rounded-lg transition ${
                        isChecked ? 'bg-rose-950/30 text-rose-300' : 'hover:bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{ag.avatarIcon}</span>
                        <span className="font-semibold truncate">{ag.name} ({ag.code})</span>
                      </div>
                      <span>{isChecked ? '✓' : '+'}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {selectedParticipants.map((id) => {
                  const ag = agents.find((a) => a.id === id) || agents[0]
                  return (
                    <div
                      key={ag.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{ag.avatarIcon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-rose-400">
                              {ag.code}
                            </span>
                            <span className="font-bold text-xs text-white">
                              {ag.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {ag.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE DELIBERATION STREAM */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="font-bold text-sm text-white font-mono">
                  LIVE DELIBERATION TRANSCRIPT
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Round {warRoom.currentRound} / {warRoom.maxRounds}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    warRoom.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isWarRoomDebating
                      ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {warRoom.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* TRANSCRIPT THREAD */}
            <div className="flex-1 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4 pr-1">
              {warRoom.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-500 space-y-3">
                  <span className="text-4xl p-3 rounded-2xl bg-slate-800/40 border border-slate-700">⚔️</span>
                  <h4 className="font-bold text-sm text-slate-300">War Room Chamber Standing By</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Configure your topic on the left and click "Convene War Room Debate" to trigger autonomous cross-agent turn-taking.
                  </p>
                </div>
              ) : (
                warRoom.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-slate-800/90 bg-[#101627] p-4 space-y-2 transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1 rounded-lg bg-slate-800 border border-slate-700">
                          {msg.avatarIcon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-rose-400">
                              {msg.agentCode}
                            </span>
                            <span className="font-bold text-xs text-white">
                              {msg.agentName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{msg.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span
                          className={`px-2 py-0.5 rounded uppercase font-bold ${
                            msg.perspectiveType === 'security'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : msg.perspectiveType === 'critique'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : msg.perspectiveType === 'consensus'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {msg.perspectiveType}
                        </span>
                        <span className="text-slate-500">{msg.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans pt-1">
                      {msg.content}
                    </p>
                  </div>
                ))
              )}

              {isWarRoomDebating && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 text-xs font-mono text-rose-400 flex items-center gap-3 animate-pulse">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <span>Delegates are debating cross-domain tradeoffs in autonomous sequence...</span>
                </div>
              )}
            </div>

            {/* FINAL CONSENSUS RESOLUTION CARD */}
            {warRoom.consensusSummary && (
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#0d1e19] to-[#0d1624] p-5 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold">
                  <span>👑</span>
                  <span>RATIFIED SWARM CONSENSUS</span>
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {warRoom.consensusSummary}
                </div>
                {warRoom.actionItems && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-1">
                    <span className="text-[11px] font-mono font-bold text-emerald-300">Action Directives:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {warRoom.actionItems.map((act, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 text-[11px] font-mono text-emerald-300 flex items-center gap-2"
                        >
                          <span>✓</span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
