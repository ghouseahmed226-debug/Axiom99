export type AgentDivisionId =
  | 'div-1'
  | 'div-2'
  | 'div-3'
  | 'div-4'
  | 'div-5'
  | 'div-6'
  | 'div-7'
  | 'div-8'
  | 'div-9'
  | 'custom'

export type AgentStatus = 'active' | 'idle' | 'thinking' | 'executing' | 'offline'

export interface AgentDivision {
  id: AgentDivisionId
  name: string
  code: string
  description: string
  color: string
  badgeColor: string
  icon: string
  agentCount: number
}

export interface Agent {
  id: string
  code: string // e.g. "A1", "A42", "A99"
  name: string
  divisionId: AgentDivisionId
  role: string
  specialty: string
  description: string
  systemPrompt: string
  avatarIcon: string
  status: AgentStatus
  taskCount: number
  successRate: number
  avgLatencyMs: number
  temperature: number
  model: string
  capabilities: string[]
  isCustom?: boolean
  createdAt?: string
}

export interface ToolCallStep {
  toolName: string
  input: Record<string, any>
  output?: string
  status: 'running' | 'completed' | 'failed'
}

export interface CodeSandboxResult {
  code: string
  output: string
  executionTimeMs: number
  status: 'success' | 'error'
  chartData?: { label: string; value: number }[]
}

export interface ChatMessage {
  id: string
  agentId: string
  sender: 'user' | 'agent' | 'system'
  senderName: string
  content: string
  thinking?: string
  toolCalls?: ToolCallStep[]
  sandboxResult?: CodeSandboxResult
  timestamp: string
  tokenCount?: number
  tokensPerSec?: number
}

export interface SwarmWorkflowStep {
  id: string
  agentId: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: string
  durationMs?: number
}

export interface SwarmWorkflow {
  id: string
  name: string
  description: string
  category: string
  icon: string
  estimatedTimeSec: number
  steps: SwarmWorkflowStep[]
  status: 'idle' | 'running' | 'completed' | 'failed'
  progress: number
}

export interface SwarmTelemetryLog {
  id: string
  timestamp: string
  agentId: string
  agentCode: string
  level: 'info' | 'warn' | 'success' | 'exec'
  message: string
}

export interface ApiSettings {
  geminiApiKey: string
  openaiApiKey: string
  anthropicApiKey: string
  customEndpoint: string
  defaultModel: string
  streamResponses: boolean
  enableSoundFx: boolean
  telemetrySpeedMs: number
}

// -------------------------------------------------------------
// ADVANCED FEATURES TYPES
// -------------------------------------------------------------

// 1. War Room & Autonomous Roundtable
export interface WarRoomMessage {
  id: string
  agentId: string
  agentCode: string
  agentName: string
  avatarIcon: string
  role: string
  content: string
  perspectiveType: 'proposal' | 'critique' | 'refinement' | 'consensus' | 'security'
  timestamp: string
  round: number
}

export interface WarRoomSession {
  id: string
  topic: string
  objective: string
  participantAgentIds: string[]
  currentRound: number
  maxRounds: number
  status: 'idle' | 'debating' | 'synthesizing' | 'completed'
  messages: WarRoomMessage[]
  consensusSummary?: string
  actionItems?: string[]
}

// 2. Visual Drag-and-Drop Workflow Builder
export interface VisualNode {
  id: string
  agentId: string
  type: 'agent' | 'condition' | 'aggregator' | 'output'
  label: string
  x: number
  y: number
  status: 'idle' | 'running' | 'completed' | 'failed'
  outputData?: string
}

export interface VisualConnection {
  id: string
  fromNodeId: string
  toNodeId: string
  animated?: boolean
}

export interface VisualPipeline {
  id: string
  name: string
  description: string
  nodes: VisualNode[]
  connections: VisualConnection[]
  isRunning?: boolean
  progress?: number
}

// 3. Document RAG Knowledge Base
export interface KnowledgeChunk {
  id: string
  text: string
  tokens: number
  score?: number
}

export interface KnowledgeDocument {
  id: string
  title: string
  fileName: string
  fileType: string
  sizeBytes: number
  uploadedAt: string
  assignedDivisionId?: AgentDivisionId | 'all'
  assignedAgentId?: string
  chunkCount: number
  chunks: KnowledgeChunk[]
  summary: string
}
