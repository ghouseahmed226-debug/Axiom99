// [Agent-12 & Agent-34] Universal shared types across Web, Extension & API
export type PlayerStatus = 'active' | 'banned' | 'suspended' | 'guest'
export type ItemRarity   = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type MatchResult  = 'win' | 'loss' | 'draw' | 'abandoned'
export type GPUTier      = 0 | 1 | 2 | 3

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface PlayerProfile {
  id:           string
  username:     string
  displayName:  string
  avatarUrl?:   string
  bio?:         string
  status:       PlayerStatus
  eloRating:    number
  level:        number
  totalXp:      number
  deviceTier:   GPUTier
  preferences:  Record<string, unknown>
  createdAt:    string
  updatedAt:    string
}

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

export interface TelemetryEvent {
  uid:                string
  sessionId:          string
  tick:               number
  eventType:          'spawn' | 'move' | 'weapon_fire' | 'kill' | 'death' | 'item_pickup'
  x:                  number
  y:                  number
  z:                  number
  velocityMagnitude:  number
  headingDelta:       number
  hsRatioSession:     number
  reactionMs:         number
  extra?:             Record<string, unknown>
  timestamp?:         number
}

export interface QuestObjective {
  id:          string
  description: string
  targetCount: number
  currentCount:number
  completed:   boolean
}

export interface Quest {
  id:          string
  playerId:    string
  title:       string
  description: string
  objectives:  QuestObjective[]
  rewardXp:    number
  rewardItems: string[]
  isCompleted: boolean
  generatedBy: 'llm' | 'designer'
  expiresAt?:  string
  createdAt:   string
}
