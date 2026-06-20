<div align="center">
  <h1>🌐 CYBERSPACE</h1>
  <p><b>Your Personal Global Intelligence & Situational Awareness Dashboard</b></p>
  
  [![GitHub stars](https://img.shields.io/github/stars/Drakex01/cyberspace?style=social)](https://github.com/Drakex01/cyberspace/stargazers)
  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  
  <br />
  
  <a href="https://cyberspace.app"><strong>Explore Web App</strong></a> ·
  <a href="https://github.com/Drakex01/cyberspace/releases/latest"><strong>Download Desktop</strong></a> ·
  <a href="https://www.cyberspace.app/docs/documentation"><strong>Documentation</strong></a>
  
  <br /><br />
</div>

![CYBERSPACE Dashboard](docs/images/cyberspace-7-mar-2026.jpg)

## ⚡ What is CYBERSPACE?

**CYBERSPACE** is a real-time, AI-powered global intelligence dashboard designed for analysts, traders, and OSINT enthusiasts. It aggregates news, geopolitical movements, infrastructure tracking, and financial data into a single, unified situational awareness interface.

### 🚀 Core Features

- 📡 **500+ Curated Feeds:** Real-time news across 15 critical categories, synthesized by AI.
- 🌍 **Dual Map Engine:** Seamlessly toggle between a 3D globe and a 2D map with 56+ data layers.
- 📉 **Cross-Stream Correlation:** Track military, economic, disaster, and escalation signals simultaneously.
- 📊 **Country Instability Index (CII):** Live server-authoritative stress scoring for 31 Tier-1 nations.
- 📈 **Finance Radar:** Monitor 29 stock exchanges, commodities, crypto, and market composites.
- 🧠 **Local AI Support:** Run entirely via Ollama with zero API keys required for maximum privacy.
- 💻 **Native Desktop App:** Lightning-fast Tauri-based desktop app for Windows, macOS, and Linux.

---

## 🛠️ Quick Start

Get your intelligence hub running locally in minutes:

```bash
# Clone the repository
git clone https://github.com/Drakex01/cyberspace.git

# Navigate into the project directory
cd cyberspace

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [localhost:3000](http://localhost:3000) in your browser. CYBERSPACE runs out of the box with zero environment variables required.

> **Note:** Certain advanced features (like live flight tracking) may require API tokens. Check `.env.example` to unlock the full potential of the platform.

---

## 🏗️ Architecture & Tech Stack

Built for speed, scale, and resilience:

- **Frontend:** TypeScript, Vite, Globe.gl + Three.js, Deck.gl + MapLibre
- **Desktop:** Tauri 2 (Rust) + Node.js sidecar
- **AI/ML:** Ollama, Groq, OpenRouter, Transformers.js
- **Backend/Edge:** Vercel Edge Functions, Protocol Buffers, Redis Cache

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

```bash
npm run typecheck        # Run type checking
npm run build:full       # Build for production
```

---

## 📜 License

Distributed under the **AGPL-3.0 License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with 💻 and ☕ by <b><a href="https://github.com/Drakex01">Drakex01</a></b></p>
  
  <a href="https://api.star-history.com/svg?repos=Drakex01/cyberspace&type=Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Drakex01/cyberspace&type=Date&theme=dark" />
      <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Drakex01/cyberspace&type=Date" width="600" />
    </picture>
  </a>
</div>
