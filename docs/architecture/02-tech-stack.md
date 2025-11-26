# Architecture Shard · Tech Stack & Environment

Nguồn: `docs/architecture.md`

## Tech Stack (Tóm tắt)

| Layer        | Technology                            | Notes                                   |
|--------------|----------------------------------------|-----------------------------------------|
| Language     | TypeScript 5.x                         | Main + renderer strict typing           |
| Runtime      | Node.js 20 LTS                         | Electron bundle                         |
| Desktop Shell| Electron 30.x + Electron Forge         | Packaging, auto-update                  |
| UI           | React 18 + Vite + Tailwind/Radix       | Minimal desktop UI                      |
| State Mgmt   | Zustand + React Query                  | Settings + async data                   |
| Storage      | SQLite (better-sqlite3)                | Local persistence                       |
| Scheduler    | node-cron/custom                      | Reminder engine                         |
| IPC          | Electron IPC + contextBridge           | Typed contracts                         |
| Notifications| Windows Toast, macOS NSUserNotification| Platform adapters                       |
| Testing      | Vitest, Testing Library, Playwright    | Unit + E2E                              |
| Linting      | ESLint flat config + Prettier          | Enforced via Husky                      |
| Logging      | pino + (optional) Sentry               | Local logs + crash reporting            |
| CI/CD        | GitHub Actions                         | Build/test/publish installers           |

## Environment Strategy

| Env  | Purpose             | Notes                                           |
|------|---------------------|--------------------------------------------------|
| dev  | Local development   | `pnpm dev`, hot reload, mocked activity inputs   |
| qa   | Internal testing    | Signed builds, debug logging                     |
| prod | Public releases     | Signed installers, auto-update enabled           |

Secrets (signing certs, Sentry DSN) lưu trong GitHub Actions secrets. `.env` quản lý qua `dotenv-safe`.

