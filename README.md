<div align="center">
  <h1>🌐 CYBERSPACE</h1>
  <p><b>Your Personal Real-Time Global Intelligence & Situational Awareness Dashboard</b></p>
  
  [![GitHub stars](https://img.shields.io/github/stars/Drakex01/open-world?style=social)](https://github.com/Drakex01/open-world/stargazers)
  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  
  <br />
  
  <a href="https://github.com/Drakex01/open-world"><strong>GitHub Repository</strong></a> ·
  <a href="docs/overview.mdx"><strong>Documentation</strong></a> ·
  <a href="ARCHITECTURE.md"><strong>Architecture Overview</strong></a>
  
  <br /><br />
</div>

![CYBERSPACE Dashboard](docs/images/worldmonitor-7-mar-2026.jpg)

## ⚡ What is CYBERSPACE?

**CYBERSPACE** is a real-time, AI-powered global intelligence dashboard built for analysts, traders, and OSINT researchers. It aggregates live news feeds, geopolitical movements, maritime/aviation tracking, infrastructure stability, and financial market metrics into a unified, interactive 3D/2D situational awareness interface.

### 🚀 Core Features

- 📡 **500+ Curated RSS & Intelligence Feeds:** Real-time news across 15 critical categories with automated AI synthesis.
- 🌍 **Dual Interactive Map Engine:** Seamlessly toggle between a 3D Globe (Globe.gl / Three.js) and a high-performance 2D Map (Deck.gl / MapLibre) with 56+ live data layers.
- 📉 **Cross-Stream Signal Correlation:** Correlate military flights, vessel tracking, earthquakes, cyber threats, and macro indicators in real time.
- 📊 **Country Instability Index (CII):** Live server-authoritative risk scoring for 31 Tier-1 nations.
- 📈 **Finance & Commodity Radar:** Track 29 stock exchanges, bond yields, commodities, crypto, and market breadth.
- 🧠 **Local AI Integration:** Built-in integration with Ollama for 100% private, zero-token-cost local LLM analysis.
- 💻 **Native Cross-Platform Support:** Run as a modern web application or build natively with Tauri 2 (Rust).

---

## 🛠️ Quick Start

Get CYBERSPACE running locally in seconds:

```bash
# 1. Clone the repository
git clone https://github.com/Drakex01/open-world.git

# 2. Navigate into the directory
cd open-world

# 3. Install dependencies
npm install

# 4. Launch the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. CYBERSPACE runs out of the box with zero environment variables required for core functionality.

> **Note:** Advanced features (e.g. specialized satellite feeds or live API webhooks) can be configured via `.env.example`.

---

## 🏗️ Tech Stack & Architecture

- **Frontend Core:** TypeScript, Vite, Web Components / Custom UI System
- **Geospatial & 3D:** Globe.gl, Three.js, Deck.gl, MapLibre GL
- **Desktop Runtime:** Tauri 2 (Rust) + Node.js sidecar
- **AI & NLP:** Ollama (Local), Groq, OpenRouter, Transformers.js
- **Data & Protocols:** Protocol Buffers, Edge Functions, High-concurrency RSS Parsers

---

## 🤝 Contributing

Contributions are welcome! To run checks before submitting a PR:

```bash
npm run lint             # Run linter & safe-html checks
npm run typecheck        # Run TypeScript type safety checks
```

---

## 📜 License

Distributed under the **AGPL-3.0 License**. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built with 💻 and ☕ by <b><a href="https://github.com/Drakex01">Drakex01</a></b></p>
  
  <a href="https://api.star-history.com/svg?repos=Drakex01/open-world&type=Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Drakex01/open-world&type=Date&theme=dark" />
      <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Drakex01/open-world&type=Date" width="600" />
    </picture>
  </a>
</div>
