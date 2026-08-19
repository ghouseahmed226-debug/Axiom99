import { Agent, AgentDivision } from '../types/agent'

export const AGENT_DIVISIONS: AgentDivision[] = [
  {
    id: 'div-1',
    name: 'Core Engine & Systems',
    code: 'DIV-1',
    description: 'High-performance systems architecture, compiler optimizations, kernel-level graphics, memory isolation.',
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    icon: '⚡',
    agentCount: 11,
  },
  {
    id: 'div-2',
    name: 'Interface & UX Systems',
    code: 'DIV-2',
    description: 'Cyberpunk HUD engineering, real-time reactive design, accessibility, client-side rendering bridges.',
    color: 'from-purple-500 to-indigo-600',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: '🖥️',
    agentCount: 11,
  },
  {
    id: 'div-3',
    name: 'Real-Time Data Streams',
    code: 'DIV-3',
    description: 'Ultra-low-latency WebSocket pipelines, delta synchronization, state interpolation, conflict resolution.',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: '🔄',
    agentCount: 11,
  },
  {
    id: 'div-4',
    name: 'Knowledge & Persistence',
    code: 'DIV-4',
    description: 'Relational & vector databases, pgvector LLM memories, schema migrations, strict security policies.',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: '🗄️',
    agentCount: 11,
  },
  {
    id: 'div-5',
    name: 'Intelligence & Predictive ML',
    code: 'DIV-5',
    description: 'XGBoost predictive modeling, anomaly detection engines, behavioral heuristics, ranking algorithms.',
    color: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: '🧠',
    agentCount: 11,
  },
  {
    id: 'div-6',
    name: 'LLM & Autonomous Reasoning',
    code: 'DIV-6',
    description: 'Chain-of-thought prompt orchestration, dynamic task decomposition, multi-modal synthesis, toxicity filtering.',
    color: 'from-violet-500 to-fuchsia-600',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    icon: '✨',
    agentCount: 11,
  },
  {
    id: 'div-7',
    name: 'Security & Guardrails',
    code: 'DIV-7',
    description: 'Input sanitization, memory boundary shields, prompt injection defense, cryptographic verification.',
    color: 'from-red-500 to-amber-600',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    icon: '🛡️',
    agentCount: 11,
  },
  {
    id: 'div-8',
    name: 'DevOps, Edge & Cloud',
    code: 'DIV-8',
    description: 'Edge worker orchestration, CI/CD automated deployment matrices, containerization, multi-region routing.',
    color: 'from-sky-500 to-cyan-600',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    icon: '🚀',
    agentCount: 11,
  },
  {
    id: 'div-9',
    name: 'Integrations & Open Source',
    code: 'DIV-9',
    description: 'API gateway connectors, developer documentation bots, ecosystem integrations, automated issue triage.',
    color: 'from-yellow-500 to-amber-600',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    icon: '🌐',
    agentCount: 11,
  },
]

// Generate 99 structured agents across 9 divisions
const divisionCodes = [
  { div: 'div-1', start: 1, end: 11, prefix: 'Core Engine' },
  { div: 'div-2', start: 12, end: 22, prefix: 'UX & Interface' },
  { div: 'div-3', start: 23, end: 33, prefix: 'Stream Sync' },
  { div: 'div-4', start: 34, end: 44, prefix: 'Database & Memory' },
  { div: 'div-5', start: 45, end: 55, prefix: 'Predictive ML' },
  { div: 'div-6', start: 56, end: 66, prefix: 'LLM Reasoning' },
  { div: 'div-7', start: 67, end: 77, prefix: 'Security Shield' },
  { div: 'div-8', start: 78, end: 88, prefix: 'DevOps & Edge' },
  { div: 'div-9', start: 89, end: 99, prefix: 'Integrations' },
]

const specializedAgents: Partial<Record<number, Partial<Agent>>> = {
  1: {
    name: 'WebGPU Architect',
    role: 'Lead Systems Engineer',
    specialty: 'Shader compilation & low-level hardware compute',
    avatarIcon: '⚡',
    description: 'Engineers zero-overhead compute pipelines, shader trees, and parallel data transforms.',
    capabilities: ['Compute Shaders', 'Memory Alignment', 'Hardware Acceleration'],
  },
  4: {
    name: 'Buffer Optimizer',
    role: 'Memory Specialist',
    specialty: 'Draw call batching & zero-copy geometry streaming',
    avatarIcon: '🧬',
    description: 'Optimizes raw binary array buffers, vertex layout caching, and compact data transfer.',
    capabilities: ['TypedArrays', 'Zero-Copy Buffers', 'Cache Locality'],
  },
  9: {
    name: 'WASM Physics Jolt',
    role: 'WASM Runtime Lead',
    specialty: 'C++ WebAssembly compilation and SIMD optimization',
    avatarIcon: '⚙️',
    description: 'Maintains compiled native WebAssembly math kernels and deterministic physics updates.',
    capabilities: ['WebAssembly SIMD', 'Memory Bounds', 'C++ Transpilation'],
  },
  12: {
    name: 'PWA Architect',
    role: 'Client App Lead',
    specialty: 'Progressive Web App lifecycle & offline service workers',
    avatarIcon: '📱',
    description: 'Manages offline storage strategies, manifest configuration, and background synchronization.',
    capabilities: ['Service Workers', 'Cache Storage API', 'Background Sync'],
  },
  19: {
    name: 'Reactive Bridge',
    role: 'UI Integration Engineer',
    specialty: 'Micro-frontend state bridges & event multiplexing',
    avatarIcon: '🌉',
    description: 'Bridges high-frequency backend events with smooth 60fps reactive React component renders.',
    capabilities: ['State Dispatch', 'Event Throttling', 'Reactive Streams'],
  },
  23: {
    name: 'WebSocket Stream Lead',
    role: 'Real-Time Protocol Lead',
    specialty: 'Binary frame streaming & sub-10ms heartbeat protocols',
    avatarIcon: '📡',
    description: 'Maintains persistent duplex multiplexed data sockets with adaptive reconnect backoffs.',
    capabilities: ['Protobuf Sync', 'Backpressure Handling', 'Heartbeat Loop'],
  },
  27: {
    name: 'Client-Side Predictor',
    role: 'Reconciliation Engineer',
    specialty: 'Lag compensation & state rewind interpolation',
    avatarIcon: '⏱️',
    description: 'Calculates predictive state positions with quadratic hermite curve interpolation.',
    capabilities: ['State Rollback', 'Clock Drift Sync', 'Dead Reckoning'],
  },
  34: {
    name: 'pgvector Architect',
    role: 'Vector Database Lead',
    specialty: 'High-dimensional HNSW vector index tuning & memory recall',
    avatarIcon: '🗄️',
    description: 'Architects semantic embeddings storage, cosine similarity filters, and associative agent memories.',
    capabilities: ['HNSW Indexing', 'pgvector', 'Semantic Retrieval'],
  },
  38: {
    name: 'RLS Policy Enforcer',
    role: 'Data Guard Specialist',
    specialty: 'Row-Level Security policies & cryptographic token validation',
    avatarIcon: '🔒',
    description: 'Enforces strict tenant isolation rules, JWT claims checks, and encrypted field columns.',
    capabilities: ['Row Level Security', 'JWT Auth', 'SQL Verification'],
  },
  45: {
    name: 'XGBoost Modeler',
    role: 'Data Science Lead',
    specialty: 'Gradient boosting classifiers & real-time telemetry scoring',
    avatarIcon: '📊',
    description: 'Trains and evaluates inference models for user clustering, skill-based ratings, and trend forecasting.',
    capabilities: ['Model Training', 'Hyperparameter Search', 'Inference APIs'],
  },
  49: {
    name: 'Anomaly Shield Lead',
    role: 'Telemetry Analyst',
    specialty: 'Isolation Forest anomaly detection & bot heuristic filters',
    avatarIcon: '🕵️',
    description: 'Scans live telemetry streams for outliers, statistical anomalies, and automated exploit signatures.',
    capabilities: ['Isolation Forest', 'Heuristic Scoring', 'Pattern Recognition'],
  },
  56: {
    name: 'Prompt Synthesizer',
    role: 'Cognitive Loop Lead',
    specialty: 'Recursive prompt decomposition & multi-step execution plans',
    avatarIcon: '✨',
    description: 'Decomposes complex requests into atomic prompt sequences with verification checkpoints.',
    capabilities: ['Chain of Thought', 'Few-Shot Synthesis', 'Dynamic Prompts'],
  },
  61: {
    name: 'Agent Loop Engineer',
    role: 'Autonomous Agent Specialist',
    specialty: 'ReAct reasoning loops & tool calling orchestration',
    avatarIcon: '🤖',
    description: 'Coordinates multi-turn tool execution, reflection cycles, and agent self-correction steps.',
    capabilities: ['ReAct Loop', 'Tool Calling', 'Error Correction'],
  },
  67: {
    name: 'Memory Shield Core',
    role: 'Security Architect',
    specialty: 'Buffer overflow mitigations & runtime sandboxing',
    avatarIcon: '🛡️',
    description: 'Validates memory bounds, prevents runtime script injection, and audits IPC message channels.',
    capabilities: ['Runtime Sandboxing', 'Memory Inspection', 'Injection Defense'],
  },
  78: {
    name: 'Edge Matrix Lead',
    role: 'Cloudflare / Vercel Edge Lead',
    specialty: 'Global edge function routing & cold start minimization',
    avatarIcon: '🌐',
    description: 'Optimizes global CDN caching layers, edge KV stores, and ultra-fast edge compute handlers.',
    capabilities: ['Vercel Edge', 'Cloudflare Workers', 'Sub-millisecond Routing'],
  },
  88: {
    name: 'Actions Automator',
    role: 'CI/CD Pipeline Lead',
    specialty: 'Automated test matrices & zero-downtime deployment pipelines',
    avatarIcon: '🚀',
    description: 'Manages GitHub Actions workflows, multi-stage docker builds, and automated semantic releases.',
    capabilities: ['GitHub Actions', 'Docker Matrix', 'Continuous Delivery'],
  },
  99: {
    name: 'Swarm Orchestrator',
    role: 'Supreme Swarm Coordinator',
    specialty: 'Inter-agent communication routing & consensus protocols',
    avatarIcon: '👑',
    description: 'The master coordination node overseeing all 99 agents across the 9 divisions of Axiom99.',
    capabilities: ['Swarm Consensus', 'Task Routing', 'Global State Sync'],
  },
}

export const AGENTS_ROSTER: Agent[] = []

// Build full 99 agents list
for (const divInfo of divisionCodes) {
  for (let i = divInfo.start; i <= divInfo.end; i++) {
    const override = specializedAgents[i] || {}
    const code = `A${i}`
    const name = override.name || `${divInfo.prefix} Specialist ${i}`
    const role = override.role || `Division ${divInfo.div.replace('div-', '')} Operative`
    const specialty = override.specialty || `Autonomous operations in ${divInfo.prefix.toLowerCase()}`
    const description =
      override.description ||
      `Autonomous AI agent specialized in ${divInfo.prefix.toLowerCase()} with high-precision reasoning capabilities.`
    const avatarIcon = override.avatarIcon || ['🤖', '⚡', '🧠', '🛡️', '📡', '💎', '🚀', '🔮', '🛰️'][i % 9]
    const capabilities = override.capabilities || ['Task Execution', 'Telemetry Logging', 'Swarm Sync']

    AGENTS_ROSTER.push({
      id: `agent-${i}`,
      code,
      name,
      divisionId: divInfo.div as any,
      role,
      specialty,
      description,
      systemPrompt: `You are ${name} (${code}), operating as ${role} in Division ${divInfo.div.replace('div-', '')} of the Axiom99 Swarm. Your core specialty is ${specialty}. Provide precise, high-density, analytical responses with concrete actionable steps and technical depth.`,
      avatarIcon,
      status: i % 7 === 0 ? 'idle' : i % 5 === 0 ? 'thinking' : 'active',
      taskCount: 42 + (i * 7) % 250,
      successRate: Number((98.2 + ((i * 3) % 18) / 10).toFixed(1)),
      avgLatencyMs: 45 + ((i * 13) % 120),
      temperature: 0.2 + ((i % 5) * 0.15),
      model: i % 3 === 0 ? 'Gemini 1.5 Pro' : i % 3 === 1 ? 'Claude 3.5 Sonnet' : 'GPT-4o',
      capabilities,
      isCustom: false,
    })
  }
}
