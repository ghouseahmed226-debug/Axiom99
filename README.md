<div align="center">

# 🕹️ Axiom99 // NexusWeb Console
### *The Next-Generation Open-Source Browser-Native 3D Game Engine & Console*

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-PLAY_NOW-00ffcc?style=for-the-badge&logo=googlechrome&logoColor=black)](https://ghouseahmed226-debug.github.io/Axiom99/)
[![CI](https://github.com/ghouseahmed226-debug/Axiom99/actions/workflows/ci.yml/badge.svg)](https://github.com/ghouseahmed226-debug/Axiom99/actions/workflows/ci.yml)
[![Pages Deploy](https://github.com/ghouseahmed226-debug/Axiom99/actions/workflows/pages.yml/badge.svg)](https://github.com/ghouseahmed226-debug/Axiom99/actions/workflows/pages.yml)
[![Three.js](https://img.shields.io/badge/Three.js-0.165-0080ff?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![React 18](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

## 🌐 **[👉 CLICK HERE TO PLAY LIVE DEMO 👈](https://ghouseahmed226-debug.github.io/Axiom99/)**
### **Live URL**: `https://ghouseahmed226-debug.github.io/Axiom99/`

<p align="center">
  <b>Play instantly in any modern browser. Zero downloads. Sub-16ms latency. AI-driven gameplay.</b>
</p>

</div>

---

## 🎮 Playable 3D Game Cartridges

| Cartridge | Tech & Mechanics | Controls |
|---|---|---|
| 🏎️ **CyberRunner 2099** | Procedural 3-lane neon highway runner, jump physics, collision detection, glowing orbs, score multiplier | `[A/D]` Switch Lanes<br>`[W / Space]` Jump |
| 🛸 **NeonArena 3D** | Top-down cyberpunk arena shooter, enemy drone swarm AI pathfinding, laser physics, particle explosions | `[WASD]` Move Ship<br>`[Mouse + Click]` Aim & Fire |
| 🧱 **VoxelCraft 3D** | 3D voxel sandbox builder, raycasted block placement & destruction, 6-color cyber palette selector | `[Click]` Place Block<br>`[Shift + Click]` Mine Block |

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

## 🚀 Quickstart Guide

```bash
# 1. Clone repository
git clone https://github.com/ghouseahmed226-debug/Axiom99.git
cd Axiom99

# 2. Run instant setup
./setup.sh

# 3. Start Web Console (PWA)
cd apps/web && npm run dev
# -> http://localhost:3000

# 4. Start Python AI Backend
cd apps/api && uvicorn src.main:app --reload --port 8000
# -> http://localhost:8000/docs
```

---

## ☁️ Deployment

### 1. GitHub Pages (Automated)
This repository includes an automatic GitHub Actions deployment workflow (`.github/workflows/pages.yml`).  
In your repository:
1. Go to **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every push to `main` automatically updates your live game console at:  
   👉 **`https://ghouseahmed226-debug.github.io/Axiom99/`**

### 2. Vercel / Netlify
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 📬 Contact & Support

- **Lead Engineer / Author**: Ghouse Ahmed
- **Email**: [ghouseahmed226@gmail.com](mailto:ghouseahmed226@gmail.com)
- **Repository**: [https://github.com/ghouseahmed226-debug/Axiom99](https://github.com/ghouseahmed226-debug/Axiom99)

---

<div align="center">
  <sub>Built by the 99-Agent Swarm for Axiom99. MIT License.</sub>
</div>