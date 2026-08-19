<div align="center">

# 🕹️ Axiom99 // NexusWeb Console
### *The Next-Generation Open-Source Browser-Native 3D Game Engine & Console*

[![CI](https://github.com/ghouseahmed226-debug/Axiom99/actions/workflows/ci.yml/badge.svg)](https://github.com/ghouseahmed226-debug/Axiom99/actions/workflows/ci.yml)
[![WebGPU Ready](https://img.shields.io/badge/WebGPU-Enabled-6c47ff?style=for-the-badge&logo=webassembly)](https://github.com/ghouseahmed226-debug/Axiom99)
[![Three.js](https://img.shields.io/badge/Three.js-0.165-0080ff?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![React 18](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Installable-00c853?style=for-the-badge&logo=pwa)](https://github.com/ghouseahmed226-debug/Axiom99)
[![Chrome Extension](https://img.shields.io/badge/Extension-MV3-ffd600?style=for-the-badge&logo=googlechrome)](https://github.com/ghouseahmed226-debug/Axiom99)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Play instantly in any modern browser. Zero downloads. Sub-16ms latency. AI-driven gameplay.</b>
</p>

</div>

---

## 🌌 Overview

**Axiom99 (NexusWeb)** is an ultra-performant, open-source, browser-based gaming console and engine. Architected to run anywhere from low-tier mobile devices to high-end WebGPU workstations, Axiom99 marries real-time spatial networking, high-performance 3D rendering, and predictive machine learning models into a unified monorepo.

Developed and orchestrated through the **Swarm 99-Agent Development Studio Architecture**.

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |     NexusWeb Browser Client / PWA     |
                                  |   (Three.js + R3F + Rapier WASM)      |
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
        +----------------------------------+                     +----------------------------------+
        |   Firebase Realtime Data Hose    |                     |   Supabase Persistent Layer      |
        |  - Sub-16ms Delta Position Sync  |                     |  - PostgreSQL 16 + RLS           |
        |  - Bit-packed Input Frames       |                     |  - pgvector (LLM Memory)         |
        |  - Ephemeral Session State       |                     |  - Profiles, Wallets, Catalog    |
        +----------------------------------+                     +----------------------------------+
                         ^                                                         ^
                         |                                                         |
                         +----------------------------+----------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |       Python AI & Analytics API       |
                                  |   (FastAPI + XGBoost + IsoForest)     |
                                  |  - Skill-Based Matchmaking (SBMM)     |
                                  |  - Telemetry Anti-Cheat Anomaly Engine|
                                  |  - LLM Quest & NPC Generator          |
                                  +---------------------------------------+
```

---

## 🤖 The 99-Agent Division Roster

The entire codebase is partitioned across 9 specialized squads (11 agents each):

| Division | Squad Name | Mission & Key Directives | Core Agents |
|---|---|---|---|
| **Div 1** | **Core Engine & Graphics** | 60FPS+ WebGPU/WebGL2 rendering, LOD, draw call batching | `A1` WebGPU Architect, `A4` BufferGeometry Optimizer, `A9` WASM Jolt Physics |
| **Div 2** | **React & Extension** | Cyberpunk HUD, PWA manifest, Chrome MV3 service worker | `A12` PWA Architect, `A15` Service Worker Dev, `A19` R3F Bridge |
| **Div 3** | **Firebase Real-Time** | Sub-16ms multiplayer state sync, bit-packed inputs | `A23` WebSockets Lead, `A27` Client-Prediction, `A31` Lag Compensation |
| **Div 4** | **Supabase Metagame** | PostgreSQL DDL, strict RLS, pgvector LLM memory | `A34` Schema Designer, `A38` RLS Enforcer, `A42` Supabase Auth |
| **Div 5** | **Data & XGBoost** | Predictive ELO matchmaking, Isolation Forest anti-cheat | `A45` SBMM Modeler, `A49` Anti-Cheat Lead, `A54` Data Pipeline |
| **Div 6** | **LLM & Gameplay AI** | Procedural quests, dynamic NPC cognitive loops | `A56` Prompt Pipeline, `A61` NPC Loop Engineer, `A65` Toxicity Filter |
| **Div 7** | **Security Squad** | Memory injection prevention, input sanitization, rate limits | `A67` WASM Obfuscator, `A72` Memory Shield, `A77` Rate-Limiter |
| **Div 8** | **DevOps & CI/CD** | Automated GitHub Actions, Cloudflare edge, Docker containerization | `A78` Git Strategy, `A83` Actions Automator, `A88` Edge Manager |
| **Div 9** | **Open-Source & Virality** | Community growth, interactive documentation, issue triage | `A89` README Architect, `A94` Contributor Lead, `A99` Discord Bot |

---

## ⚡ Key Features

- **🎮 Dual Renderer Pipeline**: Adaptive WebGPU detection with automatic WebGL2 fallback.
- **🏎️ Fixed 64Hz Physics Loop**: Rapier WASM physics simulation with accumulator substepping.
- **🌐 Ephemeral Spatial Hose**: 42-byte bit-packed input frames synced over Firebase Realtime DB.
- **🔒 Enterprise Security**: 100% Row-Level Security (RLS) enforcement on Supabase PostgreSQL.
- **🧠 Predictive AI Stack**:
  - **SBMM Engine**: XGBoost regressor clustering players within $\pm 150$ ELO bands.
  - **Anti-Cheat Engine**: Isolation Forest anomaly scoring detecting spinbots and speedhacks.
  - **LLM Memory Engine**: `pgvector` IVFFlat indexing for dynamic NPC quest memory.
- **📱 PWA & Extension**: Fullscreen landscape installable PWA + Chrome Manifest V3 popup.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: $\ge 18.0.0$
- **npm**: $\ge 10.0.0$
- **Python**: $\ge 3.11$
- **Git**

### 1. Clone & Bootstrap
```bash
git clone https://github.com/ghouseahmed226-debug/Axiom99.git
cd Axiom99

# Run automated bootstrap
./setup.sh
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and supply your Firebase & Supabase API keys
```

### 3. Start Development Servers
```bash
# Terminal 1: Launch Web Console (PWA)
cd apps/web
npm run dev
# Open http://localhost:3000

# Terminal 2: Launch AI Engine
cd apps/api
uvicorn src.main:app --reload --port 8000
# Docs at http://localhost:8000/docs
```

---

## 🧪 Testing Suite

```bash
# Run Python AI & ML Unit Tests
python -m pytest apps/api/tests -v

# Run Typecheck across Monorepo
npm run typecheck
```

---

## 📦 Project Structure

```
Axiom99/
├── .github/workflows/      # Automated CI/CD (lint, test, build, deploy)
├── apps/
│   ├── api/                # FastAPI backend + ML models (SBMM, Anti-Cheat, Quests)
│   ├── extension/          # Chrome MV3 Extension
│   ├── supabase/           # Migrations, RLS policies, pgvector & seed fixtures
│   └── web/                # React 18 + Three.js + R3F + Tailwind Web Console
├── packages/
│   ├── physics-wasm/       # Custom physics bindings
│   ├── shared-types/       # Universal TypeScript interfaces
│   └── ui-kit/             # Cyberpunk HUD components
├── database.rules.json     # Firebase Realtime security rules
├── setup.sh                # Instant setup script
└── turbo.json              # Turborepo build pipeline
```

---

## 📡 API Reference

### 1. Anti-Cheat Telemetry Verification
`POST /v1/anticheat/verify`
```json
{
  "uid": "usr_d3b07384",
  "session_id": "session_7fa91c8e",
  "tick": 14890,
  "x": 142.85, "y": 12.0, "z": -482.11,
  "velocity_magnitude": 6.84,
  "heading_delta": 0.045,
  "hs_ratio_session": 0.38,
  "reaction_ms": 138.0
}
```

### 2. Skill-Based Matchmaking Clustering
`POST /v1/matchmaking/cluster`
```json
{
  "players": [
    { "uid": "usr_1", "features": { "kd_ratio": 2.4, "win_rate_7d": 0.65 } },
    { "uid": "usr_2", "features": { "kd_ratio": 2.2, "win_rate_7d": 0.60 } }
  ],
  "lobby_size": 20
}
```

---

## 🤝 Contributing

We welcome contributions from game developers, 3D artists, and AI engineers!  
Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## 📬 Contact & Support

- **Lead Engineer / Author**: Ghouse Ahmed
- **Email**: [ghouseahmed226@gmail.com](mailto:ghouseahmed226@gmail.com)
- **Repository**: [https://github.com/ghouseahmed226-debug/Axiom99](https://github.com/ghouseahmed226-debug/Axiom99)

---

<div align="center">
  <sub>Built by the 99-Agent Swarm for Axiom99. MIT License.</sub>
</div>