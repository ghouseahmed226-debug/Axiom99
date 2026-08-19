import { create } from 'zustand'
import {
  Agent,
  AgentDivisionId,
  ChatMessage,
  SwarmWorkflow,
  SwarmTelemetryLog,
  ApiSettings,
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
        agentId: 'agent-67', // Memory Shield Core
        title: 'Memory Boundary & Buffer Safety Check',
        description: 'Auditing WASM boundary memory buffers and pointer sanity.',
        status: 'pending',
      },
      {
        id: 'step-2',
        agentId: 'agent-38', // RLS Policy Enforcer
        title: 'Database Access & RLS Rule Verification',
        description: 'Evaluating PostgreSQL 16 row-level security policies and token validations.',
        status: 'pending',
      },
      {
        id: 'step-3',
        agentId: 'agent-49', // Anomaly Shield Lead
        title: 'Telemetry Anomaly & Exploit Pattern Scan',
        description: 'Running Isolation Forest heuristics on telemetry event streams.',
        status: 'pending',
      },
      {
        id: 'step-4',
        agentId: 'agent-88', // Actions Automator
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
        agentId: 'agent-99', // Swarm Orchestrator
        title: 'Objective Decomposition & Swarm Broadcast',
        description: 'Broadcasting objective vector to all 9 divisions with priority weightings.',
        status: 'pending',
      },
      {
        id: 'step-2',
        agentId: 'agent-56', // Prompt Synthesizer
        title: 'Recursive Sub-Prompt Compilation',
        description: 'Compiling few-shot prompts and deterministic constraints for target operatives.',
        status: 'pending',
      },
      {
        id: 'step-3',
        agentId: 'agent-61', // Agent Loop Engineer
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
        agentId: 'agent-1', // WebGPU Architect
        title: 'Compute Pipeline Benchmarking',
        description: 'Profiling GPU hardware tier capabilities and compute shader latency.',
        status: 'pending',
      },
      {
        id: 'step-2',
        agentId: 'agent-23', // WebSocket Stream Lead
        title: 'Protobuf Bit-Packing Calibration',
        description: 'Optimizing binary delta frame compression ratios for sub-10ms packet delivery.',
        status: 'pending',
      },
      {
        id: 'step-3',
        agentId: 'agent-78', // Edge Matrix Lead
        title: 'Edge Worker Routing Optimization',
        description: 'Testing CDN edge regional distribution and SSL termination timings.',
        status: 'pending',
      },
    ],
  },
]

interface AgentStoreState {
  // Agents State
  agents: Agent[]
  selectedAgentId: string
  selectedDivisionId: AgentDivisionId | 'all'
  searchQuery: string
  
  // Custom Agent Creation
  customAgents: Agent[]

  // Chat State
  conversations: Record<string, ChatMessage[]> // agentId -> messages
  isGeneratingResponse: boolean
  activeStreamingMessage: string

  // Workflows
  workflows: SwarmWorkflow[]
  activeWorkflowId: string | null

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
}

// Initial default welcome chat for key agents
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
        `How would you like to direct the swarm today? You can dispatch single agent queries, orchestrate multi-agent workflows, or configure new custom operatives.`,
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
  // Load saved custom agents or settings from localStorage if available
  const savedCustom = localStorage.getItem('axiom99_custom_agents')
  const initialCustom: Agent[] = savedCustom ? JSON.parse(savedCustom) : []
  
  const savedSettings = localStorage.getItem('axiom99_settings')
  const initialSettings: ApiSettings = savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS

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

      // Simulate realistic reasoning & tool execution
      const startTime = Date.now()
      await new Promise((res) => setTimeout(res, 600 + Math.random() * 800))

      // Generate intelligent context-aware response based on agent specialty
      let responseText = ''
      let thinkingText = `Analyzing input parameters from Commander. Cross-referencing division directives for [${targetAgent.role}]. Synthesizing optimal actionable recommendations.`
      const toolSteps = []

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

        // Mark step as running
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

        // Complete step
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

      // Mark workflow completed
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
        logs: [newLog, ...s.logs.slice(0, 49)], // keep last 50
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

      // Send to master coordinator
      await state.sendMessage('agent-99', `[BROADCAST INSTRUCTION]: ${content}`)
    },
  }
})
