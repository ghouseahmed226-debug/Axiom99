import React from 'react'

export interface HUDProps {
  health?: number
  shield?: number
  fps?: number
  ping?: number
}

export const HUDOverlay: React.FC<HUDProps> = ({ health = 100, shield = 100, fps = 60, ping = 12 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none p-4 flex flex-col justify-between select-none">
      <div className="flex justify-between items-center text-xs font-mono text-purple-400 opacity-80">
        <div>NEXUS CONSOLE // 64Hz</div>
        <div>FPS: {fps} | PING: {ping}ms</div>
      </div>
      <div className="flex gap-4 items-end">
        <div className="w-48 bg-zinc-900/80 p-2 rounded border border-purple-900/50">
          <div className="text-[10px] text-zinc-400 font-mono mb-1">HEALTH: {health}%</div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-200" style={{ width: `${health}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}