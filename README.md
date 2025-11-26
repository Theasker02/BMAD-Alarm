# Báo thức - Break Reminder Desktop Application

Ứng dụng desktop tự động nhắc nhở nghỉ ngơi sau mỗi 45 phút sử dụng máy tính liên tục để bảo vệ sức khỏe.

## Prerequisites

- **Node.js** >= 20.0.0 (LTS recommended)
- **pnpm** >= 8.0.0

## Installation

1. Clone repository:
```bash
git clone <repository-url>
cd bao-thuc
```

2. Install dependencies:
```bash
pnpm install
```

## Development

Run development server:
```bash
pnpm dev
```

This will:
- Start Vite dev server for React renderer
- Launch Electron with hot reload
- Open DevTools automatically

## Build

Build for production:
```bash
pnpm build
```

This creates distributable packages in `apps/desktop/dist-electron/` for Windows and macOS.

## Project Structure

```
apps/
  desktop/          # Electron main + renderer application
packages/
  core/             # Domain services (monitor, scheduler, repos)
  platform/         # OS adapters (Windows, macOS, Linux)
  ui/               # Shared UI components
  config/           # Configuration and schema loader
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint on all packages
- `pnpm test` - Run tests in all packages
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Tech Stack

- **Electron** 30.x - Desktop framework
- **Vite** 5.x - Build tool and dev server
- **React** 18 - UI framework
- **TypeScript** 5.x - Type safety
- **pnpm** - Package manager with workspaces

## License

MIT

"# BMAD-Alarm" 
