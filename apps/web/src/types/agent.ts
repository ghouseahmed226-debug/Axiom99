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

export interface AgentCapability {
  id: string
  name: string
  description: string
  icon: string
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

export interface ChatMessage {
  id: string
  agentId: string
  sender: 'user' | 'agent' | 'system'
  senderName: string
  content: string
  thinking?: string
  toolCalls?: ToolCallStep[]
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
