// [Agent-23: Firebase WebSockets Lead] — Session/matchmaking state
import { create } from 'zustand'

export type SessionPhase = 'idle' | 'matchmaking' | 'loading' | 'active' | 'ended'

interface SessionState {
  sessionId:  string | null
  phase:      SessionPhase
  gameMode:   string
  mapId:      string
  playerIds:  string[]
  ping:       number
  tickRate:   number
  setSession: (id: string) => void
  setPhase:   (p: SessionPhase) => void
  setPing:    (ms: number) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  sessionId: null,
  phase:     'idle',
  gameMode:  'battle-royale',
  mapId:     'nexus-city-v1',
  playerIds: [],
  ping:      0,
  tickRate:  64,
  setSession: (id) => set({ sessionId: id, phase: 'loading' }),
  setPhase:   (p)  => set({ phase: p }),
  setPing:    (ms) => set({ ping: ms }),
}))
