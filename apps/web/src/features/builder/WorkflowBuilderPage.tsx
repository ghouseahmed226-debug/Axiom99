import React, { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { VisualNode } from '../../types/agent'

export default function WorkflowBuilderPage() {
  const {
    visualPipeline,
    isVisualPipelineRunning,
    addVisualNode,
    removeVisualNode,
    connectVisualNodes,
    runVisualPipeline,
    resetVisualPipeline,
    agents,
  } = useAgentStore()

  const [selectedAgentToAdd, setSelectedAgentToAdd] = useState('agent-1')
  const [connectSourceNodeId, setConnectSourceNodeId] = useState<string | null>(null)

  const handleAddAgent = () => {
    addVisualNode(selectedAgentToAdd, 'agent')
  }

  const handleAddAggregator = () => {
    addVisualNode('agent-99', 'aggregator')
  }

  const handleNodeClick = (nodeId: string) => {
    if (!connectSourceNodeId) {
      setConnectSourceNodeId(nodeId)
    } else {
      connectVisualNodes(connectSourceNodeId, nodeId)
      setConnectSourceNodeId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0d1633] via-[#14204a] to-[#0d1633] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-indigo-300">
              PIPELINE ARCHITECT //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Visual Multi-Agent Flow Builder
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Design complex multi-agent DAG execution pipelines visually. Connect agent outputs, add aggregation consensus gates, and execute end-to-end swarm pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {visualPipeline.progress === 100 ? (
              <button
                onClick={resetVisualPipeline}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                Reset Pipeline
              </button>
            ) : (
              <button
                onClick={runVisualPipeline}
                disabled={isVisualPipelineRunning || visualPipeline.nodes.length === 0}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition"
              >
                {isVisualPipelineRunning ? 'Executing Pipeline DAG...' : 'Execute Visual Flow ⚡'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT TOOLBOX */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-4">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider border-b border-slate-800 pb-2">
              FLOW NODES PALETTE
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400">Select Operative Node</label>
                <select
                  value={selectedAgentToAdd}
                  onChange={(e) => setSelectedAgentToAdd(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.code} - {ag.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddAgent}
                className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                + Add Agent Node
              </button>

              <button
                onClick={handleAddAggregator}
                className="w-full rounded-xl border border-purple-500/40 bg-purple-500/10 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition"
              >
                + Add Swarm Consensus Gate
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-slate-300 font-bold">Wiring Instructions:</div>
              <div>1. Click first node to start wire.</div>
              <div>2. Click second node to connect edge.</div>
            </div>

            {connectSourceNodeId && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-mono text-amber-300 flex items-center justify-between">
                <span>Select target node to connect wire...</span>
                <button
                  onClick={() => setConnectSourceNodeId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT VISUAL CANVAS */}
        <div className="lg:col-span-9 rounded-2xl border border-slate-800 bg-[#070a12] p-6 min-h-[560px] relative overflow-hidden shadow-2xl">
          {/* BACKGROUND GRID */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG CONNECTION WIRES */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            {visualPipeline.connections.map((conn) => {
              const fromNode = visualPipeline.nodes.find((n) => n.id === conn.fromNodeId)
              const toNode = visualPipeline.nodes.find((n) => n.id === conn.toNodeId)
              if (!fromNode || !toNode) return null

              const startX = fromNode.x + 100
              const startY = fromNode.y + 40
              const endX = toNode.x + 100
              const endY = toNode.y + 40
              const isFlowing = isVisualPipelineRunning && fromNode.status === 'completed' && toNode.status === 'running'

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={isFlowing ? '#06b6d4' : '#334155'}
                    strokeWidth={isFlowing ? '3' : '2'}
                    strokeDasharray={isFlowing ? '6,6' : 'none'}
                    className={isFlowing ? 'animate-[dash_1s_linear_infinite]' : ''}
                  />
                </g>
              )
            })}
          </svg>

          {/* NODES */}
          <div className="relative z-10 space-y-4">
            {visualPipeline.nodes.map((node) => {
              const agent = agents.find((a) => a.id === node.agentId) || agents[0]
              const isSource = connectSourceNodeId === node.id
              const isRunning = node.status === 'running'
              const isDone = node.status === 'completed'

              return (
                <div
                  key={node.id}
                  style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                  onClick={() => handleNodeClick(node.id)}
                  className={`absolute w-56 rounded-xl border p-3.5 shadow-xl cursor-pointer transition-all duration-200 ${
                    isRunning
                      ? 'border-cyan-400 bg-cyan-950/80 shadow-cyan-500/30 ring-2 ring-cyan-400'
                      : isDone
                      ? 'border-emerald-500/60 bg-[#0c1e18]'
                      : isSource
                      ? 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400'
                      : 'border-slate-800 bg-[#0f1526] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-lg">{agent.avatarIcon}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isRunning
                          ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {node.status.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeVisualNode(node.id)
                      }}
                      className="text-slate-500 hover:text-rose-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-2">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">
                      {agent.code} // {node.type.toUpperCase()}
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {agent.name}
                    </div>
                  </div>

                  {node.outputData && (
                    <div className="mt-2 pt-2 border-t border-slate-800 text-[9px] font-mono text-emerald-300 truncate">
                      ✓ {node.outputData}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
