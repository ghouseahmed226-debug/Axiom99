// [Agent-19: R3F Bridge] — Main 3D canvas shell
// [Agent-4: BufferGeometry Optimizer] — manual chunk splitting + LOD
import { Canvas }            from '@react-three/fiber'
import { Suspense }          from 'react'
import { StatsGl }           from '@react-three/drei'
import { Physics }           from '@react-three/rapier'
import { useEngineStore }    from '../../store/engine'

export default function ConsolePage() {
  const { pixelRatio, gpuTier } = useEngineStore()

  return (
    <div className="w-full h-full relative">
      <Canvas
        dpr={pixelRatio}
        gl={{
          antialias:       gpuTier >= 2,
          powerPreference: 'high-performance',
          stencil:         false,
        }}
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 8] }}
        shadows={gpuTier >= 1}
        performance={{ min: 0.5 }}   // adaptive DPR — drops to 50% under load
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} timeStep={1 / 64}>
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.4}
              castShadow={gpuTier >= 1}
              shadow-mapSize={[2048, 2048]}
            />
            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[400, 400, 1, 1]} />
              <meshStandardMaterial color="#111118" roughness={0.9} metalness={0.1} />
            </mesh>
          </Physics>
        </Suspense>
        {import.meta.env.DEV && <StatsGl />}
      </Canvas>
      {/* HUD overlay */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-4 left-4 font-mono text-[11px] text-nexus-glow opacity-60">
          NexusWeb v0.1 — {gpuTier >= 3 ? 'WebGPU' : 'WebGL2'}
        </div>
        <div className="absolute top-4 right-4 font-mono text-[11px] text-nexus-glow opacity-60">
          ALPHA BUILD
        </div>
      </div>
    </div>
  )
}
