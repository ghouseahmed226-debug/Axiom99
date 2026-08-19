import React, { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'

export default function SettingsPage() {
  const { settings, updateSettings } = useAgentStore()

  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey)
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey)
  const [anthropicApiKey, setAnthropicApiKey] = useState(settings.anthropicApiKey)
  const [customEndpoint, setCustomEndpoint] = useState(settings.customEndpoint)
  const [defaultModel, setDefaultModel] = useState(settings.defaultModel)
  const [streamResponses, setStreamResponses] = useState(settings.streamResponses)
  const [enableSoundFx, setEnableSoundFx] = useState(settings.enableSoundFx)
  const [savedNotice, setSavedNotice] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      geminiApiKey,
      openaiApiKey,
      anthropicApiKey,
      customEndpoint,
      defaultModel,
      streamResponses,
      enableSoundFx,
    })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0d121f] via-[#111729] to-[#0d121f] p-6 shadow-2xl">
        <span className="inline-block rounded-full bg-slate-800 border border-slate-700 px-3 py-0.5 text-xs font-mono font-semibold text-slate-300">
          SYSTEM CONFIGURATION //
        </span>
        <h2 className="text-2xl font-bold text-white font-mono mt-1">
          Axiom99 Swarm & API Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure API credentials, target model providers (Gemini, OpenAI, Anthropic, Local Ollama), and telemetry preferences.
        </p>
      </div>

      {savedNotice && (
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <span>✓</span>
          <span>Configuration saved successfully to local persistent state!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* API PROVIDERS */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-cyan-400">🔑</span> LLM PROVIDER API KEYS
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300 flex justify-between">
                <span>Google Gemini API Key</span>
                <span className="text-slate-500 text-[10px]">Gemini 1.5 Pro / Flash</span>
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300 flex justify-between">
                <span>OpenAI API Key</span>
                <span className="text-slate-500 text-[10px]">GPT-4o / GPT-4o-mini</span>
              </label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300 flex justify-between">
                <span>Anthropic API Key</span>
                <span className="text-slate-500 text-[10px]">Claude 3.5 Sonnet</span>
              </label>
              <input
                type="password"
                value={anthropicApiKey}
                onChange={(e) => setAnthropicApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300 flex justify-between">
                <span>Local / Custom Endpoint (Ollama / vLLM)</span>
                <span className="text-slate-500 text-[10px]">e.g. http://localhost:11434/v1</span>
              </label>
              <input
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="http://localhost:11434/v1"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* DEFAULT PREFERENCES */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-indigo-400">⚙️</span> SWARM ENGINE PREFERENCES
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Default Model Engine</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Local / Ollama Llama-3">Local / Ollama Llama-3</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Stream Token Responses</div>
                <div className="text-[11px] text-slate-500">Live token emission simulation</div>
              </div>
              <input
                type="checkbox"
                checked={streamResponses}
                onChange={(e) => setStreamResponses(e.target.checked)}
                className="h-4 w-4 rounded accent-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition"
          >
            Save All Preferences 💾
          </button>
        </div>
      </form>
    </div>
  )
}
