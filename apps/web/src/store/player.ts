// [Agent-27: Client-Side Prediction Coder] — Player state + input buffer
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface Vec3 { x: number; y: number; z: number }

export interface InputFrame {
  seq:     number
  tick:    number
  forward: boolean
  back:    boolean
  left:    boolean
  right:   boolean
  jump:    boolean
  sprint:  boolean
  yaw:     number
  pitch:   number
  dt:      number
}

export interface RemotePlayer {
  uid:      string
  username: string
  position: Vec3
  yaw:      number
  seq:      number
  ping:     number
}

const MOVE_SPEED  = 5.0
const SPRINT_MULT = 1.8

interface PlayerState {
  localUID:      string | null
  position:      Vec3
  velocity:      Vec3
  yaw:           number
  pitch:         number
  seq:           number
  inputBuffer:   InputFrame[]
  remotePlayers: Map<string, RemotePlayer>

  setLocalUID:  (uid: string) => void
  applyInput:   (input: InputFrame) => void
  reconcile:    (serverPos: Vec3, serverSeq: number) => void
  upsertRemote: (player: RemotePlayer) => void
  removeRemote: (uid: string) => void
}

export const usePlayerStore = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    localUID:      null,
    position:      { x: 0, y: 1, z: 0 },
    velocity:      { x: 0, y: 0, z: 0 },
    yaw:           0,
    pitch:         0,
    seq:           0,
    inputBuffer:   [],
    remotePlayers: new Map(),

    setLocalUID: (uid) => set({ localUID: uid }),

    applyInput: (input) => {
      const { position, velocity } = get()
      const speed = MOVE_SPEED * (input.sprint ? SPRINT_MULT : 1)
      const cosY = Math.cos(input.yaw), sinY = Math.sin(input.yaw)
      let vx = 0, vz = 0
      if (input.forward) { vx -= sinY * speed; vz -= cosY * speed }
      if (input.back)    { vx += sinY * speed; vz += cosY * speed }
      if (input.left)    { vx -= cosY * speed; vz += sinY * speed }
      if (input.right)   { vx += cosY * speed; vz -= sinY * speed }
      set({
        velocity: { x: vx, y: velocity.y, z: vz },
        position: {
          x: position.x + vx * input.dt,
          y: position.y,
          z: position.z + vz * input.dt,
        },
        yaw:   input.yaw,
        pitch: input.pitch,
        seq:   input.seq,
        inputBuffer: [...get().inputBuffer, input].slice(-128),
      })
    },

    reconcile: (serverPos, serverSeq) => {
      const buffer = get().inputBuffer.filter(f => f.seq > serverSeq)
      set({ position: serverPos, inputBuffer: buffer })
      buffer.forEach(f => get().applyInput(f))
    },

    upsertRemote: (player) => {
      const m = new Map(get().remotePlayers)
      m.set(player.uid, player)
      set({ remotePlayers: m })
    },

    removeRemote: (uid) => {
      const m = new Map(get().remotePlayers)
      m.delete(uid)
      set({ remotePlayers: m })
    },
  }))
)
