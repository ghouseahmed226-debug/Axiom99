import React, { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_DIVISIONS } from '../../data/agentsRoster'

export default function KnowledgeBasePage() {
  const {
    knowledgeDocuments,
    addKnowledgeDocument,
    deleteKnowledgeDocument,
    searchKnowledgeBase,
  } = useAgentStore()

  const [title, setTitle] = useState('')
  const [divisionId, setDivisionId] = useState<any>('all')
  const [content, setContent] = useState('')
  const [testQuery, setTestQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    addKnowledgeDocument(
      {
        title,
        fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.md`,
        fileType: 'markdown',
        sizeBytes: content.length,
        assignedDivisionId: divisionId,
        summary: `Ingested document: ${title.slice(0, 45)}...`,
      },
      content
    )

    setTitle('')
    setContent('')
  }

  const handleTestSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!testQuery.trim()) return
    const results = searchKnowledgeBase(testQuery)
    setSearchResults(results)
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#21160b] via-[#2d1c0c] to-[#21160b] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-amber-300">
              VECTOR KNOWLEDGE BASE //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Agent Memory & Document RAG
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Ingest technical documentation, code guidelines, or specifications into high-dimensional vector memory so agents automatically ground their responses in your custom documents.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: INGESTION FORM */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4">
          <h3 className="text-xs font-bold font-mono text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-amber-400">📥</span> INGEST NEW KNOWLEDGE DOCUMENT
          </h3>

          <form onSubmit={handleIngest} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400">Document Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Telemetry Latency Benchmarks v2"
                required
                className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400">Assign Target Division</label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Divisions (Global Memory)</option>
                {AGENT_DIVISIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400">Document Content (Markdown / Text / Code) *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste technical specifications, API docs, code snippets, or protocols here. Paragraphs will be chunked automatically..."
                rows={6}
                required
                className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-600/25 hover:from-amber-500 hover:to-orange-500 transition"
            >
              Embed & Ingest Document 🧠
            </button>
          </form>
        </div>

        {/* RIGHT: SEARCH TESTER & DOCUMENT CATALOG */}
        <div className="lg:col-span-7 space-y-4">
          {/* SEMANTIC SEARCH TESTER */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-3">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-cyan-400">🔍</span> RAG RETRIEVAL TESTER
            </h3>

            <form onSubmit={handleTestSearch} className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Query memory (e.g. 'memory boundaries buffer limit')..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-4 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition"
              >
                Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">Matched Vector Chunks:</span>
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-2.5 text-xs font-mono text-cyan-200"
                  >
                    <div className="flex justify-between text-[10px] text-cyan-400 mb-1">
                      <span>Chunk #{i + 1} ({r.tokens} tokens)</span>
                      <span>Score: {Math.round((r.score || 1) * 100)}% Match</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CATALOG OF DOCUMENTS */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold font-mono text-white tracking-wider">
                INDEXED VECTOR DOCUMENTS ({knowledgeDocuments.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {knowledgeDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex items-start justify-between gap-3 hover:border-amber-500/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📄</span>
                      <h4 className="font-bold text-xs text-white">{doc.title}</h4>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-amber-400">
                        {doc.chunkCount} Chunks
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{doc.summary}</p>
                    <div className="text-[10px] font-mono text-slate-500">
                      File: {doc.fileName} • {doc.sizeBytes} bytes • Ingested {doc.uploadedAt}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteKnowledgeDocument(doc.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs transition"
                    title="Delete Document"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
