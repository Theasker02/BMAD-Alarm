# Architecture Shard · Services & Data

Nguồn: `docs/architecture.md`

## Service Layers

1. **Activity Monitor** – Poll OS APIs mỗi 5s, phát sự kiện `ACTIVE` / `IDLE`.
2. **Scheduler** – Theo dõi elapsed time, reset khi idle, trigger reminder khi đạt ngưỡng.
3. **Reminder Pipeline** – Chọn channel (popup, notification, sound), gửi IPC/adapter, log event.
4. **Persistence Layer** – Repositories (settings, sessions, reminders, stats) dùng better-sqlite3.
5. **IPC Bridge** – `preload.ts` expose API an toàn với zod validation.

## SQLite Schema

| Table         | Columns                                                                                                      |
|---------------|--------------------------------------------------------------------------------------------------------------|
| `settings`    | `key TEXT PK`, `value TEXT`, `updated_at INTEGER`                                                            |
| `usage_sessions` | `id PK`, `start_ts`, `end_ts`, `duration_ms`, `platform`                                                |
| `reminders`   | `id PK`, `fired_at`, `type`, `response`                                                                      |
| `stats_daily` | `date TEXT PK`, `break_count`, `usage_minutes`, `longest_session_minutes`                                    |
| `migrations`  | `id PK`, `name TEXT UNIQUE`, `applied_at`                                                                    |

## IPC Contracts

| Channel            | Dir        | Payload                          | Purpose                      |
|--------------------|------------|----------------------------------|------------------------------|
| `settings:get`     | Renderer→Main | `{}`                         | Lấy toàn bộ settings         |
| `settings:update`  | Renderer→Main | `{ key, value }`             | Cập nhật 1 setting           |
| `stats:get`        | Renderer→Main | `{ range: 'today'|'week' }` | Lấy thống kê                 |
| `reminder:test`    | Renderer→Main | `{ type }`                  | Thử notification             |
| `app:state`        | Main→Renderer | `{ status, countdownMs }`   | UI hiển thị trạng thái       |

Zod schemas kiểm tra payload trước khi thao tác.

