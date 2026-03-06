# sAIve — AI-Powered Budgeting Application

> **Current version: v0.12.0** — See [CHANGELOG](docs/CHANGELOG.md) for the full history.

**sAIve** is a privacy-first desktop budgeting application that lets you manage your finances with the help of a fully local AI assistant. Built with a React + TypeScript frontend packaged in Electron and a Python FastAPI backend, all financial data stays on your device.

---

## ✨ Features

### 🤖 Local AI Engine
- **Privacy-First:** Powered by a customized local model running entirely on-device via WebGPU — your data *never* leaves your computer.
- **Model Selection:** Choose between multiple local AI models (Gemma 3 270M, Llama 3.2 1B, etc.) easily from the Settings page.
- **Smart Categorization:** Automatically suggests categories when you enter a new transaction.
- **Intelligent Assistant:** Chat with your finances — ask questions like *"How much did I spend on food this month?"* or *"What is my savings rate?"*
- **Daily Briefing:** A generated financial health summary greets you on the dashboard.

### 📊 Dashboard & Transactions
- **Overview cards:** At-a-glance totals for income, expenses, savings, and net worth.
- **Recent Activity Feed:** The 8 most recent transactions in a scannable feed with category icons, coloured amounts, and relative dates.
- **Transactions page:** Full table with:
  - Day-section grouping with per-group net totals
  - Sortable columns (Date, Recipient, Category, Type, Amount)
  - Colour-coded category badges
  - Real-time search, type filter pills, and amount-range filter
  - Smart pagination ("Showing X–Y of Z transactions")
  - Inline delete with hover reveal
- **Data export:** Export your transactions to JSON.

### 📅 Calendar View
- Monthly calendar with transactions overlaid on their respective dates.
- Navigate forward and backward through months.

### 💳 Debts & Credit Management
- **Dedicated Tracking:** Manage distinct non-credit debts (loans, mortgages) alongside active credit cards with detailed APR, payment tracking, and estimated payoff dates.
- **Payoff Strategy:** View a projected payoff chart showing balance decay over time for your selected strategy.
- **Integrated Payments:** Create a transaction to instantly reduce your debt balances against your net worth.
- **Seamless Spending:** Use the dynamically-animated income/expense toggle to effortlessly log transactions. Quickly add and charge expenses directly to new or existing credit cards within the transaction form without breaking flow.

### 💰 Budget Planning
- Set per-category spending limits.
- Visual progress bars with warning states when approaching or exceeding limits.
- Income allocation guide showing how your income is distributed across categories.

### 📈 Data Visualization
- **Financial Flow:** Sankey chart (amCharts) visualizing income → expenses → savings.
- **Monthly Expense Trends:** Line chart (Recharts) tracking expenses over months.
- **Category Breakdown:** Radar chart for a monthly categorical expense view.

### 🔄 Real-Time Updates (SSE)
- Server-Sent Events bus keeps all open views in sync instantly — no polling, no manual refresh.
- Events fired on every data mutation: `transactions_changed`, `recurring_changed`, `budgets_changed`, `notifications_changed`.

### 🔒 Security
- **Input validation** on all backend endpoints via Pydantic model constraints.
- **Output sanitization** via `bleach` — strips HTML/script tags to prevent stored XSS.
- **Amount overflow protection** rejects amounts exceeding defined financial limits.
- **Category allowlist** — invalid categories are rejected at the API level.
- **Strict date validation** (`YYYY-MM-DD`) on all date fields.

### 🔌 MCP Server Integration
- **FastMCP Built-in:** Native Model Context Protocol (MCP) server embedded in the FastAPI backend.
- **Agentic Extensibility:** Exposes your financial data securely to the local AI or external logic through dedicated tools (`get_net_worth`, `log_transaction`, `get_expense_categories`).

### ⚙️ App & Distribution
- **Web / Browser Mode:** Run sAIve directly in the browser using the `npm run browser` script without needing Electron.
- **Auto-updater:** Notifies users of new GitHub releases.
- **Persistent storage:** SQLite database stored in the OS user-data directory; survives app updates.
- **Self-contained backend:** Python backend compiled with PyInstaller — no Python install required for end users.
- **Dynamic port discovery:** Electron spawns the backend and negotiates the port automatically.
- **Theming:** Light, Dark, and System theme options, persisted via `localStorage`.
- **Onboarding wizard:** First-run setup for initial balances, monthly income, and AI configuration.

---

## Recent Demo

https://github.com/user-attachments/assets/a9e4689d-e8de-4220-b063-7ea0d7ab0c43

---

## 🛠️ Technologies Used

**Frontend:**

| Area | Libraries / Tools |
|---|---|
| Framework | React, TypeScript |
| Desktop | Electron |
| Build | Vite |
| Styling | TailwindCSS, Shadcn UI (Radix UI) |
| Charting | Recharts, amCharts |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form, Zod |
| API Client | Axios |
| Routing | React Router DOM |
| Notifications | Sonner |
| AI Model | Google Gemma 3 270M (Int4 quantized) via WebGPU, Web Worker |

**Backend:**

| Area | Libraries / Tools |
|---|---|
| Framework | FastAPI (Python) |
| Validation & Sanitization | Pydantic, bleach |
| Database | SQLite |
| ASGI Server | Uvicorn |
| Packaging | PyInstaller |

---

## 📂 Project Structure

```
sAIve/          # Electron + Vite + React frontend
Server/         # FastAPI + SQLite backend
docs/           # CHANGELOG and other documentation
.github/        # GitHub Actions CI/CD workflows
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (recent LTS)
- npm
- Python 3.10+
- pip

### Backend Setup

```bash
cd Server
python -m venv venv
# Windows:
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd sAIve
npm install
```

| Command | Description |
|---|---|
| `npm run electron:start` | Launch full Electron app (dev mode) |
| `npm run browser` | Browser-only dev mode (no Electron) |
| `npm run electron:build` | Build production `.exe` installer |

---

## 💡 Roadmap

- 🧠 **Advanced Agentic Capabilities:**
    - **Proactive Budgeting:** Move from reactive tracking to proactive forecasting and advice.
- 🔗 **Plaid Integration** — optional bank account linking for automatic transaction import.
- 📊 **Advanced Reporting** — customizable reports; CSV / PDF export.
- 🎯 **Goal Setting** — track savings goals with AI-assisted progress feedback.
- ☁️ **Cloud Sync (Optional)** — privacy-preserving cross-device sync.
- 📅 **Subscription Management** — identify and manage recurring services.

---

## 🤝 Contributing

Contributions are welcome! Fork the repo, create a branch, and open a pull request.

```bash
git checkout -b feature/YourFeature
git commit -m "Add YourFeature"
git push origin feature/YourFeature
```

---

## 📄 Changelog

See [docs/CHANGELOG.md](docs/CHANGELOG.md) for a detailed history of every release.
