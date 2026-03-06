# sAIve — Changelog

All notable changes to sAIve are documented here, organized by release tag.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v0.12.2] — 2026-03-06 — *Debt Flow & Timezone Fixes*

### Added
- **MCP Debt Live Updates:** creating or updating a debt via MCP now properly emits SSE events to automatically update the dashboard net worth widget in real time without refreshing.
- **Debt Activity Feed Tracking:** the Recent Activity Feed now naturally aggregates and tracks the origination of new debts on the timeline alongside regular transactions.
- **Decoupled Excess Payments:** making a manual extra payment towards a debt now posts an independent transaction to the "Bills" category in your ledger, rather than automatically mutating the underlying monthly subscription object.

### Fixed
- **Race Condition in Recurring Transactions:** a critical bug where running multiple instances of the backend on the same machine could result in duplicate recurring transactions posting to the ledger on the same interval. It is now processed cleanly via an atomic SQLite lock.
- **Timezone Drift on Transactions:** fixed an issue where adding a transaction after 4:00 PM Pacific Time (UTC rollover window) would push the timestamp a day forward. All transactions are now safely serialized using `date-fns` `format()` instead of strictly `toISOString()`.
- **Chronological Sub-sort by ID:** all transaction feeds (`TransactionsTable` and `RecentActivityFeed`) now explicitly sub-sort by ID descending when multiple transactions share the exact same date.

---

## [v0.12.1] — 2026-03-05 — *MCP Debt Tools Exposure*

### Added
- **MCP Debt Tools** — Exposed debt management functionality to the MCP server for AI access:
  - `get_debts`: Retrieves a list of all user debts, with optional type filtering.
  - `get_credit_cards`: Retrieves revolving credit card debts specifically.
  - `create_debt`: Creates a new debt and updates the user's net worth.
  - `update_debt` & `update_debt_balance`: Fully update debt details or quickly adjust just the balance.
  - `delete_debt`: Deletes a debt from the ledger.

---

## [v0.12.0] — 2026-03-05 — *Transaction Form Enhancements & New Debts Feature*

### Added
- **Comprehensive Debts Feature** — Added a dedicated debts management section to track various liability types (Credit Card, Auto Loan, Student Loan, Mortgage, Personal).
  - Features interactive debt cards detailing balance, interest rate, and monthly payment.
  - Includes a payoff timeline chart that projects the paydown schedule for all debts.
  - Users can create, edit, delete, and make manual payments towards debts.
- **Dynamic Transaction Type Toggle** — Replaced the basic "Type" dropdown in the Add Transaction form with an animated sliding pill toggle.
  - The toggle slides between `↑ Income` and `↓ Expense` with a smooth animation
  - The entire form card now features an interactive **box-shadow glow** that transitions between green (`--income`) and red (`--expense`) to match the selected transaction type
- **Quick-Add Credit Card** — A nested sliding drawer has been added directly to the "Charged to" section of the Add Transaction form.
  - Users can now seamlessly create a new credit card mid-transaction flow without losing their place or form data
  - Newly created cards are immediately available and automatically selected in the dropdown
- **Always-Visible "Charged to" Field** — The "Charged to" field and associated "+ Add Card" button are now always visible for expense transactions, even if the user has no existing credit cards on file.

### Changed
- **Form Layout Reorganization** — Reorganized the Add Transaction form grid to keep the Category field consistently aligned on the second row (`Date | Type | Category`), preventing layout jumps when the conditional "Charged to" section appears.
- **Cache Isolation logic** — The "Charged to" credit card dropdown in `DashboardHeader` now uses an isolated React Query cache key (`["debts", "credit_card"]`) to prevent collisions with the main Debts page (`["debts"]`), resolving a bug where creating a transaction would clear non-credit-card debts from the Debts page UI.
- Version bumped: `0.11.0` → `0.12.0`

---

## [v0.11.0] — 2026-03-05 — *AI Chat Sidebar & Simulation Panel*

### Added
- **Persistent AI Chat sidebar** — the AI assistant no longer opens as a blocking full-screen Drawer; it now renders as a fixed-width right panel (`320px`) alongside the main page, so the current page remains visible while chatting
  - Chat state (model load, briefing, message history) is now **always preserved** across open/close cycles — the component stays mounted and only the container width animates
  - Panel displays inline model download progress and model info (`gemma-3-270m · WebGPU`)
- **Simulate button** in the AI chat header — placeholder hook for future MCP tool-call output; cycles through four demo visualizations on each press (bar chart, line chart, pie chart, data table)
- **Simulation Panel** — animated bottom panel that slides up below the main content area when a simulation is active, keeping all three zones (nav sidebar, main page, AI chat) simultaneously visible
  - Renders `bar`, `line`, and `pie` charts via Recharts, plus a scrollable data table
  - Dismissed with the × button; AI chat panel remains open independently
- **Nav auto-collapse** — the left navigation sidebar automatically collapses to icon-only mode when the AI chat panel opens, reclaiming horizontal real estate; restores the user's previous collapse state when chat is closed
- **Custom themed scrollbar** (global) — replaces the default browser scrollbar with a 6px rounded pill style using CSS variables (`--border` / `--muted-foreground`) that automatically adapts to all themes and dark mode

### Changed
- `Layout.tsx` restructured from 2-zone to 3-zone flex layout (nav | center stack | AI chat)
- `Sidebar.tsx` refactored: AI chat toggle is now a plain button (not a Drawer trigger); accepts `aiChatOpen` and `onAiChatToggle` props from Layout
- `AiContext.tsx`: added `SimulationPayload` type, `activeSimulation` state, and `setActiveSimulation` action — the shared bus for simulation data (MCP tool output will write here when connected)
- Version bumped: `0.10.1` → `0.11.0`

---

## [v0.10.1] — 2026-03-04


### Added
- **Transactions Table Overhaul** — complete rewrite of `TransactionsTable.tsx`
  - Native date grouping: rows are grouped under day-section headers (`TODAY`, `FRIDAY, FEBRUARY 13, 2026`) with a per-group net total displayed right-aligned
  - Sortable columns: click any header (Date, Recipient, Category, Type, Amount) to toggle ascending/descending; active sort shown with arrow indicator
  - Category badges: colour-coded pill badges per row (Income = green, Food = orange, Transportation = blue, Housing = cyan, Bills = yellow, Subscriptions = purple)
  - Search bar: filter transactions by recipient in real time
  - Type filter pills: All / Income / Expense one-click toggle
  - Amount range filter: pop-over min/max numeric inputs
  - Smart pagination: "Showing X–Y of Z transactions" counter that respects active filters
  - Skeleton loading state and illustrated empty state with "Clear Filters" CTA
  - Color-coded amounts: `+` green for income, `−` red for expense
  - Row hover actions: trash icon appears on hover for quick delete
- **`RecentActivityFeed` component** — new homepage widget replacing the old compact table
  - Shows the 8 most recent transactions in a scannable vertical feed
  - Category icon bubbles, coloured amounts, relative dates ("Today", "Feb 13"), category badges
  - "View all transactions" footer link routing to `/transactions`
- **`npm run browser` dev script** — starts Python backend on fixed port 8000 + Vite (browser-only, no Electron) concurrently
- **`vite.config.browser.ts`** — Vite config without `vite-plugin-electron`, used by `npm run browser` to avoid Electron launching during browser-based development

### Changed
- `Index.tsx`: replaced the `TransactionsTable` compact widget with `RecentActivityFeed`
- Removed `useQuery` / `fetchTransactions` no longer needed in `Index.tsx`
- Version bumped: `0.9.1` → `0.10.1`

---

## [v0.9.1] — 2026-03-04

### Added
- Data export feature — export transactions to JSON
- `npm run electron:dev` script for launching the Electron app in development mode

### Changed
- Renamed recurring transaction event names for clarity
- Version bumped: `0.9.0` → `0.9.1`

---

## [v0.9.0] — 2026-03-04 — *Security Update*

### Added
- **Input validation** on all backend endpoints via Pydantic model constraints
- **Output sanitization** using `bleach` to strip HTML/script tags from user-supplied strings (prevents stored XSS)
- **Amount overflow protection**: rejects amounts exceeding defined financial limits
- **Category allowlist enforcement**: invalid categories are rejected at the API level
- **Date format validation**: strict `YYYY-MM-DD` enforcement on all date fields

### Changed
- All `recipient` fields are now sanitized through `bleach.clean()` before persistence
- MCP tool inputs validated before database writes

---

## [v0.8.0] — 2026-03-04 — *Event-Driven Architecture*

### Added
- **Server-Sent Events (SSE)** bus — `sse_bus.py` module implementing a pub/sub event bus
- `/events/{user_id}` SSE endpoint on the backend; the frontend subscribes once and receives real-time invalidation signals
- `useServerEvents` hook in the frontend — subscribes to the SSE stream and triggers React Query invalidations on the following events:
  - `transactions_changed`
  - `recurring_changed`
  - `budgets_changed`
  - `notifications_changed`

### Changed
- All data-mutating endpoints now `emit_event()` after writes, replacing the previous optimistic invalidation approach
- Eliminated redundant polling and manual `refetch()` calls across multiple components

---

## [v0.7.2] — 2026-03-04

### Added
- **Calendar page** — interactive monthly calendar view
  - Displays transactions overlaid on their respective dates
  - Navigate forward/backward through months

---

## [v0.7.1] — 2026-02-26

### Changed
- Budget page UI polish and layout improvements
- Settings page layout tweaks
- Minor version bump

---

## [v0.7.0] — 2026-02-26 — *Budget Planning*

### Added
- **Budget page** — set per-category spending limits
  - Income allocation guide showing how income is distributed across categories
  - Visual progress bars per category vs. limit
  - Warning states when approaching or exceeding budget limits
- Budget endpoints on the backend (`GET /budgets/{user_id}`, `PUT /budgets/{user_id}`)

---

## [v0.6.0] — 2026-02-25 — *MCP Server Integration*

### Added
- **MCP Server** (`FastMCP`) integration natively embedded into the backend
- New `/mcp` mounted route for SSE-based MCP tool communication
- AI tools exposed to local clients:
  - `get_net_worth`: Retrieves current user net worth
  - `log_transaction`: Logs an income or expense transaction and recalculates assets
  - `get_expense_categories`: Returns a breakdown of expenses for a specific month/year

### Changed
- Updated `Server/requirements.txt` dependencies to latest compatible versions

---

## [v0.5.0 – v0.5.1] — 2026-02-23 — *Onboarding*

### Added
- **Onboarding / startup screen** — first-run wizard guiding new users through:
  - Initial checking and savings balance entry
  - Expected monthly income entry
  - Optional AI assistant setup (model download)
- `POST /users/{user_id}/onboard` endpoint — seeds initial account balances as transactions

---

## [v0.4.9 – v0.4.11] — 2026-02-19

### Added
- App icons for Windows (`.ico`), macOS (`.icns`), and Linux (`.png`)
- Proper Electron icon handling across platforms (packaged vs. dev mode)

---

## [v0.4.6 – v0.4.8] — 2026-02-18

### Fixed
- Delete transaction not properly recalculating monthly asset totals after removal
- React Query cache not correctly invalidating after delete operations
- `month_update` and `organize_assets` now called on every delete to keep history consistent

---

## [v0.4.5] — 2026-02-18

### Changed
- AI assistant stability improvements — better error handling and context window management

---

## [v0.4.4] — 2026-02-17

### Changed
- Renamed category `"Transport"` → `"Transportation"` for consistency across frontend and backend

---

## [v0.4.3] — 2026-02-17

### Changed
- Code cleanup pass — removed dead code, normalized imports, fixed line endings

---

## [v0.4.2] — 2026-02-17 — *CI/CD*

### Added
- **GitHub Actions workflow** (`main.yml`) — automated build and release pipeline
  - Builds Electron app for Windows on push to `main`
  - Publishes GitHub Release with `.exe` installer artifact

---

## [v0.4.1] — 2026-02-17 — *Startup Screen & AI Optimizations*

### Added
- Startup/loading screen with animated logo while AI engine initializes
- AI category auto-suggestion on transaction entry
- AI-powered daily financial briefing on dashboard load

### Changed
- Improved AI context injection — sends relevant financial summary data with each prompt

---

## [v0.3.0] — 2026-02-16 — *Backend Bundling*

### Added
- **PyInstaller** packaging — Python backend compiled into a self-contained binary for distribution
- **Dynamic port discovery** — Electron spawns the backend, backend prints `PORT:<n>` to stdout, Electron IPC exposes the port to the renderer
- Persistent SQLite database stored in the OS user data directory (survives app updates)
- Electron auto-updater via `electron-updater` — notifies users of new GitHub releases

### Changed
- Frontend `api.ts` updated to use `configureApi()` for dynamic port negotiation; falls back to `localhost:8000` when not in Electron

---

## [v0.2.0] — 2026-02-13 — *AI Assistant*

### Added
- **AI Chat** (`AiChat` component) — in-app conversational assistant
  - Powered by `@huggingface/transformers` running Google Gemma 3 270M (Int4 quantized) locally via WebGPU
  - Runs in a Web Worker to keep the UI non-blocking
  - Full conversation history passed for multi-turn context
  - Markdown rendering in responses via `react-markdown`
- AI context injection — transactions and financial summaries sent as system context with each message

---

## [v0.1.1] — 2026-02-12

### Added
- `SettingsContext` — centralized currency formatting and AI feature flags
- Currency formatter applied across all financial displays (Overview cards, charts, tables)
- **Reports page** — monthly financial stats (`/stats/history`, `/stats/categories`, `/stats/sankey`)
- **Flow page** — Sankey chart (amCharts) visualizing income → budget → expense/savings flow
- Transaction delete with recalculation of net worth and monthly asset totals
- Radar chart for monthly expense category breakdown
- Front-screen loading animation

---

## [v0.0.2 – v0.0.2-alpha / v16–v18] — June 2025

### Fixed
- Early production bug fixes and backend stability patches
- CI/CD pipeline corrections

---

## [v0.0.1-alpha] — June 2025 — *Initial Release*

### Added
- Project scaffold: Electron + Vite + React + TypeScript frontend
- FastAPI + SQLite + Uvicorn backend
- Basic transaction CRUD (create/read/delete)
- GitHub Actions initial CI setup
