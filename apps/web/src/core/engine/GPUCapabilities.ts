// [Agent-1: WebGPU Architect] — Detect GPU tier and renderer path at startup
export interface GPUProfile {
  tier:       0 | 1 | 2 | 3
  useWebGPU:  boolean
  maxTexture: number
  renderer:   string
}

export async function detectGPUProfile(): Promise<GPUProfile> {
  // Attempt WebGPU (Chrome 113+, Edge 113+)
  if ('gpu' in navigator) {
    try {
      const adapter = await (navigator as unknown as { gpu: GPUAdapter }).gpu.requestAdapter()
      if (adapter) {
        const info = await adapter.requestAdapterInfo()
        return { tier: 3, useWebGPU: true, maxTexture: 16384, renderer: info.device || 'WebGPU' }
      }
    } catch { /* fall through */ }
  }

  // WebGL2 inference
  const canvas = document.createElement('canvas')
  const gl     = canvas.getContext('webgl2')
  if (!gl) return { tier: 0, useWebGPU: false, maxTexture: 4096, renderer: 'WebGL1-only' }

  const ext      = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = ext
    ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
    : 'Unknown'
  const maxTex   = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number

  const tier: 0|1|2|3 =
    /rtx|rx [67]|radeon pro vii|rx 6[89]|m[12] (pro|max|ultra)/i.test(renderer) ? 2 :
    /gtx 1[6-9]|gtx 20|rx [45]|mali-g[7-9]/i.test(renderer)                     ? 1 : 0

  canvas.remove()
  return { tier, useWebGPU: false, maxTexture: maxTex, renderer }
}

interface GPUAdapter {
  requestAdapterInfo(): Promise<{ device: string }>
}
