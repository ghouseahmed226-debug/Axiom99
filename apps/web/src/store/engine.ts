// [Agent-19] Global engine state — FPS, GPU tier, renderer capabilities
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface EngineState {
  isReady:      boolean
  fps:          number
  drawCalls:    number
  gpuTier:      0 | 1 | 2 | 3   // 0=low, 1=mid, 2=high, 3=ultra/WebGPU
  useWebGPU:    boolean
  pixelRatio:   number
  renderer:     string
  setReady:     (v: boolean)      => void
  setFPS:       (fps: number)     => void
  setDrawCalls: (n: number)       => void
  setGPUProfile:(tier: 0|1|2|3, useWebGPU: boolean, renderer: string) => void
}

export const useEngineStore = create<EngineState>()(
  devtools(
    subscribeWithSelector((set) => ({
      isReady:      false,
      fps:          0,
      drawCalls:    0,
      gpuTier:      1,
      useWebGPU:    false,
      pixelRatio:   Math.min(window.devicePixelRatio, 2),
      renderer:     'Unknown',
      setReady:       (v) => set({ isReady: v }),
      setFPS:         (fps) => set({ fps }),
      setDrawCalls:   (n) => set({ drawCalls: n }),
      setGPUProfile:  (tier, useWebGPU, renderer) =>
        set({ gpuTier: tier, useWebGPU, renderer }),
    })),
    { name: 'NexusWeb/Engine' }
  )
)
