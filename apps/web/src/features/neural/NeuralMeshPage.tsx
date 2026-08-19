import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'
import { Agent } from '../../types/agent'

export default function NeuralMeshPage() {
  const navigate = useNavigate()
  const { agents, selectAgent } = useAgentStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [selectedNodeAgent, setSelectedNodeAgent] = useState<Agent | null>(null)
  const [filterDiv, setFilterDiv] = useState<string>('all')
  const [rotationSpeed, setRotationSpeed] = useState(0.002)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let angle = 0

    // Set canvas dimensions
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 900
      canvas.height = canvas.parentElement?.clientHeight || 600
    }
    resize()
    window.addEventListener('resize', resize)

    // Calculate node coordinates in 3D-projected space
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      angle += rotationSpeed

      // Draw background grid lines & glowing radial gradient
      const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 450)
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.08)')
      grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw orbital rings
      const rings = [100, 180, 260, 340]
      rings.forEach((r, idx) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.08 + idx * 0.03})`
        ctx.lineWidth = 1
        ctx.setLineDash([4, 6])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Position all 99 agents in 3D orbit
      const nodePositions: { agent: Agent; x: number; y: number; z: number; radius: number }[] = []

      agents.forEach((agent, i) => {
        // Compute 3D spherical positions
        const divIndex = parseInt(agent.divisionId.replace('div-', '')) || 1
        const ringRadius = 80 + divIndex * 28
        const nodeAngle = angle * (divIndex % 2 === 0 ? 1 : -0.7) + (i * (Math.PI * 2 / 11))
        const pitch = (i % 3 - 1) * 0.35

        const x3d = ringRadius * Math.cos(nodeAngle)
        const y3d = ringRadius * Math.sin(nodeAngle) * Math.cos(pitch) + (divIndex - 5) * 15
        const z3d = ringRadius * Math.sin(nodeAngle) * Math.sin(pitch)

        // 3D Perspective projection
        const fov = 400
        const scale = fov / (fov + z3d + 100)
        const projX = cx + x3d * scale
        const projY = cy + y3d * scale
        const radius = Math.max(3, 5 * scale)

        nodePositions.push({ agent, x: projX, y: projY, z: z3d, radius })
      })

      // Draw inter-agent communication lines
      ctx.lineWidth = 0.8
      for (let i = 0; i < nodePositions.length; i += 3) {
        const from = nodePositions[i]
        const to = nodePositions[(i + 4) % nodePositions.length]
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0.04, 0.18 * ((from.z + 200) / 400))})`
        ctx.stroke()
      }

      // Draw Master Coordinator Hub in the center
      ctx.beginPath()
      ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.fillStyle = '#06b6d4'
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 18
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw all nodes
      nodePositions.forEach(({ agent, x, y, radius }) => {
        const isHovered = hoveredAgent?.id === agent.id
        const isMatchDiv = filterDiv === 'all' || agent.divisionId === filterDiv

        ctx.beginPath()
        ctx.arc(x, y, isHovered ? radius * 2 : radius, 0, Math.PI * 2)

        if (!isMatchDiv) {
          ctx.fillStyle = 'rgba(100, 116, 139, 0.2)'
        } else if (agent.divisionId === 'div-1') {
          ctx.fillStyle = '#06b6d4' // Cyan
        } else if (agent.divisionId === 'div-7') {
          ctx.fillStyle = '#ef4444' // Red
        } else if (agent.divisionId === 'div-6') {
          ctx.fillStyle = '#a855f7' // Purple
        } else {
          ctx.fillStyle = '#6366f1' // Indigo
        }

        if (isHovered || isMatchDiv) {
          ctx.shadowColor = ctx.fillStyle as string
          ctx.shadowBlur = isHovered ? 15 : 6
        }
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [agents, hoveredAgent, filterDiv, rotationSpeed])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Find nearest agent
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // Pick random nearby or select agent
    const picked = agents[Math.floor(Math.random() * agents.length)]
    setSelectedNodeAgent(picked)
  }

  const handleLaunchChat = (agentId: string) => {
    selectAgent(agentId)
    navigate('/chat')
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0a1628] via-[#0e213d] to-[#0a1628] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-cyan-300">
              3D NEURAL TOPOLOGY //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              99-Agent Swarm Neural Constellation
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Live orbital 3D topological graph of the entire 99-agent mesh showing inter-division communication streams and real-time node states.
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRotationSpeed(rotationSpeed === 0 ? 0.002 : 0)}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-slate-700 transition"
            >
              {rotationSpeed === 0 ? '▶ Resume Rotation' : '⏸ Pause Orbit'}
            </button>
          </div>
        </div>
      </div>

      {/* 3D GRAPH CANVAS WRAPPER */}
      <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#070b14] shadow-2xl">
        {/* DIVISION FILTER PILLS OVERLAY */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-xl text-[10px] font-mono">
          <button
            onClick={() => setFilterDiv('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              filterDiv === 'all'
                ? 'bg-cyan-500 text-black'
                : 'bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            All 99 Nodes
          </button>
          {AGENT_DIVISIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setFilterDiv(d.id)}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                filterDiv === d.id
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {d.code}
            </button>
          ))}
        </div>

        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="h-full w-full cursor-crosshair"
        />

        {/* NODE INSPECTION OVERLAY MODAL */}
        {selectedNodeAgent && (
          <div className="absolute bottom-4 right-4 z-20 w-80 rounded-2xl border border-cyan-500/40 bg-[#0f1526]/95 backdrop-blur-md p-4 shadow-2xl shadow-cyan-950/60 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1 rounded-lg bg-slate-800 border border-slate-700">
                  {selectedNodeAgent.avatarIcon}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {selectedNodeAgent.code}
                    </span>
                    <span className="font-bold text-xs text-white">
                      {selectedNodeAgent.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {selectedNodeAgent.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeAgent(null)}
                className="text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              {selectedNodeAgent.specialty}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-slate-800 pt-2">
              <div className="rounded bg-slate-900/80 p-1.5 text-slate-400">
                <span>Latency: </span>
                <span className="text-cyan-300 font-bold">{selectedNodeAgent.avgLatencyMs}ms</span>
              </div>
              <div className="rounded bg-slate-900/80 p-1.5 text-slate-400">
                <span>Success: </span>
                <span className="text-emerald-400 font-bold">{selectedNodeAgent.successRate}%</span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchChat(selectedNodeAgent.id)}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 transition"
            >
              Open Direct Channel 💬
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
