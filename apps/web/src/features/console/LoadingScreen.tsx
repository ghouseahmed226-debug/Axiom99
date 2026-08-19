import React from 'react'

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0a0d14] text-slate-100 font-mono">
      <div className="relative flex flex-col items-center space-y-4">
        {/* GLOWING LOGO */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1px] shadow-2xl shadow-cyan-500/30">
          <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#0a0d14]">
            <span className="text-3xl animate-pulse">👑</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
            AXIOM 99
          </h2>
          <p className="text-xs text-slate-400 tracking-wider">
            INITIALIZING 99-AGENT SWARM MESH...
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1.5 w-48 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-indigo-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}
