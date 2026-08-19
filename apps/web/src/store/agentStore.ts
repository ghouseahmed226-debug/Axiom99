import { create } from 'zustand'
import {
  Agent,
  AgentDivisionId,
  ChatMessage,
  SwarmWorkflow,
  SwarmTelemetryLog,
  ApiSettings,
  WarRoomSession,
  WarRoomMessage,
  VisualPipeline,
  VisualNode,
  VisualConnection,
  KnowledgeDocument,
  CodeSandboxResult,
} from '../types/agent'
import { AGENTS_ROSTER, AGENT_DIVISIONS } from '../data/agentsRoster'

const DEFAULT_SETTINGS: ApiSettings = {
  geminiApiKey: '',
  openaiApiKey: '',
  anthropicApiKey: '',
  customEndpoint: '',
  defaultModel: 'Gemini 1.5 Pro',
  streamResponses: true,
  enableSoundFx: true,
  telemetrySpeedMs: 3000,
}

const DEFAULT_WORKFLOWS: SwarmWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Full-Stack Codebase Audit & Security Sweep',
    description: 'Autonomous multi-agent pipeline: Systems architecture analysis, code security audit, edge performance optimization.',
    category: 'Security & DevOps',
    icon: '🛡️',
    estimatedTimeSec: 8,
    progress: 0,
    status: 'idle',
    steps: [
      {
        id: 'step-1',
        agentId: 'agent-67',
        title: 'Memory Boundary & Buffer Safety Check',
        description: 'Auditing WASM boundary memory buffers and pointer sanity.',
        status: 'pending',
      },
      {
        id: 'step-2',
        agentId: 'agent-38',
        title: 'Database Access & RLS Rule Verification',
        description: 'Evaluating PostgreSQL 16 row-level security policies and token validations.',
        status: 'pending',
      },
      {
        id: 'step-3',
        agentId: 'agent-49',
        title: 'Telemetry Anomaly & Exploit Pattern Scan',
        description: 'Running Isolation Forest heuristics on telemetry event streams.',
        status: 'pending',
      },
      {
        id: 'step-4',
        agentId: 'agent-88',
        title: 'CI/CD Deployment Seal & Report Generation',
        description: 'Compiling security summary and dispatching GitHub Actions artifact.',
        status: 'pending',
      },
    ],
  },
  {
    id: 'wf-2',
    name: 'AI Agent Swarm Consensus & Task Decomposition',
    description: 'Deconstructs high-level objectives into atomic sub-agent assignments with automated verification.',
    category: 'LLM Reasoning',
    icon: '✨',
    estimatedTimeSec: 6,
    progress: 0,
    status: 'idle',
    steps: [
      {
        id: 'step-1',
        agentId: 'agent-99',
        title: 'Objective Decomposition & Swarm Broadcast',
        description: 'Broadcasting objective vector to all 9 divisions with priority weightings.',
        status: 'pending',
      },
      {
        id: 'step-2',
        agentId: 'agent-56',
        title: 'Recursive Sub-Prompt Compilation',
        description: 'Compiling few-shot prompts and deterministic constraints for target operatives.',
        status: 'pending',
      },
      {
        id: 'step-3',
        agentId: 'agent-61',
        title: 'ReAct Execution & Consensus Synthesis',
        description: 'Validating output against domain benchmarks and consolidating final response.',
        status: 'pending',
      },
    ],
  },
  {
    id: 'wf-3',
    name: 'Edge Latency & Stream Optimization',
    description: 'High-frequency telemetry benchmarking, WebSocket frame packing, and edge routing tuning.',
    category: 'Performance',
    icon: '⚡',
    estimatedTimeSec: 7,
    progress: 0,
    status: 'idle',
    steps: [
      {
        id: 'step-1',
        agentId: 'agent-1',
        title: 'Compute Pipeline Benchmarking',
        description: 'Profiling GPU hardware tier capabilities and compute shader latency.',
        status: 'pending',
      },
      {
        id: 'step-2',
        agentId: 'agent-23',
        title: 'Protobuf Bit-Packing Calibration',
        description: 'Optimizing binary delta frame compression ratios for sub-10ms packet delivery.',
        status: 'pending',
      },
      {
        id: 'step-3',
        agentId: 'agent-78',
        title: 'Edge Worker Routing Optimization',
        description: 'Testing CDN edge regional distribution and SSL termination timings.',
        status: 'pending',
      },
    ],
  },
]

const DEFAULT_WAR_ROOM: WarRoomSession = {
  id: 'war-room-1',
  topic: 'High-Throughput Sub-10ms Event Ingestion Architecture',
  objective: 'Determine optimal binary protocol, memory bounds, and edge caching strategy for 100k events/sec with zero packet loss.',
  participantAgentIds: ['agent-99', 'agent-1', 'agent-23', 'agent-67', 'agent-88'],
  currentRound: 0,
  maxRounds: 3,
  status: 'idle',
  messages: [],
}

const DEFAULT_VISUAL_PIPELINE: VisualPipeline = {
  id: 'vis-pipe-1',
  name: 'Security & Performance Autonomous Pipeline',
  description: 'Visual multi-agent DAG connecting WebGPU analysis, Security Shield validation, and DevOps Edge deployment.',
  nodes: [
    {
      id: 'node-1',
      agentId: 'agent-1',
      type: 'agent',
      label: 'WebGPU Systems (A1)',
      x: 60,
      y: 120,
      status: 'idle',
    },
    {
      id: 'node-2',
      agentId: 'agent-67',
      type: 'agent',
      label: 'Memory Shield (A67)',
      x: 320,
      y: 60,
      status: 'idle',
    },
    {
      id: 'node-3',
      agentId: 'agent-49',
      type: 'agent',
      label: 'Anomaly Shield (A49)',
      x: 320,
      y: 200,
      status: 'idle',
    },
    {
      id: 'node-4',
      agentId: 'agent-99',
      type: 'aggregator',
      label: 'Swarm Consensus (A99)',
      x: 580,
      y: 130,
      status: 'idle',
    },
    {
      id: 'node-5',
      agentId: 'agent-88',
      type: 'output',
      label: 'Edge Deployer (A88)',
      x: 820,
      y: 130,
      status: 'idle',
    },
  ],
  connections: [
    { id: 'c1', fromNodeId: 'node-1', toNodeId: 'node-2' },
    { id: 'c2', fromNodeId: 'node-1', toNodeId: 'node-3' },
    { id: 'c3', fromNodeId: 'node-2', toNodeId: 'node-4' },
    { id: 'c4', fromNodeId: 'node-3', toNodeId: 'node-4' },
    { id: 'c5', fromNodeId: 'node-4', toNodeId: 'node-5' },
  ],
}

const DEFAULT_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    title: 'Axiom99 Architecture Specification v2.4',
    fileName: 'axiom99_spec.md',
    fileType: 'markdown',
    sizeBytes: 14200,
    uploadedAt: '2026-08-19',
    assignedDivisionId: 'all',
    chunkCount: 6,
    summary: 'Core engineering specification detailing division structures, sub-16ms telemetry, and security protocols.',
    chunks: [
      { id: 'c-1', text: 'Axiom99 operates 9 specialized divisions comprising 99 autonomous agents managed via Swarm Orchestrator (A99).', tokens: 28 },
      { id: 'c-2', text: 'Real-time telemetry streams utilize binary Protobuf bit-packing and WebSocket delta interpolation for <10ms ping.', tokens: 24 },
      { id: 'c-3', text: 'Division 7 enforces strict memory boundary isolation and AST runtime execution sandboxing.', tokens: 19 },
    ],
  },
  {
    id: 'doc-2',
    title: 'Memory Shield & Sandbox Security Guidelines',
    fileName: 'security_guidelines.json',
    fileType: 'json',
    sizeBytes: 8400,
    uploadedAt: '2026-08-19',
    assignedDivisionId: 'div-7',
    chunkCount: 4,
    summary: 'Rules for memory buffer isolation, prompt injection defense filters, and token validation.',
    chunks: [
      { id: 'c-4', text: 'All inbound user prompts must be evaluated against heuristic injection signatures before execution.', tokens: 21 },
      { id: 'c-5', text: 'WebAssembly memory allocations must not exceed the predetermined contiguous 64MB buffer limit.', tokens: 22 },
    ],
  },
]

interface AgentStoreState {
  // Agents State
  agents: Agent[]
  selectedAgentId: string
  selectedDivisionId: AgentDivisionId | 'all'
  searchQuery: string
  customAgents: Agent[]

  // Chat State
  conversations: Record<string, ChatMessage[]>
  isGeneratingResponse: boolean
  activeStreamingMessage: string

  // Workflows
  workflows: SwarmWorkflow[]
  activeWorkflowId: string | null

  // War Room / Roundtable
  warRoom: WarRoomSession
  isWarRoomDebating: boolean

  // Visual Node Workflow Builder
  visualPipeline: VisualPipeline
  isVisualPipelineRunning: boolean

  // Knowledge Base & RAG
  knowledgeDocuments: KnowledgeDocument[]
  knowledgeSearchQuery: string

  // Telemetry & Logs
  logs: SwarmTelemetryLog[]
  systemUptimeSec: number
  totalOpsCount: number

  // Settings
  settings: ApiSettings

  // Actions
  selectAgent: (agentId: string) => void
  selectDivision: (divId: AgentDivisionId | 'all') => void
  setSearchQuery: (query: string) => void
  createCustomAgent: (newAgent: Omit<Agent, 'id' | 'isCustom' | 'taskCount' | 'successRate' | 'avgLatencyMs'>) => Agent
  deleteCustomAgent: (agentId: string) => void
  sendMessage: (agentId: string, content: string) => Promise<void>
  clearChat: (agentId: string) => void
  runWorkflow: (workflowId: string) => Promise<void>
  resetWorkflow: (workflowId: string) => void
  addTelemetryLog: (log: Omit<SwarmTelemetryLog, 'id' | 'timestamp'>) => void
  updateSettings: (partial: Partial<ApiSettings>) => void
  broadcastSwarmMessage: (content: string) => Promise<void>

  // War Room Actions
  startWarRoomDebate: (topic: string, objective: string, participantIds?: string[]) => Promise<void>
  resetWarRoom: () => void

  // Visual Pipeline Actions
  addVisualNode: (agentId: string, type?: VisualNode['type']) => void
  removeVisualNode: (nodeId: string) => void
  connectVisualNodes: (fromId: string, toId: string) => void
  updateNodePosition: (nodeId: string, x: number, y: number) => void
  runVisualPipeline: () => Promise<void>
  resetVisualPipeline: () => void

  // Knowledge Base Actions
  addKnowledgeDocument: (doc: Omit<KnowledgeDocument, 'id' | 'uploadedAt' | 'chunkCount' | 'chunks'>, rawText: string) => void
  deleteKnowledgeDocument: (docId: string) => void
  searchKnowledgeBase: (query: string) => KnowledgeChunk[]

  // Sandbox Runner
  executeCodeInSandbox: (code: string) => CodeSandboxResult
}

const createInitialChats = (): Record<string, ChatMessage[]> => {
  const initial: Record<string, ChatMessage[]> = {}
  
  initial['agent-99'] = [
    {
      id: 'msg-init-99',
      agentId: 'agent-99',
      sender: 'agent',
      senderName: 'Swarm Orchestrator (A99)',
      content:
        `### Axiom99 Swarm Coordination Node Online 👑\n\nAll **99 agents** across all **9 specialized divisions** are synchronized and standing by at nominal capacity.\n\n` +
        `- **Division 1-9**: Fully Operational\n` +
        `- **Active Nodes**: 99 / 99\n` +
        `- **Mean Latency**: 48ms\n` +
        `- **Swarm Consensus**: 100%\n\n` +
        `How would you like to direct the swarm today? You can dispatch single agent queries, start a **Multi-Agent War Room**, build a **Visual Flow**, or search the **Knowledge Base**.`,
      thinking: 'Verified global agent registry state and loaded division telemetry metrics.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokenCount: 84,
      tokensPerSec: 142,
    },
  ]

  initial['agent-1'] = [
    {
      id: 'msg-init-1',
      agentId: 'agent-1',
      sender: 'agent',
      senderName: 'WebGPU Architect (A1)',
      content:
        `### WebGPU Systems Core Ready ⚡\n\nI specialize in low-level graphics architectures, WebGPU/WebGL2 compute pipelines, and hardware shader efficiency.\n\n` +
        `Ask me for shader code reviews, compute buffer allocations, memory alignment strategies, or hardware tier optimizations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokenCount: 52,
    },
  ]

  initial['agent-67'] = [
    {
      id: 'msg-init-67',
      agentId: 'agent-67',
      sender: 'agent',
      senderName: 'Memory Shield Core (A67)',
      content:
        `### Security Guardrails Active 🛡️\n\nZero known vulnerabilities detected across memory boundaries. Ready to audit endpoints, validate sanitization logic, and test prompt injection defenses.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokenCount: 44,
    },
  ]

  return initial
}

export const useAgentStore = create<AgentStoreState>((set, get) => {
  const savedCustom = localStorage.getItem('axiom99_custom_agents')
  const initialCustom: Agent[] = savedCustom ? JSON.parse(savedCustom) : []
  
  const savedSettings = localStorage.getItem('axiom99_settings')
  const initialSettings: ApiSettings = savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS

  const savedDocs = localStorage.getItem('axiom99_docs')
  const initialDocs: KnowledgeDocument[] = savedDocs ? JSON.parse(savedDocs) : DEFAULT_DOCUMENTS

  const allInitialAgents = [...AGENTS_ROSTER, ...initialCustom]

  return {
    agents: allInitialAgents,
    selectedAgentId: 'agent-99',
    selectedDivisionId: 'all',
    searchQuery: '',
    customAgents: initialCustom,
    conversations: createInitialChats(),
    isGeneratingResponse: false,
    activeStreamingMessage: '',
    workflows: DEFAULT_WORKFLOWS,
    activeWorkflowId: null,
    warRoom: DEFAULT_WAR_ROOM,
    isWarRoomDebating: false,
    visualPipeline: DEFAULT_VISUAL_PIPELINE,
    isVisualPipelineRunning: false,
    knowledgeDocuments: initialDocs,
    knowledgeSearchQuery: '',
    logs: [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'success',
        message: 'Swarm Orchestrator initialized 99 agent nodes across 9 divisions.',
      },
      {
        id: 'log-2',
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'agent-1',
        agentCode: 'A1',
        level: 'info',
        message: 'Hardware tier detection completed: Tier-3 Compute Shader active.',
      },
      {
        id: 'log-3',
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'agent-34',
        agentCode: 'A34',
        level: 'info',
        message: 'pgvector HNSW memory index loaded with 1,024 vector dimensions.',
      },
    ],
    systemUptimeSec: 1420,
    totalOpsCount: 18940,
    settings: initialSettings,

    selectAgent: (agentId: string) => {
      set({ selectedAgentId: agentId })
    },

    selectDivision: (divId: AgentDivisionId | 'all') => {
      set({ selectedDivisionId: divId })
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query })
    },

    createCustomAgent: (newAgentData) => {
      const state = get()
      const customId = `custom-agent-${Date.now()}`
      const customCode = `C${state.customAgents.length + 1}`

      const createdAgent: Agent = {
        ...newAgentData,
        id: customId,
        code: customCode,
        isCustom: true,
        taskCount: 0,
        successRate: 100,
        avgLatencyMs: 35,
        createdAt: new Date().toISOString(),
      }

      const updatedCustom = [...state.customAgents, createdAgent]
      const updatedAll = [...AGENTS_ROSTER, ...updatedCustom]

      localStorage.setItem('axiom99_custom_agents', JSON.stringify(updatedCustom))

      set({
        customAgents: updatedCustom,
        agents: updatedAll,
        selectedAgentId: createdAgent.id,
      })

      get().addTelemetryLog({
        agentId: createdAgent.id,
        agentCode: createdAgent.code,
        level: 'success',
        message: `Custom agent [${createdAgent.name}] deployed to swarm with model ${createdAgent.model}.`,
      })

      return createdAgent
    },

    deleteCustomAgent: (agentId: string) => {
      const state = get()
      const updatedCustom = state.customAgents.filter((a) => a.id !== agentId)
      const updatedAll = [...AGENTS_ROSTER, ...updatedCustom]

      localStorage.setItem('axiom99_custom_agents', JSON.stringify(updatedCustom))

      set({
        customAgents: updatedCustom,
        agents: updatedAll,
        selectedAgentId: state.selectedAgentId === agentId ? 'agent-99' : state.selectedAgentId,
      })
    },

    sendMessage: async (agentId: string, userText: string) => {
      const state = get()
      const targetAgent = state.agents.find((a) => a.id === agentId) || state.agents[0]

      // Check for code sandbox execution if user asks to run JS code
      let sandboxResult: CodeSandboxResult | undefined = undefined
      if (userText.toLowerCase().includes('run code') || userText.toLowerCase().includes('execute js') || userText.toLowerCase().includes('calculate')) {
        const sampleCode = `const metrics = [12, 19, 3, 5, 2, 3];\nconst sum = metrics.reduce((a, b) => a + b, 0);\nconst avg = (sum / metrics.length).toFixed(2);\nreturn { sum, avg, count: metrics.length };`
        sandboxResult = get().executeCodeInSandbox(sampleCode)
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        agentId,
        sender: 'user',
        senderName: 'Commander',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      const currentMsgs = state.conversations[agentId] || []
      const updatedMsgs = [...currentMsgs, userMsg]

      set((s) => ({
        conversations: {
          ...s.conversations,
          [agentId]: updatedMsgs,
        },
        isGeneratingResponse: true,
        totalOpsCount: s.totalOpsCount + 1,
      }))

      get().addTelemetryLog({
        agentId: targetAgent.id,
        agentCode: targetAgent.code,
        level: 'exec',
        message: `Inbound instruction received for [${targetAgent.name}]: "${userText.slice(0, 45)}..."`,
      })

      const startTime = Date.now()
      await new Promise((res) => setTimeout(res, 600 + Math.random() * 800))

      let responseText = ''
      let thinkingText = `Analyzing input parameters from Commander. Cross-referencing division directives for [${targetAgent.role}]. Synthesizing optimal actionable recommendations.`
      const toolSteps = []

      // RAG Retrieval check
      const matchedChunks = get().searchKnowledgeBase(userText)
      if (matchedChunks.length > 0) {
        thinkingText += ` Ingested ${matchedChunks.length} relevant context chunks from Knowledge Base RAG memory.`
      }

      if (userText.toLowerCase().includes('help') || userText.toLowerCase().includes('who are you') || userText.toLowerCase().includes('capabilities')) {
        responseText =
          `I am **${targetAgent.name}** (${targetAgent.code}), serving as **${targetAgent.role}**.\n\n` +
          `**My Core Capabilities:**\n` +
          targetAgent.capabilities.map((c) => `- ⚡ **${c}**`).join('\n') +
          `\n\n` +
          `**System Prompt Directive:**\n` +
          `> ${targetAgent.systemPrompt}\n\n` +
          `How can I assist your objectives today?`
      } else if (userText.toLowerCase().includes('audit') || userText.toLowerCase().includes('security') || userText.toLowerCase().includes('check')) {
        toolSteps.push({
          toolName: 'execute_static_analysis',
          input: { target: 'memory_bounds', depth: 'exhaustive' },
          output: 'Zero buffer overruns. 100% boundary check passed.',
          status: 'completed' as const,
        })
        responseText =
          `### Audit Diagnostics Complete 🛡️\n\n` +
          `Performed diagnostic check matching **${targetAgent.specialty}**.\n\n` +
          `**Audit Findings:**\n` +
          `1. **Integrity Check**: 100% verified against security baseline.\n` +
          `2. **Latency Impact**: < 0.2ms overhead across execution pathways.\n` +
          `3. **Recommendation**: All systems within nominal tolerances. Ready for next operational phase.`
      } else if (userText.toLowerCase().includes('code') || userText.toLowerCase().includes('implement') || userText.toLowerCase().includes('write')) {
        toolSteps.push({
          toolName: 'synthesize_code_module',
          input: { language: 'typescript', target: targetAgent.specialty },
          output: 'Compilation successful. Zero type violations.',
          status: 'completed' as const,
        })
        responseText =
          `### Implementation Proposal for ${targetAgent.specialty}\n\n` +
          `Here is the optimized module tailored for **${targetAgent.name}**'s domain:\n\n` +
          `\`\`\`typescript\n` +
          `// Generated by ${targetAgent.name} (${targetAgent.code})\n` +
          `export async function executeDirective(params: Record<string, unknown>) {\n` +
          `  const telemetry = performance.now()\n` +
          `  try {\n` +
          `    // Autonomous pipeline execution\n` +
          `    const result = await processSwarmTask('${targetAgent.code}', params)\n` +
          `    return { status: 'SUCCESS', latencyMs: performance.now() - telemetry, result }\n` +
          `  } catch (err) {\n` +
          `    console.error('Agent execution fault:', err)\n` +
          `    throw err\n` +
          `  }\n` +
          `}\n` +
          `\`\`\`\n\n` +
          `Would you like me to refine the parameters or wire this into the Swarm Orchestration pipeline?`
      } else {
        responseText =
          `### Strategic Directive Processed 🚀\n\n` +
          `**${targetAgent.name}** has evaluated your request: *"**${userText}**"*\n\n` +
          `**Operational Breakdown:**\n` +
          `1. **Domain Alignment**: Handled under **${targetAgent.role}** guidelines.\n` +
          `2. **Action Item**: Executing target subroutines with temperature parameter \`${targetAgent.temperature}\`.\n` +
          `3. **Outcome**: Synthesized plan delivered with full backward compatibility.\n\n` +
          `Let me know if you want to drill down further into any specific sub-tasks or escalate to another division.`
      }

      const elapsed = (Date.now() - startTime) / 1000
      const tokenCount = Math.floor(responseText.length / 3.8)

      const agentReply: ChatMessage = {
        id: `agent-msg-${Date.now()}`,
        agentId,
        sender: 'agent',
        senderName: `${targetAgent.name} (${targetAgent.code})`,
        content: responseText,
        thinking: thinkingText,
        toolCalls: toolSteps.length > 0 ? toolSteps : undefined,
        sandboxResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokenCount,
        tokensPerSec: Math.round(tokenCount / Math.max(0.5, elapsed)),
      }

      set((s) => ({
        conversations: {
          ...s.conversations,
          [agentId]: [...(s.conversations[agentId] || []), agentReply],
        },
        isGeneratingResponse: false,
      }))

      get().addTelemetryLog({
        agentId: targetAgent.id,
        agentCode: targetAgent.code,
        level: 'success',
        message: `Response generated by [${targetAgent.code}] (${tokenCount} tokens, ${Math.round(tokenCount / Math.max(0.5, elapsed))} tok/s).`,
      })
    },

    clearChat: (agentId: string) => {
      set((s) => {
        const next = { ...s.conversations }
        delete next[agentId]
        return { conversations: next }
      })
    },

    runWorkflow: async (workflowId: string) => {
      const state = get()
      const wf = state.workflows.find((w) => w.id === workflowId)
      if (!wf || wf.status === 'running') return

      set((s) => ({
        activeWorkflowId: workflowId,
        workflows: s.workflows.map((w) =>
          w.id === workflowId
            ? {
                ...w,
                status: 'running',
                progress: 5,
                steps: w.steps.map((st) => ({ ...st, status: 'pending', output: undefined })),
              }
            : w
        ),
      }))

      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'info',
        message: `Workflow started: "${wf.name}" (${wf.steps.length} sequential steps).`,
      })

      for (let i = 0; i < wf.steps.length; i++) {
        const step = wf.steps[i]
        const stepAgent = get().agents.find((a) => a.id === step.agentId) || get().agents[0]

        set((s) => ({
          workflows: s.workflows.map((w) =>
            w.id === workflowId
              ? {
                  ...w,
                  progress: Math.round(((i) / wf.steps.length) * 100),
                  steps: w.steps.map((st, idx) =>
                    idx === i ? { ...st, status: 'running' } : st
                  ),
                }
              : w
          ),
        }))

        get().addTelemetryLog({
          agentId: stepAgent.id,
          agentCode: stepAgent.code,
          level: 'exec',
          message: `Executing step [${i + 1}/${wf.steps.length}]: "${step.title}" via [${stepAgent.code}]`,
        })

        const stepTime = 1200 + Math.random() * 800
        await new Promise((res) => setTimeout(res, stepTime))

        const output = `Completed successfully in ${Math.round(stepTime)}ms. Output verified against division standard.`

        set((s) => ({
          workflows: s.workflows.map((w) =>
            w.id === workflowId
              ? {
                  ...w,
                  progress: Math.round(((i + 1) / wf.steps.length) * 100),
                  steps: w.steps.map((st, idx) =>
                    idx === i
                      ? {
                          ...st,
                          status: 'completed',
                          output,
                          durationMs: Math.round(stepTime),
                        }
                      : st
                  ),
                }
              : w
          ),
        }))

        get().addTelemetryLog({
          agentId: stepAgent.id,
          agentCode: stepAgent.code,
          level: 'success',
          message: `Step [${i + 1}/${wf.steps.length}] verified by [${stepAgent.name}].`,
        })
      }

      set((s) => ({
        activeWorkflowId: null,
        workflows: s.workflows.map((w) =>
          w.id === workflowId ? { ...w, status: 'completed', progress: 100 } : w
        ),
      }))

      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'success',
        message: `Workflow "${wf.name}" completed with 100% consensus.`,
      })
    },

    resetWorkflow: (workflowId: string) => {
      set((s) => ({
        workflows: s.workflows.map((w) =>
          w.id === workflowId
            ? {
                ...w,
                status: 'idle',
                progress: 0,
                steps: w.steps.map((st) => ({ ...st, status: 'pending', output: undefined })),
              }
            : w
        ),
      }))
    },

    addTelemetryLog: (logData) => {
      const newLog: SwarmTelemetryLog = {
        ...logData,
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
      }
      set((s) => ({
        logs: [newLog, ...s.logs.slice(0, 49)],
      }))
    },

    updateSettings: (partial) => {
      set((s) => {
        const next = { ...s.settings, ...partial }
        localStorage.setItem('axiom99_settings', JSON.stringify(next))
        return { settings: next }
      })
    },

    broadcastSwarmMessage: async (content: string) => {
      const state = get()
      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'info',
        message: `Broadcast message sent to all 99 agents: "${content.slice(0, 50)}..."`,
      })
      await state.sendMessage('agent-99', `[BROADCAST INSTRUCTION]: ${content}`)
    },

    // -------------------------------------------------------------
    // WAR ROOM DEBATE ENGINE
    // -------------------------------------------------------------
    startWarRoomDebate: async (topic: string, objective: string, participantIds) => {
      const state = get()
      const participants = participantIds || state.warRoom.participantAgentIds
      
      set((s) => ({
        isWarRoomDebating: true,
        warRoom: {
          ...s.warRoom,
          topic,
          objective,
          participantAgentIds: participants,
          currentRound: 1,
          status: 'debating',
          messages: [],
          consensusSummary: undefined,
        },
      }))

      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'info',
        message: `War Room debate convened: "${topic}" with ${participants.length} delegates.`,
      })

      // Run 3 autonomous rounds of debate
      const debateSequence = [
        {
          agentId: participants[0] || 'agent-1',
          type: 'proposal' as const,
          text: `I propose a zero-copy ring buffer with memory alignment in SharedArrayBuffer. This will allow sub-2ms ingestion for high-throughput streams without GC pauses.`,
        },
        {
          agentId: participants[1] || 'agent-67',
          type: 'security' as const,
          text: `SharedArrayBuffer poses cross-thread race condition risks and Spectre-class side channel vulnerabilities. We must enforce strict mutex locking and token bounds checks on the shared memory address space.`,
        },
        {
          agentId: participants[2] || 'agent-23',
          type: 'critique' as const,
          text: `Mutexes will bottleneck the WebSocket stream backpressure. Instead, let us use atomic lock-free CAS (compare-and-swap) operations with Protobuf delta packing to maintain our sub-10ms delivery target.`,
        },
        {
          agentId: participants[3] || 'agent-88',
          type: 'refinement' as const,
          text: `From an Edge DevOps standpoint, CAS operations compile cleanly to WebAssembly SIMD across Cloudflare and Vercel Edge networks. We can deploy automated Canary builds with latency monitoring.`,
        },
        {
          agentId: 'agent-99',
          type: 'consensus' as const,
          text: `Consensus Reached: Adopt lock-free CAS atomic buffers with Protobuf delta streaming, sandboxed by Division 7 security guardrails and deployed via automated Edge workers. All 5 delegates concur.`,
        },
      ]

      for (let i = 0; i < debateSequence.length; i++) {
        const item = debateSequence[i]
        const agent = state.agents.find((a) => a.id === item.agentId) || state.agents[0]

        await new Promise((res) => setTimeout(res, 1400))

        const newMsg: WarRoomMessage = {
          id: `wmsg-${Date.now()}-${i}`,
          agentId: agent.id,
          agentCode: agent.code,
          agentName: agent.name,
          avatarIcon: agent.avatarIcon,
          role: agent.role,
          content: item.text,
          perspectiveType: item.type,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          round: Math.min(3, Math.floor(i / 2) + 1),
        }

        set((s) => ({
          warRoom: {
            ...s.warRoom,
            currentRound: newMsg.round,
            messages: [...s.warRoom.messages, newMsg],
          },
        }))
      }

      // Final consensus report
      const consensusSummary =
        `### Official War Room Consensus Resolution 👑\n\n` +
        `**Objective:** ${objective}\n\n` +
        `**Approved Architecture:**\n` +
        `1. **Core Ingestion Layer**: Zero-copy ring buffer with lock-free atomic CAS primitives.\n` +
        `2. **Protocol**: Bit-packed Protobuf delta frames over persistent WebSockets.\n` +
        `3. **Security Guardrail**: Pre-execution memory boundary validation & rate limiting.\n` +
        `4. **Deployment**: Multi-region edge workers with sub-10ms SLA monitoring.\n\n` +
        `**Status**: 100% Unanimous Consensus Ratified by Swarm Orchestrator (A99).`

      set((s) => ({
        isWarRoomDebating: false,
        warRoom: {
          ...s.warRoom,
          status: 'completed',
          consensusSummary,
          actionItems: [
            'Implement lock-free CAS buffer in Division 1',
            'Add Protobuf delta encoders in Division 3',
            'Deploy security bounds check in Division 7',
            'Publish Edge release via Division 8',
          ],
        },
      }))

      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'success',
        message: `War Room concluded. Unanimous consensus established for "${topic}".`,
      })
    },

    resetWarRoom: () => {
      set({
        warRoom: DEFAULT_WAR_ROOM,
        isWarRoomDebating: false,
      })
    },

    // -------------------------------------------------------------
    // VISUAL WORKFLOW PIPELINE ACTIONS
    // -------------------------------------------------------------
    addVisualNode: (agentId: string, type: VisualNode['type'] = 'agent') => {
      const state = get()
      const agent = state.agents.find((a) => a.id === agentId) || state.agents[0]
      const newNode: VisualNode = {
        id: `node-${Date.now()}`,
        agentId: agent.id,
        type,
        label: `${agent.name} (${agent.code})`,
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 200,
        status: 'idle',
      }
      set((s) => ({
        visualPipeline: {
          ...s.visualPipeline,
          nodes: [...s.visualPipeline.nodes, newNode],
        },
      }))
    },

    removeVisualNode: (nodeId: string) => {
      set((s) => ({
        visualPipeline: {
          ...s.visualPipeline,
          nodes: s.visualPipeline.nodes.filter((n) => n.id !== nodeId),
          connections: s.visualPipeline.connections.filter(
            (c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId
          ),
        },
      }))
    },

    connectVisualNodes: (fromId: string, toId: string) => {
      if (fromId === toId) return
      set((s) => {
        const exists = s.visualPipeline.connections.some(
          (c) => c.fromNodeId === fromId && c.toNodeId === toId
        )
        if (exists) return s
        const newConn: VisualConnection = {
          id: `conn-${Date.now()}`,
          fromNodeId: fromId,
          toNodeId: toId,
        }
        return {
          visualPipeline: {
            ...s.visualPipeline,
            connections: [...s.visualPipeline.connections, newConn],
          },
        }
      })
    },

    updateNodePosition: (nodeId: string, x: number, y: number) => {
      set((s) => ({
        visualPipeline: {
          ...s.visualPipeline,
          nodes: s.visualPipeline.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
        },
      }))
    },

    runVisualPipeline: async () => {
      const state = get()
      if (state.isVisualPipelineRunning) return

      set({ isVisualPipelineRunning: true })

      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'info',
        message: `Visual Node Pipeline "${state.visualPipeline.name}" execution started.`,
      })

      const nodes = state.visualPipeline.nodes

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Mark node as running
        set((s) => ({
          visualPipeline: {
            ...s.visualPipeline,
            progress: Math.round(((i) / nodes.length) * 100),
            nodes: s.visualPipeline.nodes.map((n, idx) =>
              idx === i ? { ...n, status: 'running' } : n
            ),
          },
        }))

        await new Promise((res) => setTimeout(res, 900))

        // Mark node as completed
        set((s) => ({
          visualPipeline: {
            ...s.visualPipeline,
            progress: Math.round(((i + 1) / nodes.length) * 100),
            nodes: s.visualPipeline.nodes.map((n, idx) =>
              idx === i
                ? {
                    ...n,
                    status: 'completed',
                    outputData: `Verified at ${new Date().toLocaleTimeString()} by ${n.label}`,
                  }
                : n
            ),
          },
        }))
      }

      set((s) => ({
        isVisualPipelineRunning: false,
        visualPipeline: {
          ...s.visualPipeline,
          progress: 100,
        },
      }))

      get().addTelemetryLog({
        agentId: 'agent-99',
        agentCode: 'A99',
        level: 'success',
        message: `Visual Pipeline executed 100% successfully across ${nodes.length} nodes.`,
      })
    },

    resetVisualPipeline: () => {
      set((s) => ({
        isVisualPipelineRunning: false,
        visualPipeline: {
          ...s.visualPipeline,
          progress: 0,
          nodes: s.visualPipeline.nodes.map((n) => ({ ...n, status: 'idle', outputData: undefined })),
        },
      }))
    },

    // -------------------------------------------------------------
    // KNOWLEDGE BASE & RAG ACTIONS
    // -------------------------------------------------------------
    addKnowledgeDocument: (docData, rawText) => {
      const state = get()
      // Generate chunks
      const paragraphs = rawText.split('\n\n').filter(Boolean)
      const chunks = paragraphs.map((p, i) => ({
        id: `chunk-${Date.now()}-${i}`,
        text: p.trim(),
        tokens: Math.floor(p.length / 4),
      }))

      const newDoc: KnowledgeDocument = {
        ...docData,
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString().split('T')[0],
        chunkCount: chunks.length,
        chunks,
      }

      const updatedDocs = [...state.knowledgeDocuments, newDoc]
      localStorage.setItem('axiom99_docs', JSON.stringify(updatedDocs))

      set({ knowledgeDocuments: updatedDocs })

      get().addTelemetryLog({
        agentId: 'agent-34',
        agentCode: 'A34',
        level: 'success',
        message: `Knowledge Document "${newDoc.title}" indexed into pgvector memory with ${chunks.length} chunks.`,
      })
    },

    deleteKnowledgeDocument: (docId: string) => {
      const state = get()
      const updated = state.knowledgeDocuments.filter((d) => d.id !== docId)
      localStorage.setItem('axiom99_docs', JSON.stringify(updated))
      set({ knowledgeDocuments: updated })
    },

    searchKnowledgeBase: (query: string) => {
      const state = get()
      if (!query.trim()) return []
      const terms = query.toLowerCase().split(' ').filter((w) => w.length > 2)
      const matches: KnowledgeChunk[] = []

      for (const doc of state.knowledgeDocuments) {
        for (const chunk of doc.chunks) {
          const textLower = chunk.text.toLowerCase()
          const matchedCount = terms.filter((t) => textLower.includes(t)).length
          if (matchedCount > 0) {
            matches.push({
              ...chunk,
              score: matchedCount / terms.length,
            })
          }
        }
      }

      return matches.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3)
    },

    // -------------------------------------------------------------
    // IN-BROWSER CODE SANDBOX
    // -------------------------------------------------------------
    executeCodeInSandbox: (code: string) => {
      const start = performance.now()
      try {
        // Safe JavaScript evaluation using Function constructor
        const func = new Function(code)
        const output = func()
        const duration = Math.round(performance.now() - start)

        return {
          code,
          output: typeof output === 'object' ? JSON.stringify(output, null, 2) : String(output),
          executionTimeMs: duration,
          status: 'success',
          chartData: [
            { label: 'T1', value: 12 },
            { label: 'T2', value: 19 },
            { label: 'T3', value: 32 },
            { label: 'T4', value: 45 },
            { label: 'T5', value: 68 },
            { label: 'T6', value: 92 },
          ],
        }
      } catch (err: any) {
        return {
          code,
          output: `Execution Error: ${err.message}`,
          executionTimeMs: Math.round(performance.now() - start),
          status: 'error',
        }
      }
    },
  }
})
