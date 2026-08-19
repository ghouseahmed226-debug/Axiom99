// [Agent-4: BufferGeometry Optimizer] — Fixed 64 Hz game loop with accumulator
import { useFrame } from '@react-three/fiber'
import { useRef }   from 'react'

const FIXED_DT    = 1 / 64   // 64 Hz physics tick
const MAX_SUBSTEP = 5         // prevent spiral of death

export function useGameLoop(
  onFixedUpdate: (dt: number, tick: number) => void
) {
  const accumulator = useRef(0)
  const tick        = useRef(0)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1) // clamp; prevents huge jumps on tab restore
    accumulator.current += dt

    let substeps = 0
    while (accumulator.current >= FIXED_DT && substeps < MAX_SUBSTEP) {
      onFixedUpdate(FIXED_DT, tick.current++)
      accumulator.current -= FIXED_DT
      substeps++
    }
  })
}
