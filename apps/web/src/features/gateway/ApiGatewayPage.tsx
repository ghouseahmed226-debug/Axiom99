import React, { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { ApiEndpointSpec } from '../../types/agent'

export default function ApiGatewayPage() {
  const { apiEndpoints, apiKeySimulated } = useAgentStore()
  const [selectedEndpointId, setSelectedEndpointId] = useState(apiEndpoints[0]?.id || '')
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'ts' | 'go'>('curl')
  const [isExecuting, setIsExecuting] = useState(false)
  const [testResponse, setTestResponse] = useState<string | null>(null)
  const [copiedNotice, setCopiedNotice] = useState(false)

  const activeEndpoint: ApiEndpointSpec =
    apiEndpoints.find((e) => e.id === selectedEndpointId) || apiEndpoints[0]

  const handleExecute = async () => {
    setIsExecuting(true)
    setTestResponse(null)
    await new Promise((r) => setTimeout(r, 600))
    setTestResponse(activeEndpoint.responseSample)
    setIsExecuting(false)
  }

  const getCodeSnippet = () => {
    const url = `https://axiom99.vercel.app${activeEndpoint.path}`
    if (selectedLang === 'curl') {
      return `curl -X ${activeEndpoint.method} "${url}" \\\n  -H "Authorization: Bearer ${apiKeySimulated}" \\\n  -H "Content-Type: application/json" \\\n  -d '${activeEndpoint.requestBodySample.replace(/\n/g, '')}'`
    }
    if (selectedLang === 'python') {
      return `import requests\n\nurl = "${url}"\nheaders = {\n    "Authorization": "Bearer ${apiKeySimulated}",\n    "Content-Type": "application/json"\n}\npayload = ${activeEndpoint.requestBodySample}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`
    }
    if (selectedLang === 'ts') {
      return `const response = await fetch("${url}", {\n  method: "${activeEndpoint.method}",\n  headers: {\n    "Authorization": "Bearer ${apiKeySimulated}",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify(${activeEndpoint.requestBodySample})\n});\nconst data = await response.json();\nconsole.log(data);`
    }
    return `package main\n\nimport (\n\t"bytes"\n\t"net/http"\n\t"io/ioutil"\n\t"fmt"\n)\n\nfunc main() {\n\turl := "${url}"\n\tpayload := []byte(\`${activeEndpoint.requestBodySample}\`)\n\treq, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))\n\treq.Header.Set("Authorization", "Bearer ${apiKeySimulated}")\n\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tbody, _ := ioutil.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet())
    setCopiedNotice(true)
    setTimeout(() => setCopiedNotice(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#121430] via-[#1a1c47] to-[#121430] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-indigo-300">
              PROGRAMMATIC API GATEWAY //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              External REST API & Webhook Gateway
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Trigger any of the 99 agents, war room deliberations, or multi-agent mission workflows programmatically from external applications, GitHub Actions, or microservices.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: ENDPOINTS LIST */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider">
              SWARM REST ENDPOINTS
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">HTTP/2 LIVE</span>
          </div>

          <div className="space-y-2">
            {apiEndpoints.map((ep) => {
              const isSelected = ep.id === selectedEndpointId
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpointId(ep.id)
                    setTestResponse(null)
                  }}
                  className={`w-full text-left p-3 rounded-xl font-mono text-xs transition ${
                    isSelected
                      ? 'bg-indigo-950/50 border border-indigo-500/40 text-indigo-200'
                      : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {ep.method}
                    </span>
                    <span className="font-bold text-white truncate">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ep.description}</p>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1 text-xs font-mono">
            <div className="text-slate-400 text-[10px]">Your API Secret Token:</div>
            <div className="text-cyan-400 font-bold truncate">{apiKeySimulated}</div>
          </div>
        </div>

        {/* RIGHT: TESTER & CODE SNIPPETS */}
        <div className="lg:col-span-8 space-y-4">
          {/* CODE SNIPPET EXPLORER */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono text-xs font-bold">
                  {activeEndpoint.method}
                </span>
                <span className="font-mono text-xs font-bold text-white">{activeEndpoint.path}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs font-mono">
                  {(['curl', 'python', 'ts', 'go'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-2.5 py-0.5 rounded uppercase font-bold transition ${
                        selectedLang === lang ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white transition"
                >
                  {copiedNotice ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>

            <pre className="rounded-xl border border-slate-800 bg-[#070a12] p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
              {getCodeSnippet()}
            </pre>

            {/* SEND TEST EXECUTION BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 transition"
              >
                {isExecuting ? 'Sending API Request...' : 'Send Live Request Test ⚡'}
              </button>
            </div>

            {/* RESPONSE VIEWER */}
            {testResponse && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>HTTP Response Status: <span className="text-emerald-400 font-bold">200 OK (52ms)</span></span>
                </div>
                <pre className="rounded-xl border border-emerald-500/30 bg-[#061410] p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {testResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
