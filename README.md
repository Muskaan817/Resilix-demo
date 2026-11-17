# Resilix Demo Application

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B%20%7C%2022%2B-brightgreen)](https://nodejs.org/)
[![Resilix](https://img.shields.io/badge/Core%20Package-Resilix%20v1.0.0-blue)](https://github.com/Muskaan817/Resilix)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete, production-grade full-stack demonstration application showing how to integrate the **[Resilix](https://github.com/Muskaan817/Resilix)** retry and resilience library into real-world Node.js services.

This project consumes **Resilix** as an installed package dependency (`require('resilix')`), showcasing exponential backoff, jitter, timeout controls, deterministic retry simulation, and live developer telemetry through an interactive React dashboard.

---

## Architecture Overview

```
resilix-demo/
├── backend/                    # Express.js REST API with Resilix retry orchestration
│   ├── src/
│   │   ├── app.js              # Express application assembly & route mounting
│   │   ├── server.js           # Server bootstrap (default port: 5000)
│   │   ├── verify.js           # Automated end-to-end integration test runner
│   │   ├── config/             # Dynamic runtime retry configuration
│   │   ├── controllers/        # Request handlers (users, products, orders, stats)
│   │   ├── middleware/         # ResilixError-aware error handling middleware
│   │   ├── routes/             # API route definitions
│   │   └── services/           # Business logic invoking retry() from 'resilix'
│   ├── .env.example            # Environment configuration template
│   └── package.json            # Backend dependencies (resilix, express, cors, dotenv)
│
├── frontend/                   # Modern React + Vite developer dashboard
│   ├── src/
│   │   ├── App.jsx             # Main dashboard controller with polling telemetry
│   │   ├── components/         # Modular UI panels (Metrics, Testing, Config, Logs, Viewer)
│   │   ├── services/           # Backend API client
│   │   └── styles/             # Dark developer-centric UI design system
│   ├── vite.config.js          # Vite config with backend proxy (:3000 -> :5000)
│   └── package.json            # Frontend dependencies (React 18, Vite)
│
└── package.json                # Root orchestration scripts
```

---

## Key Features

1. **Native Resilix Integration**:
   - Consumes `resilix` via standard npm dependency resolution (`require('resilix')`).
   - Uses `retry(operation, options)` for asynchronous database, network, and gateway simulation.
   - Preserves typed `ResilixError` diagnostics (total attempts, duration, original cause).

2. **Deterministic & Probabilistic Scenarios**:
   - **Immediate Success**: Passes on Attempt #1 (0 retries).
   - **Fail Twice, Then Recover**: Fails attempts 1 & 2 with transient socket errors, then recovers on attempt 3.
   - **Exhaust All Retries**: Fails continuously until `maxRetries` is reached, returning HTTP 503 with structured `ResilixError` payload.
   - **Probabilistic Simulation**: Simulates unpredictable real-world network packet loss using configurable failure probabilities.

3. **Interactive Dark Dashboard**:
   - **Live Metrics Overview**: Total requests, successful operations, exhausted failures, retry triggers, successful recoveries, recovery rate, average attempts per request, and latency.
   - **Interactive Testing Panel**: Test endpoints (`/users`, `/products`, `/orders`) and trigger scenarios with one click.
   - **Live Configuration Panel**: Adjust `maxRetries`, `initialDelay`, `maxDelay`, `factor`, `strategy` (exponential vs. fixed), `jitter`, `timeout`, and `failureProbability` on the fly without restarting the server.
   - **Real-Time Activity Log Stream**: Step-by-step audit trail showing attempt execution, retry backoff delays, recovery alerts, and failures.
   - **Response Viewer**: Formatted JSON inspector displaying HTTP status codes, latency, and full diagnostic payloads.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation

Install all dependencies across backend and frontend:

```bash
# From the project root
npm run install:all
```

Or install individually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

> **Note on Core Package Dependency:**
> In development, `backend/package.json` links to the local package workspace:
> ```json
> "dependencies": {
>   "resilix": "file:../../npm_package/resilix"
> }
> ```
> To switch to the published npm package, simply run:
> ```bash
> cd backend && npm install resilix@latest
> ```

---

### 2. Environment Configuration

Copy the sample environment file in `backend`:

```bash
cd backend
cp .env.example .env
```

Default settings in `.env`:
```ini
PORT=5000
DEFAULT_MAX_RETRIES=3
DEFAULT_INITIAL_DELAY=300
DEFAULT_MAX_DELAY=5000
DEFAULT_FACTOR=2
DEFAULT_STRATEGY=exponential
DEFAULT_TIMEOUT=4000
DEFAULT_FAILURE_PROBABILITY=0.6
```

---

### 3. Running the Application

You can start the backend and frontend in separate terminals:

**Terminal 1 (Backend API):**
```bash
npm run start:backend
# Starts Express server on http://localhost:5000
```

**Terminal 2 (Frontend Dashboard):**
```bash
npm run start:frontend
# Starts Vite dev server on http://localhost:3000
```

Open your browser to **[http://localhost:3000](http://localhost:3000)** to interact with the dashboard.

---

## Automated Verification & Testing

The backend includes a comprehensive automated verification script that starts an in-process server and validates all 9 endpoints, deterministic retry scenarios, configuration updates, and error handling:

```bash
npm test
```

Expected output:
```text
[Test Runner] Verification server listening on http://localhost:5005
--- 1. Testing GET /health ---
   Status: 200 Health: healthy
--- 2. Testing GET /stats (initial) ---
   Status: 200 Total requests: 0
--- 3. Testing Scenario 1: Immediate Success (GET /users?scenario=immediate_success) ---
   Status: 200 Attempts: 1 Retries: 0 Recovered: false
--- 4. Testing Scenario 2: Fail Twice, Then Recover (GET /users?scenario=fail_twice_then_succeed) ---
   Status: 200 Attempts: 3 Retries: 2 Recovered: true
--- 5. Testing Scenario 3: Fail All / Exhaust Retries (GET /orders?scenario=fail_all) ---
   Status: 503 isResilixError: true Attempts made: 4
--- 6. Testing GET /products ---
   Status: 200 Success: true Attempts: 2
--- 7. Testing POST /config (live update) ---
   Status: 200 New maxRetries: 4
--- 8. Testing GET /stats (telemetry verification) ---
   Total requests: 4 Total retries: 6 Recoveries: 2
--- 9. Testing POST /reset ---
   Status: 200 Message: Demo statistics and execution logs reset successfully

✅ ALL 9 BACKEND VERIFICATION CHECKS PASSED SUCCESSFULLY!
```

To verify the frontend production build:
```bash
npm run build
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/health` | Server health check (`{ "status": "ok", "uptime": ... }`) |
| `GET` | `/stats` | Live resilience metrics and recent execution audit logs |
| `POST` | `/reset` | Resets all metrics, request counters, and logs to zero |
| `POST` | `/config` | Updates retry parameters dynamically (e.g. `maxRetries`, `initialDelay`, `strategy`) |
| `GET` | `/users` | Fetches user records through Resilix retry orchestration |
| `GET` | `/products` | Fetches inventory items through Resilix retry orchestration |
| `GET` | `/orders` | Processes checkout orders through Resilix retry orchestration |

All service endpoints support the `?scenario=` query parameter:
- `?scenario=immediate_success`
- `?scenario=fail_twice_then_succeed`
- `?scenario=fail_all`
- `?scenario=probabilistic`

---

## License

This project is licensed under the [MIT License](LICENSE).
Core Resilix Library: [https://github.com/Muskaan817/Resilix](https://github.com/Muskaan817/Resilix)
