import React, { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { ProjectArtifactFile } from '../../types/agent'

export default function CodebaseArtifactsPage() {
  const { projectArtifact, updateArtifactFile } = useAgentStore()
  const [selectedFilePath, setSelectedFilePath] = useState(projectArtifact.files[0]?.path || '')
  const [viewMode, setViewMode] = useState<'editor' | 'diff'>('editor')

  const selectedFile: ProjectArtifactFile =
    projectArtifact.files.find((f) => f.path === selectedFilePath) || projectArtifact.files[0]

  const handleDownloadFile = () => {
    if (!selectedFile) return
    const blob = new Blob([selectedFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.name
    a.click()
  }

  const handleDownloadAllZip = () => {
    // Generate text bundle export
    const bundleContent = projectArtifact.files
      .map((f) => `// =================== FILE: ${f.path} ===================\n\n${f.content}`)
      .join('\n\n\n')

    const blob = new Blob([bundleContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectArtifact.name.toLowerCase().replace(/\s+/g, '_')}_bundle.ts`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0d1d2b] via-[#12283b] to-[#0d1d2b] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-cyan-300">
              SYNTHESIZED ARTIFACTS //
            </span>
            <h2 className="text-2xl font-bold text-white font-mono mt-1">
              Codebase Project Artifacts & Diff Explorer
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Inspect multi-file software scaffolds synthesized by swarm operatives, compare before/after code diffs, and download full deployment bundles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAllZip}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition flex items-center gap-2"
            >
              <span>📦</span>
              <span>Download Project Bundle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: FILE TREE EXPLORER */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono text-white tracking-wider">
              PROJECT REPOSITORY TREE
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {projectArtifact.files.length} Files
            </span>
          </div>

          <div className="space-y-1">
            {projectArtifact.files.map((file) => {
              const isSelected = file.path === selectedFilePath
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300'
                      : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{file.language === 'json' ? '⚙️' : '📄'}</span>
                    <span className="truncate">{file.path}</span>
                  </div>
                  {file.isModified && (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                      DIFF
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="border-t border-slate-800 pt-3 text-[11px] font-mono text-slate-500 space-y-1">
            <div>Author: Actions Automator (A88)</div>
            <div>Target: Edge Cloud Runtime</div>
          </div>
        </div>

        {/* RIGHT: CODE VIEWER & DIFF COMPARISON */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4 flex flex-col min-h-[520px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-cyan-400">📄 {selectedFile?.path}</span>
              <span className="text-slate-500">({selectedFile?.language})</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs font-mono">
                <button
                  onClick={() => setViewMode('editor')}
                  className={`px-3 py-1 rounded transition ${
                    viewMode === 'editor' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Code View
                </button>
                <button
                  onClick={() => setViewMode('diff')}
                  className={`px-3 py-1 rounded transition ${
                    viewMode === 'diff' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Diff Viewer
                </button>
              </div>

              <button
                onClick={handleDownloadFile}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-mono text-slate-300 hover:text-white transition"
              >
                💾 Save File
              </button>
            </div>
          </div>

          {/* EDITOR / DIFF DISPLAY */}
          <div className="flex-1 rounded-xl border border-slate-800 bg-[#080c16] p-4 overflow-auto font-mono text-xs leading-relaxed">
            {viewMode === 'editor' ? (
              <pre className="text-slate-200 whitespace-pre-wrap">{selectedFile?.content}</pre>
            ) : (
              <div className="space-y-4">
                <div className="text-[11px] text-slate-500 border-b border-slate-800 pb-1">
                  --- Original vs Synthesized Swarm Modifications +++
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-rose-400 font-bold">- Original Baseline:</span>
                    <pre className="bg-rose-950/20 border border-rose-500/20 p-3 rounded text-rose-300 whitespace-pre-wrap text-[11px]">
                      {selectedFile?.originalContent || '// No baseline modifications'}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold">+ Swarm Optimized:</span>
                    <pre className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded text-emerald-300 whitespace-pre-wrap text-[11px]">
                      {selectedFile?.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
