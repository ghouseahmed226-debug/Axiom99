// [Agent-45: XGBoost Matchmaking Modeler] — Lobby + matchmaking UI
export default function LobbyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 bg-nexus-900">
      <h1 className="font-display text-5xl font-black text-nexus-accent tracking-widest">LOBBY</h1>
      <p className="font-mono text-sm text-nexus-glow opacity-60">XGBoost SBMM — Sprint 2</p>
      <button className="px-8 py-3 bg-nexus-accent hover:bg-nexus-glow text-white font-display font-bold
                         rounded-sm tracking-widest transition-colors duration-150">
        QUICK PLAY
      </button>
    </div>
  )
}
