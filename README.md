# sAIve - AI Powered Budgeting Application

**sAIve** is a desktop budgeting application designed to help users manage their finances effectively. It's built with a modern tech stack, featuring a React and TypeScript frontend packaged with Electron, and a Python FastAPI backend.

---

## ✨ Features

* **Dashboard Overview:** At-a-glance view of total income, expenses, savings, and net worth.
* **Transaction Management:**
    * Add, view, (and implicitly edit/delete) financial transactions.
    * Detailed transactions table with pagination and refresh capabilities.
    * Categorize transactions as income or expense with custom categories.
* **Data Visualization:**
    * **Financial Flow:** Sankey chart (using amCharts) to visualize the movement of money between income, expenses, and savings.
    * **Monthly Expense Trends:** Line chart (using Recharts) to track expenses over months.
    * **Monthly Expense Overview:** Radar chart (using Recharts) for a categorical breakdown of monthly expenses.
* **User Asset Tracking:** Backend support for tracking user's monthly total income, expenses, and savings.
* **Responsive UI:**
    * Collapsible sidebar for easy navigation.
    * Modern interface built with TailwindCSS and Shadcn UI components.
* **Theming:** Light, Dark, and System theme options with persistence via localStorage.

---

## 🛠️ Technologies Used

**Frontend:**

* **Framework/Library:** React, TypeScript
* **Desktop App:** Electron
* **Build Tool:** Vite
* **Styling:** TailwindCSS, Shadcn UI
* **Charting:** Recharts, amCharts (for Sankey)
* **State Management/Data Fetching:** TanStack Query (React Query)
* **Forms:** React Hook Form, Zod (for validation)
* **API Client:** Axios
* **Routing:** React Router DOM
* **UI Components:** Radix UI (via Shadcn UI)
* **Notifications:** Sonner

**Backend:**

* **Framework:** FastAPI (Python)
* **Data Validation:** Pydantic
* **Database:** SQLite
* **ASGI Server:** Uvicorn

---

## 📂 Project Structure

The project is organized into two main directories:

* **`sAIve/`**: Contains the Electron-based React frontend application.
* **`Server/`**: Contains the Python FastAPI backend server.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (refer to `package.json` engines or use a recent LTS version)
* npm or yarn
* Python 
* pip

### Backend Setup

1.  Navigate to the `Server` directory:
    ```bash
    cd Server
    ```
2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the FastAPI server (this will also create the SQLite database and tables if they don't exist upon first run):
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will typically be available at `http://localhost:8000`.

### Frontend (Electron App) Setup

1.  Navigate to the `sAIve` frontend directory (from the root):
    ```bash
    cd sAIve
    ```
2.  Install npm dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
3.  Run the Electron application (development mode):
    ```bash
    npm run electron:start
    ```
    This command likely starts the Vite dev server and then launches Electron.

### Build

To build the Electron application for production:

1.  Ensure the frontend dependencies are installed (`npm install` in the `sAIve` directory).
2.  Run the build command from the `sAIve` directory:
    ```bash
    npm run electron:build
    ```
    This will build the React app and then package it using Electron Builder into an executable.

---

## 💡 Future Features / Projected Ideas

This section outlines potential enhancements and future directions for sAIve:

* 🧠 **AI-Powered Budgeting Assistant with Model Context Protocol (MCP) Integration:**
    * **Leverage MCP for Advanced AI Capabilities:**
        * **Standardized & Secure Data Access:** Implement sAIve to utilize MCP, enabling the AI budgeting assistant to securely and seamlessly connect with a wide array of external data sources. This could include accessing local user files (e.g., bank statements, exported transaction histories from other services), calling external APIs (e.g., financial institutions via Plaid, market data providers), or interacting with other MCP-enabled tools and services in a standardized way.
        * **Enhanced Tool Use & Extensibility:** Expose sAIve's core budgeting functionalities (like transaction analysis, report generation, or saving goal calculations) as tools via an MCP server. Conversely, sAIve's AI could act as an MCP client to consume external tools (e.g., advanced forecasting models, debt management services) to provide more comprehensive financial assistance.
    * **AI-Driven Insights (Powered by MCP-facilitated Data):**
        * **Smart Categorization:** AI automatically categorizes transactions with higher accuracy by securely accessing and analyzing transaction details obtained via MCP.
        * **Spending Pattern Analysis:** AI identifies trends, anomalies, and areas for potential savings by processing data from various connected sources.
        * **Predictive Budgeting:** Forecast future financial states based on historical data and information from linked accounts or services.
        * **Personalized Financial Advice:** Offer tailored tips and recommendations for budget optimization by leveraging a holistic view of the user's financial data accessible through MCP.
    * **Natural Language Interaction & Agentic Capabilities:**
        * Users can interact with the AI assistant using natural language (e.g., "sAIve, how much did I spend on dining out last month?", "What are my largest upcoming bills according to my calendar and imported data?").
        * Enable the AI to perform more complex, multi-step financial tasks by orchestrating internal tools and external services connected through MCP.
* 🔗 **Direct Plaid Integration (Potentially via MCP):** Allow users to securely connect their bank accounts for automatic transaction importing, streamlining data entry and leveraging MCP for standardized communication if Plaid offers MCP compatibility or if an intermediary MCP server is used. Possible scrap since all data is perferred to stay on device
* 📊 **Advanced Reporting & Export:**
    * Generate customizable financial reports (e.g., monthly/yearly summaries, category breakdowns, net worth statements).
    * Export data to formats like CSV or PDF.
* 🎯 **Goal Setting & Tracking:**
    * Enable users to set financial goals (e.g., saving for a vacation, paying off debt).
    * Track progress towards goals with visual indicators and AI-assisted motivational feedback.
* ☁️ **Cloud Synchronization (Optional & Secure):**
    * Offer an option to securely back up and sync data across multiple devices, ensuring data privacy and potentially using MCP for standardized data exchange with a secure cloud backend.
* 📅 **Subscription Management:** Help users track and manage recurring subscriptions, identifying unused or redundant services, possibly by integrating with services that provide this information via MCP.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request. You can also open an issue if you find a bug or have a feature suggestion.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
