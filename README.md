# RankPilot AI — Intelligent SEO Audit & Rank Tracker

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-blue.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/Gemini-3.6%20Flash-orange.svg)](https://ai.google.dev/)
[![Browserbase](https://img.shields.io/badge/Browserbase-SDK-purple.svg)](https://browserbase.com)

**RankPilot AI** is a next-generation, AI-driven SEO audit and search engine rank-tracking platform. It combines cloud-native headless browser automation with **Google Gemini AI** to provide comprehensive technical SEO audits, real-time Google SERP tracking, competitor position benchmarks, and prioritized, actionable remediation plans.

---

## 📖 Theoretical Overview & Philosophy

### 1. What is RankPilot AI?
Traditional SEO tools typically rely on hardcoded rule engines to check static tags (e.g., *Is title length between 50-60 characters?*). While necessary, these static rules fail to understand **semantic relevance, content intent, and real-world crawlability**.

RankPilot AI bridges this gap with a **hybrid architecture**:
* **Deterministic Technical Layer**: Extracts DOM structure, Core Web Vitals, HTTP headers, heading hierarchies, internal/external links, and image alt text using cloud browser automation (**Browserbase + Playwright**).
* **AI Cognitive Layer**: Ingests the pre-processed, token-optimized website representation into **Gemini 3.6 Flash** to perform semantic analysis, keyword extraction, and issue severity categorization.

---

### 2. SEO in the Modern AI & LLM Era (From SEO to GEO)
The search landscape is undergoing a paradigm shift from traditional search engines to **Generative Engines and AI Assistants** (e.g., ChatGPT Search, Perplexity, Google AI Overviews, Claude):

* **The Problem with Raw HTML**: AI crawlers and LLM agents consume content in high token volumes. Scraping megabytes of bloated DOM, scripts, and CSS directly into an LLM is costly, slow, and noisy.
* **Token-Efficient Ingestion in RankPilot**: RankPilot extracts critical structured signals and trims primary content *before* feeding it to the AI model. This minimizes token consumption while maximizing prompt reasoning accuracy.
* **Generative Engine Optimization (GEO)**: Search engines no longer rank pages solely on keyword frequency. They evaluate **information density, extractability, structured entities (Schema.org), and direct answer clarity**. RankPilot's audit scores are designed around these principles.

---

### 3. Why RankPilot AI Stands Out
* ⚡ **Live Browser Automation**: Uses managed cloud browser sessions (Browserbase) with CDP (Chrome DevTools Protocol) to accurately render modern Client-Side Rendered (CSR / Single Page) applications.
* 🎯 **Live SERP Position & Competitor Discovery**: Performs actual Google search scans to locate your exact ranking (across up to 50 results) while cataloging top competing domains in the same niche.
* 🧠 **Structured Schema Enforcement**: Uses strict JSON schema decoding with Gemini to eliminate hallucinations and produce structured ratings across SEO, Performance, Accessibility, and Best Practices.
* 🔄 **Automated Daily Rank Monitoring**: Runs automated background cron tasks to log position fluctuations, best rank historical peaks, and daily position change deltas.

---

## ✨ Key Features

- 🔍 **Comprehensive Website Audits**: Instant health score across 4 key categories (SEO, Performance, Accessibility, Best Practices).
- 📈 **Live SERP Rank Tracker**: Scrapes live Google search results to determine exact keyword position and rank page.
- 🥊 **Competitor Benchmarking**: Automatically extracts top 10 competitors appearing above or around your target domain for tracked keywords.
- ⏰ **Automated Cron Jobs**: Background scheduling (`node-cron`) checks active keywords daily and records historical rank changes.
- ⚠️ **Severity-Categorized Issues**: Clear issue breakdown (`critical`, `warning`, `info`) with specific, actionable remediation steps.
- 📊 **Historical Analytics**: Visual trends of past audits and keyword ranking history over time.
- 🔐 **JWT Authentication & Multi-Tenant Support**: Secure password hashing with bcrypt and isolated user data storage in MongoDB.

---

## 🛠️ Architecture & Tech Stack

### System Workflow Diagram
```
  [User URL / Keyword]
           │
           ▼
┌──────────────────────┐
│  React 19 + Vite UI  │ ◄─── REST API / JWT
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────┐
│            Express.js Server API             │
├──────────────────────┬───────────────────────┤
│   Scraper Service    │  Rank Tracker Service │
│ (Browserbase + CDP)  │  (Google SERP Parser) │
└──────────┬───────────┴───────────┬───────────┘
           │                       │
           ▼                       ▼
┌──────────────────────┐ ┌─────────────────────┐
│  Gemini 3.6 Flash    │ │  MongoDB Database   │
│ (SEO Schema Audit)   │ │ (Audits & Keywords) │
└──────────────────────┘ └─────────────────────┘
```

### Technology Breakdown

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Axios, React Router |
| **Backend** | Node.js, Express.js (ES Modules), Node-Cron |
| **AI Model** | Google Gemini API (`gemini-3.6-flash`) via `@google/genai` |
| **Automation** | Browserbase SDK, Playwright Core |
| **Database** | MongoDB with Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), Bcrypt password hashing, CORS |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: A running local instance or [MongoDB Atlas URI](https://www.mongodb.com/cloud/atlas)
* **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)
* **Browserbase API Key**: Obtainable from [Browserbase](https://browserbase.com/)

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aryan-tech46/Rank-Pilot-AI.git
   cd Rank-Pilot-AI
   ```

2. **Configure Backend Environment Variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET="your_strong_jwt_secret"

   # MongoDB Connection String
   MONGODB_URI="your_mongodb_connection_uri"

   # Browserbase API Key (for cloud headless browser sessions)
   BROWSERBASE_API_KEY="your_browserbase_api_key"

   # Gemini API Key (for AI SEO audit analysis)
   GEMINI_API_KEY="your_gemini_api_key"
   ```

3. **Configure Frontend Environment Variables (Optional)**

   If your backend is hosted on a custom port or domain, create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL="http://localhost:5000"
   ```

4. **Install Dependencies & Start the Application**

   **Terminal 1 — Start the Backend Server:**
   ```bash
   cd server
   npm install
   npm run server
   ```

   **Terminal 2 — Start the Frontend Development Client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Directory Structure

```text
RankPilot AI/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, ProtectedRoute, UI Modals
│   │   ├── context/            # Global App & Auth state context
│   │   ├── pages/              # Analyze, Dashboard, RankTracker, Report, History
│   │   ├── App.tsx             # Main router
│   │   └── main.tsx            # Entry point
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB database connection
│   ├── controllers/            # Auth, Analysis, and Rank logic controllers
│   ├── cron/                   # Daily rank tracking cron scheduler
│   ├── middleware/             # JWT authentication middleware
│   ├── models/                 # Mongoose schemas (User, Analysis, KeywordTracking)
│   ├── routes/                 # Express API routes (/api/auth, /api/rank, /api/analysis)
│   ├── services/               # Gemini AI, Scraper, and Rank Tracker services
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE.md                  # MIT License
└── README.md                   # Project documentation
```

---

## 🔮 Future Roadmap & Key Improvements

I am actively developing RankPilot AI to be the leading platform for **Generative Engine Optimization (GEO) & Agentic SEO**:

- [ ] **`llms.txt` Standard Compliance Audit**: Automated detection and validation of `/llms.txt` and `/llms-full.txt` files to evaluate if a site provides structured markdown for LLM agents.
- [ ] **AI Crawler Permission Scanner**: Inspect `robots.txt` for explicit allow/block rules on AI user agents (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`).
- [ ] **HTML-to-Markdown Pipeline (Turndown Engine)**: Integrate an intelligent readability parser that converts primary article content to clean Markdown, reducing LLM token costs by up to 70%.
- [ ] **Schema.org & JSON-LD Knowledge Graph Analyzer**: Deep-parse embedded structured data (`FAQPage`, `Article`, `Product`, `HowTo`) to measure search entity readiness for AI Overviews.
- [ ] **GEO Citation Score**: Quantify the likelihood of a webpage being cited by generative search engines based on factual density and semantic heading clarity.
- [ ] **Automated PDF & White-Label Export**: Generate downloadable, branded client SEO audit reports in PDF format.

---

## 🤝 Contributing

Contributions are welcome! If you want to contribute, please check out the [Contributing Guidelines](CONTRIBUTING.md) and open a pull request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE.md](LICENSE.md) for more information.
