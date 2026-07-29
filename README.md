<div align="center">

  <h1><code>git-insider</code></h1>
  <p><strong>GitHub Portfolio Intelligence & Developer Analytics Platform</strong></p>

  <p>
    <a href="#key-features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#scoring-algorithm">Scoring Model</a> •
    <a href="#license">License</a>
  </p>

  <br />

  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/API-GitHub_REST_v3-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub API" />
  <img src="https://img.shields.io/badge/License-MIT-1e7c68?style=for-the-badge" alt="License" />

</div>

---

## 💡 Overview

**Git-Insider** is a modern, privacy-first, client-side web application designed to turn any GitHub profile into a rich, signal-focused developer portfolio report. 

Instead of relying solely on superficial metrics like public repository counts, **Git-Insider** analyzes repository documentation standards, licensing habits, technology choices, contribution recency, and impact to deliver actionable feedback for developers, recruiters, and engineering teams.

---

## ✨ Key Features

### 📊 1. Portfolio Quality Scoring (0–100)
- Automatically evaluates public repositories across key signal indicators:
  - **Documentation coverage** (presence of descriptions and READMEs)
  - **Open-source standards** (SPDX license detection)
  - **Discoverability** (topic tags and keywords)
  - **Community engagement** (stars and fork ratios)
  - **Shipping recency** (activity within the current calendar year)

### ⚡ 2. Automated Tech Stack Detection
- Pattern-matches over **60+ modern frameworks, databases, tools, and libraries** across repository names, topics, and descriptions:
  - **Frameworks**: React, Next.js, Vue, Angular, Svelte, Django, FastAPI, Flask, Express, Rails, Flutter, Tauri, etc.
  - **Databases**: PostgreSQL, MongoDB, MySQL, Redis, SQLite, Firebase, Supabase, DynamoDB, Prisma.
  - **DevOps & Cloud**: Docker, Kubernetes, AWS, GCP, Azure, Terraform, GitHub Actions, Vercel, Netlify, Nginx.
  - **AI & ML**: PyTorch, TensorFlow, OpenAI, LangChain, Hugging Face, scikit-learn, Keras.
  - **Testing & Tools**: Jest, Cypress, Playwright, Vitest, GraphQL, REST, Webpack, Vite, TypeScript, Tailwind.

### ⚔️ 3. Side-by-Side Profile Comparison
- Head-to-head comparison tool for evaluating two developers side-by-side (`?compare=user1,user2`).
- Compares portfolio scores, average stars, total repositories, active projects, and language distribution with visual ratio bars.

### 🛡️ 4. Dynamic GitHub README Badges
- Generates customizable SVG badges for developer profile READMEs.
- Includes one-click copyable Markdown/HTML snippets and downloadable `.svg` files.

### ⚡ 5. Client-Side Caching & Rate Limit Management
- Built-in `localStorage` cache with **1-hour TTL** to eliminate redundant network calls.
- Optional **GitHub Personal Access Token (PAT)** support directly in the settings modal to bump rate limits from 60 to **5,000 requests/hour**.
- Zero server dependency — 100% client-side execution.

### 📄 6. 1-Page PDF & Resume Export
- Native browser print stylesheet optimized for generating crisp 1-page PDF portfolio resumes.
- Export raw structured data as formatted **JSON** or clean **Markdown** reports.

### 🔗 7. Deep URL Routing & Social Previews
- Persistent URL state management:
  - `?user=octocat` — Auto-loads user profile
  - `?compare=user1,user2` — Auto-loads head-to-head comparison
  - `?dark=1` — Forces dark mode
- Pre-configured Open Graph & Twitter Card meta tags for rich social sharing.

---

## 🏗️ Architecture

The codebase follows a modular React component structure:

```
Git-Insider/
├── public/
├── src/
│   ├── api/
│   │   └── github.js           # GitHub API fetcher + localStorage caching + token auth
│   ├── components/
│   │   ├── Icon.jsx             # Accessible SVG icon registry (15+ icons)
│   │   ├── Header.jsx           # Topbar navigation & mode switcher
│   │   ├── Hero.jsx             # Hero search box & orbital preview card
│   │   ├── ProfileSection.jsx   # Profile overview & score summary
│   │   ├── MetricsSection.jsx   # Language mix donut, activity pulse & quick stats
│   │   ├── RepoSection.jsx      # Filterable, sortable repository quality table
│   │   ├── HealthSection.jsx    # Health check indicators & category breakdown
│   │   ├── TechStackSection.jsx # Auto-detected tech stack pill badges
│   │   ├── InsightSection.jsx   # Actionable insider takeaways & feedback
│   │   ├── ExportSection.jsx    # JSON, Markdown, and Print/PDF export buttons
│   │   ├── BadgeSection.jsx     # Dynamic SVG README badge generator
│   │   ├── CompareMode.jsx      # Side-by-side profile comparison tool
│   │   ├── ShareModal.jsx       # Social media sharing modal (X, LinkedIn)
│   │   └── SettingsModal.jsx    # PAT token config, rate limit monitor & cache control
│   ├── hooks/
│   │   ├── useProfile.js        # Profile state & async loading logic
│   │   └── useTheme.js          # Theme toggle hook with localStorage persistence
│   ├── utils/
│   │   └── analysis.js          # Scoring engine, tech stack rules & badge SVG renderer
│   ├── App.jsx                  # Main application orchestrator
│   ├── main.jsx                 # Application entry point
│   └── styles.css               # Design system, CSS variables & print styles
├── index.html                   # HTML wrapper & Open Graph metadata
├── package.json                 # Project dependencies & scripts
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Git-Insider.git
   cd Git-Insider
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or the port specified in your terminal) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static assets will be output to the `dist/` directory.

---

## 🧮 Scoring Algorithm

The portfolio score (0–100) is calculated per repository and averaged across public repositories:

| Criteria | Weight | Description |
| :--- | :--- | :--- |
| **Description** | +15 pts | Repository has a non-empty description string |
| **License** | +10 pts | Valid SPDX license is declared |
| **Topics** | +10 pts | Repository contains 1 or more GitHub topic tags |
| **Stars** | up to +15 pts | 1 pt per 100 stars (max 15 pts) |
| **Forks** | up to +10 pts | 1 pt per 100 forks (max 10 pts) |
| **Recency** | +20 pts | Updated within the current calendar year (+5 pts if older) |
| **Repo Naming** | +10 pts | Meaningful repository name (>3 chars, excludes "repo") |
| **Base Score** | +20 pts | Base allocation for public open-source availability |

---

## 🎨 Design System & Styling

- **Typography**: DM Sans (body), DM Mono (code/metrics), Playfair Display (headings).
- **Color Palettes**:
  - **Light Theme**: Paper (`#f6f4ee`), Surface (`#fffef9`), Ink (`#19211f`), Emerald (`#1e7c68`), Coral (`#e36d4c`).
  - **Dark Theme**: Paper (`#17201d`), Surface (`#202b27`), Ink (`#eef0e8`), Mint (`#65bea5`), Salmon (`#ef8869`).
- **Responsive Layout**: Fluid CSS grid & flexbox scaling down to mobile screen sizes (<480px).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with React & Vite • Git-Insider Platform</sub>
</div>
