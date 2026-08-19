// [Agent-19: R3F Bridge] — Boot screen with CRT scanline effect
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-nexus-900 flex flex-col items-center justify-center gap-6 z-50 overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(108,71,255,0.3) 2px, rgba(108,71,255,0.3) 4px)' }}
      />
      <div className="font-display text-5xl font-black tracking-[0.3em] text-nexus-accent"
           style={{ textShadow: '0 0 40px #6c47ff, 0 0 80px #6c47ff' }}>
        NEXUSWEB
      </div>
      {/* Progress bar */}
      <div className="w-64 h-0.5 bg-nexus-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-nexus-accent to-nexus-glow rounded-full
                        animate-[scan_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
      </div>
      <p className="font-mono text-[10px] tracking-[0.4em] text-nexus-glow opacity-50 uppercase">
        Initializing Engine…
      </p>
    </div>
  )
}
