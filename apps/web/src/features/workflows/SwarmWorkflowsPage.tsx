import React from 'react'
import { useAgentStore } from '../../store/agentStore'

export default function SwarmWorkflowsPage() {
  const { workflows, activeWorkflowId, runWorkflow, resetWorkflow, agents } =
    useAgentStore()

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0d142b] via-[#121c3b] to-[#0d142b] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-indigo-300">
              MISSION CONTROL //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Multi-Agent Autonomous Workflows
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Execute coordinated multi-agent mission pipelines where tasks are automatically handed off across division specialists with verification checkpoints.
            </p>
          </div>
        </div>
      </div>

      {/* WORKFLOWS LIST */}
      <div className="space-y-6">
        {workflows.map((wf) => {
          const isRunning = wf.status === 'running'
          const isCompleted = wf.status === 'completed'

          return (
            <div
              key={wf.id}
              className={`rounded-2xl border bg-[#0d121f] p-6 space-y-5 transition-all ${
                isRunning
                  ? 'border-cyan-500/60 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : isCompleted
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'border-slate-800'
              }`}
            >
              {/* WORKFLOW HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0">
                    {wf.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {wf.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ~{wf.estimatedTimeSec}s est. runtime
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {wf.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {wf.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <button
                      onClick={() => resetWorkflow(wf.id)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                    >
                      Reset Pipeline
                    </button>
                  ) : (
                    <button
                      onClick={() => runWorkflow(wf.id)}
                      disabled={isRunning}
                      className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition"
                    >
                      {isRunning ? 'Executing Swarm Steps...' : 'Execute Swarm Workflow ⚡'}
                    </button>
                  )}
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Pipeline Progress</span>
                  <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {wf.progress}% {isCompleted ? '✓ COMPLETED' : isRunning ? '⚡ IN PROGRESS' : 'IDLE'}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                    }`}
                    style={{ width: `${wf.progress}%` }}
                  />
                </div>
              </div>

              {/* SEQUENTIAL STEPS TILES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {wf.steps.map((step, idx) => {
                  const stepAgent =
                    agents.find((a) => a.id === step.agentId) || agents[0]
                  const isStepRunning = step.status === 'running'
                  const isStepDone = step.status === 'completed'

                  return (
                    <div
                      key={step.id}
                      className={`rounded-xl border p-3.5 space-y-2.5 transition-all ${
                        isStepRunning
                          ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400/40'
                          : isStepDone
                          ? 'border-emerald-500/30 bg-emerald-950/10'
                          : 'border-slate-800/80 bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-400">
                          STEP {idx + 1}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isStepDone
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isStepRunning
                              ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {step.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                        <span className="text-xl p-1 rounded bg-slate-800 border border-slate-700">
                          {stepAgent.avatarIcon}
                        </span>
                        <div className="overflow-hidden">
                          <div className="text-[10px] font-mono font-bold text-cyan-400">
                            {stepAgent.code}
                          </div>
                          <div className="text-xs font-semibold text-white truncate">
                            {stepAgent.name}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-200">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {step.description}
                        </p>
                      </div>

                      {step.output && (
                        <div className="rounded bg-black/40 p-2 text-[10px] font-mono text-emerald-300 border border-emerald-500/20">
                          {step.output}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
