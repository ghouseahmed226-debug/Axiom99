import React, { useState, useRef, useEffect } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { Agent } from '../../types/agent'

export default function AgentChatPage() {
  const {
    agents,
    selectedAgentId,
    selectAgent,
    conversations,
    sendMessage,
    isGeneratingResponse,
    clearChat,
  } = useAgentStore()

  const [inputPrompt, setInputPrompt] = useState('')
  const [agentSearch, setAgentSearch] = useState('')
  const [filterDivision, setFilterDivision] = useState<string>('all')
  const [isRecording, setIsRecording] = useState(false)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeAgent: Agent =
    agents.find((a) => a.id === selectedAgentId) || agents[0]

  const activeMessages = conversations[selectedAgentId] || []

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages, isGeneratingResponse])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputPrompt.trim() || isGeneratingResponse) return
    const text = inputPrompt
    setInputPrompt('')
    await sendMessage(selectedAgentId, text)
  }

  const handleQuickPrompt = (promptText: string) => {
    if (isGeneratingResponse) return
    sendMessage(selectedAgentId, promptText)
  }

  // Voice recognition (Speech-to-Text)
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser.')
      return
    }

    if (isRecording) {
      setIsRecording(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsRecording(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputPrompt(transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)

    recognition.start()
  }

  // Text-to-Speech playback
  const handleSpeakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingMsgId(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*#`_]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.05
    utterance.pitch = 0.95

    utterance.onend = () => setSpeakingMsgId(null)
    utterance.onerror = () => setSpeakingMsgId(null)

    setSpeakingMsgId(msgId)
    window.speechSynthesis.speak(utterance)
  }

  // Export chat transcript to Markdown
  const handleExportChat = () => {
    const md =
      `# Chat Transcript with ${activeAgent.name} (${activeAgent.code})\n` +
      `**Role:** ${activeAgent.role}\n` +
      `**Date:** ${new Date().toISOString()}\n\n` +
      activeMessages
        .map(
          (m) =>
            `### ${m.senderName} (${m.timestamp})\n\n${m.content}\n`
        )
        .join('\n---\n\n')

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${activeAgent.code}-${Date.now()}.md`
    a.click()
  }

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(agentSearch.toLowerCase())
    const matchesDiv =
      filterDivision === 'all' || a.divisionId === filterDivision
    return matchesSearch && matchesDiv
  })

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-slate-800 bg-[#0d121f] shadow-2xl">
      {/* LEFT AGENT SELECTOR PANEL */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-slate-800/80 bg-[#090d16]">
        {/* SEARCH & FILTERS */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={agentSearch}
              onChange={(e) => setAgentSearch(e.target.value)}
              placeholder="Search 99 agents..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            {agentSearch && (
              <button
                onClick={() => setAgentSearch('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-mono scrollbar-none">
            {['all', 'div-1', 'div-2', 'div-3', 'div-4', 'div-5', 'div-6', 'div-7', 'div-8', 'div-9', 'custom'].map(
              (d) => (
                <button
                  key={d}
                  onClick={() => setFilterDivision(d)}
                  className={`px-2 py-0.5 rounded uppercase font-semibold whitespace-nowrap transition ${
                    filterDivision === d
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {d === 'all' ? 'All (99)' : d.replace('div-', 'D')}
                </button>
              )
            )}
          </div>
        </div>

        {/* AGENTS SCROLL LIST */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredAgents.map((agent) => {
            const isSelected = agent.id === selectedAgentId
            return (
              <button
                key={agent.id}
                onClick={() => selectAgent(agent.id)}
                className={`w-full text-left p-3 flex items-start gap-3 transition ${
                  isSelected
                    ? 'bg-cyan-950/40 border-l-4 border-cyan-400'
                    : 'hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <span className="text-xl p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0">
                  {agent.avatarIcon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-cyan-400">
                      {agent.code}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1 rounded ${
                        agent.status === 'active'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      ● {agent.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-100 truncate mt-0.5">
                    {agent.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {agent.role}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#0a0e1a]">
        {/* ACTIVE AGENT TOP BAR */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0d121f] px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700/60">
              {activeAgent.avatarIcon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  [{activeAgent.code}]
                </span>
                <h3 className="font-bold text-sm text-white">
                  {activeAgent.name}
                </h3>
                <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
                  {activeAgent.model}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xl">
                {activeAgent.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChat}
              className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
              title="Export Conversation Markdown"
            >
              📄 Export
            </button>
            <button
              onClick={() => clearChat(activeAgent.id)}
              className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title="Clear current conversation"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* MESSAGES THREAD */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 max-w-md mx-auto">
              <span className="text-4xl p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                {activeAgent.avatarIcon}
              </span>
              <h4 className="font-bold text-lg text-white font-mono">
                Initiate Session with {activeAgent.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeAgent.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => handleQuickPrompt('What are your core capabilities and domain directives?')}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition"
                >
                  ⚡ List Capabilities
                </button>
                <button
                  onClick={() => handleQuickPrompt('Perform an operational health check on your system components.')}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition"
                >
                  🛡️ Run Health Check
                </button>
                <button
                  onClick={() => handleQuickPrompt('Synthesize an architectural implementation proposal for this project.')}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition"
                >
                  💻 Synthesize Code
                </button>
                <button
                  onClick={() => handleQuickPrompt('Run code calculation test in JavaScript sandbox')}
                  className="rounded-lg border border-indigo-500/40 bg-indigo-950/40 px-3 py-1 text-xs text-indigo-300 hover:border-indigo-400 transition"
                >
                  🧪 Code Sandbox Run
                </button>
              </div>
            </div>
          ) : (
            activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0 self-start">
                    {activeAgent.avatarIcon}
                  </span>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/20'
                      : 'bg-[#111728] border border-slate-800 text-slate-200'
                  }`}
                >
                  {/* MESSAGE SENDER & TIMESTAMP */}
                  <div className="flex items-center justify-between text-[11px] font-mono opacity-80 border-b border-white/10 pb-1.5">
                    <span className="font-semibold">{msg.senderName}</span>
                    <div className="flex items-center gap-2">
                      {msg.sender === 'agent' && (
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          className="hover:text-cyan-300 transition text-[11px]"
                          title="Read aloud"
                        >
                          {speakingMsgId === msg.id ? '🔊 Speaking...' : '🔈 Audio'}
                        </button>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* REASONING / THINKING STEP ACCORDION */}
                  {msg.thinking && (
                    <details className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-2 text-xs font-mono text-indigo-300">
                      <summary className="cursor-pointer font-bold text-[11px] text-indigo-400 select-none">
                        💡 Cognitive Reasoning Chain
                      </summary>
                      <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
                        {msg.thinking}
                      </p>
                    </details>
                  )}

                  {/* TOOL CALLS EXECUTION */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="space-y-1.5">
                      {msg.toolCalls.map((tc, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-slate-700 bg-slate-900/90 p-2 font-mono text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-cyan-400">
                            <span className="flex items-center gap-1 font-bold">
                              ⚙️ TOOL: {tc.toolName}
                            </span>
                            <span className="text-emerald-400">✓ COMPLETED</span>
                          </div>
                          {tc.output && (
                            <div className="text-[11px] text-slate-400 bg-black/40 p-1.5 rounded">
                              {tc.output}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CODE SANDBOX RESULT CARD */}
                  {msg.sandboxResult && (
                    <div className="rounded-xl border border-indigo-500/40 bg-slate-950/90 p-3 space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-indigo-400 text-[10px]">
                        <span className="font-bold">🧪 SANDBOX RUNNER RESULT</span>
                        <span className="text-emerald-400">✓ {msg.sandboxResult.executionTimeMs}ms</span>
                      </div>
                      <div className="bg-black/60 p-2 rounded text-emerald-300 text-[11px] whitespace-pre-wrap">
                        {msg.sandboxResult.output}
                      </div>
                      {msg.sandboxResult.chartData && (
                        <div className="space-y-1 pt-1 border-t border-slate-800">
                          <span className="text-[10px] text-slate-400">Inline Chart Telemetry:</span>
                          <div className="flex items-end gap-1.5 h-12 pt-2">
                            {msg.sandboxResult.chartData.map((d, idx) => (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                                <div
                                  className="w-full rounded-t bg-cyan-500"
                                  style={{ height: `${(d.value / 100) * 40}px` }}
                                />
                                <span className="text-[8px] text-slate-500">{d.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MESSAGE CONTENT */}
                  <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* TOKEN METRICS FOOTER */}
                  {msg.tokenCount && (
                    <div className="flex justify-end pt-1 text-[10px] font-mono text-slate-500">
                      <span>{msg.tokenCount} tokens {msg.tokensPerSec ? `(${msg.tokensPerSec} tok/s)` : ''}</span>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <span className="text-2xl p-1.5 rounded-lg bg-indigo-700 border border-indigo-600 shrink-0 self-start">
                    👨‍✈️
                  </span>
                )}
              </div>
            ))
          )}

          {isGeneratingResponse && (
            <div className="flex gap-3 justify-start">
              <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                {activeAgent.avatarIcon}
              </span>
              <div className="rounded-2xl border border-slate-800 bg-[#111728] p-4 text-xs font-mono text-cyan-400 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span>{activeAgent.name} is synthesizing reasoning loop...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM INPUT BOX */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0d121f]">
          {/* QUICK PROMPT CHIPS */}
          <div className="flex gap-2 overflow-x-auto pb-2 text-[11px]">
            <button
              onClick={() => handleQuickPrompt('Perform full system security audit')}
              className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 whitespace-nowrap transition"
            >
              🛡️ Security Audit
            </button>
            <button
              onClick={() => handleQuickPrompt('Write TypeScript implementation module')}
              className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 whitespace-nowrap transition"
            >
              💻 Write Code
            </button>
            <button
              onClick={() => handleQuickPrompt('Execute JS code sandbox calculation')}
              className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 whitespace-nowrap transition"
            >
              🧪 Run Code Sandbox
            </button>
          </div>

          <form onSubmit={handleSend} className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`rounded-xl px-3 py-2 text-sm border transition ${
                isRecording
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Voice Speech-to-Text Input"
            >
              🎙️
            </button>
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isRecording ? 'Listening... speak your prompt...' : `Send instruction to ${activeAgent.name} (${activeAgent.code})...`}
              disabled={isGeneratingResponse}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isGeneratingResponse}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition"
            >
              Dispatch ⚡
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
