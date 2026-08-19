// [Division 1 & 2] Master Console OS & Cartridge Viewport
import React, { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { StatsGl } from '@react-three/drei'
import { CyberRunner } from '../games/CyberRunner'
import { NeonArena } from '../games/NeonArena'
import { VoxelCraft } from '../games/VoxelCraft'
import { sound } from '../../core/audio/SoundSynth'
import { useEngineStore } from '../../store/engine'

type GameCartridge = 'cyber_runner' | 'neon_arena' | 'voxel_craft'

export default function ConsolePage() {
  const [selectedGame, setSelectedGame] = useState<GameCartridge>('cyber_runner')
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [scanlines, setScanlines] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  const { pixelRatio, gpuTier } = useEngineStore()

  useEffect(() => {
    const saved = localStorage.getItem(`high_score_${selectedGame}`)
    if (saved) setHighScore(parseInt(saved, 10))
    else setHighScore(0)
  }, [selectedGame])

  const handleGameOver = (finalScore: number) => {
    setIsGameOver(true)
    setScore(finalScore)
    if (finalScore > highScore) {
      setHighScore(finalScore)
      localStorage.setItem(`high_score_${selectedGame}`, finalScore.toString())
    }
  }

  const handleStartGame = (game: GameCartridge) => {
    sound.playClick()
    setSelectedGame(game)
    setIsPlaying(true)
    setIsGameOver(false)
    setScore(0)
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#0a0a0f] font-mono text-white">
      {/* Retro CRT Scanline Filter */}
      {scanlines && (
        <div
          className="pointer-events-none absolute inset-0 z-40 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(108,71,255,0.4) 2px, rgba(108,71,255,0.4) 4px)',
          }}
        />
      )}

      {/* Top Console Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-[#111118]/80 backdrop-blur border-b border-[#6c47ff]/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00ffcc] animate-pulse" />
          <span className="font-bold tracking-widest text-[#a78bfa] text-sm">AXIOM99 // NEXUS CONSOLE</span>
        </div>

        {/* Game Cartridge Selector Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'cyber_runner', label: 'CYBER RUNNER 2099' },
            { id: 'neon_arena', label: 'NEON ARENA 3D' },
            { id: 'voxel_craft', label: 'VOXEL CRAFT' },
          ].map((cart) => (
            <button
              key={cart.id}
              onClick={() => handleStartGame(cart.id as GameCartridge)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
                selectedGame === cart.id && isPlaying
                  ? 'bg-[#6c47ff] text-white shadow-lg shadow-indigo-500/40 border border-[#a78bfa]'
                  : 'bg-[#1a1a28] hover:bg-[#252538] text-zinc-400 border border-zinc-700'
              }`}
            >
              {cart.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-600"
          >
            ⚙ SETTINGS
          </button>
          <a
            href="https://github.com/ghouseahmed226-debug/Axiom99"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-[#6c47ff] hover:bg-[#8b5cf6] rounded font-bold"
          >
            ★ GITHUB
          </a>
        </div>
      </header>

      {/* 3D Viewport Canvas */}
      <main className="w-full h-full">
        <Canvas
          dpr={pixelRatio}
          gl={{ antialias: gpuTier >= 2, powerPreference: 'high-performance' }}
          camera={{ fov: 60, position: [0, 4, 8] }}
        >
          <Suspense fallback={null}>
            {isPlaying && selectedGame === 'cyber_runner' && <CyberRunner onGameOver={handleGameOver} />}
            {isPlaying && selectedGame === 'neon_arena' && <NeonArena onGameOver={handleGameOver} />}
            {isPlaying && selectedGame === 'voxel_craft' && <VoxelCraft />}

            {!isPlaying && (
              <group>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#6c47ff" />
                <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
                  <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
                  <meshStandardMaterial color="#6c47ff" roughness={0.2} metalness={0.9} emissive="#a78bfa" emissiveIntensity={0.5} />
                </mesh>
              </group>
            )}
          </Suspense>
          {import.meta.env.DEV && <StatsGl />}
        </Canvas>
      </main>

      {/* Splash / Welcome Screen */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-sm p-6 text-center">
          <h1 className="text-5xl font-black tracking-widest text-[#a78bfa] mb-2 drop-shadow-[0_0_35px_rgba(108,71,255,0.8)]">
            AXIOM99
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mb-8">
            Next-Gen Open-Source Browser 3D Game Engine & Web Console. Sub-16ms latency. AI Matchmaking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
            {[
              { id: 'cyber_runner', title: 'CYBER RUNNER 2099', desc: 'High-speed 3D parkour highway runner' },
              { id: 'neon_arena', title: 'NEON ARENA 3D', desc: 'Top-down arcade shooter with enemy waves' },
              { id: 'voxel_craft', title: 'VOXEL CRAFT', desc: '3D Voxel sandbox building world' },
            ].map((g) => (
              <div
                key={g.id}
                onClick={() => handleStartGame(g.id as GameCartridge)}
                className="p-4 bg-[#141420] hover:bg-[#1f1f35] rounded-lg border border-[#6c47ff]/40 hover:border-[#00ffcc] cursor-pointer transition-all hover:scale-105"
              >
                <h3 className="font-bold text-sm text-[#00ffcc] mb-1">{g.title}</h3>
                <p className="text-xs text-zinc-400">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#141420] border-2 border-[#ff0055] p-8 rounded-xl text-center max-w-sm w-full shadow-2xl shadow-red-500/20">
            <h2 className="text-2xl font-black text-[#ff0055] mb-2">SYSTEM CRITICAL // GAME OVER</h2>
            <div className="my-4 space-y-1">
              <p className="text-sm text-zinc-400">FINAL SCORE: <span className="font-bold text-white text-lg">{score}</span></p>
              <p className="text-xs text-[#00ffcc]">HIGH SCORE: {highScore}</p>
            </div>
            <button
              onClick={() => handleStartGame(selectedGame)}
              className="w-full py-3 bg-[#ff0055] hover:bg-[#ff3377] text-white font-bold rounded-lg transition-all"
            >
              INSERT COIN (RESTART)
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute top-16 right-6 z-40 bg-[#141420] border border-[#6c47ff] p-5 rounded-lg w-72 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
            <h3 className="font-bold text-sm text-[#a78bfa]">CONSOLE CONFIG</h3>
            <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span>CRT Scanlines</span>
              <input type="checkbox" checked={scanlines} onChange={(e) => setScanlines(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Sound Effects</span>
              <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
            </label>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-zinc-400">
              <span>Renderer Engine:</span>
              <span className="text-[#00ffcc] font-bold">{gpuTier >= 3 ? 'WebGPU' : 'WebGL2'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 flex justify-between px-6 py-2 bg-[#0a0a0f]/90 border-t border-zinc-800 text-[11px] text-zinc-500">
        <div>CONTROLS: [A/D] Lanes • [W/SPACE] Jump • [WASD + MOUSE] Shoot • [SHIFT+CLICK] Mine</div>
        <div className="text-[#00ffcc]">SWARM 99-AGENT ENGINE READY</div>
      </footer>
    </div>
  )
}