# Architecture Shard · Security, Observability & Deployment

Nguồn: `docs/architecture.md`

## Security

- **Context Isolation** bật; renderer không có quyền Node.
- **Content Security Policy** ngăn remote code execution.
- **Code Signing** cho Windows/macOS; bắt buộc cho notarization.
- **Auto-update Integrity**: electron-updater với SHA512.
- **Data Privacy**: dữ liệu chỉ lưu local; tùy chọn mã hóa AES trong tương lai.
- **Crash Reporting**: Sentry (nếu cấu hình) với PII scrubbed.

## Observability

- `pino` log files tại `%APPDATA%/BaoThuc/logs`.
- Log level: `debug` (dev), `info` (prod).
- Crash reports gửi Sentry + mã lỗi hiển thị trong diagnostics view.

## Deployment

1. **CI Pipeline (GitHub Actions)**
   - `pnpm install`
   - `pnpm lint && pnpm test && pnpm build`
   - Electron Forge package từng OS
   - Draft GitHub Release với artifacts.
2. **Distribution**
   - GitHub Releases (.exe, .dmg, .AppImage) + feed auto-update.
   - Tùy chọn store submissions (MS Store, Mac App Store) sau này.
3. **Auto Update**
   - electron-updater kiểm tra release feed.
   - UI thông báo có update + release notes.

## Migration (Tauri)

- Thay Electron main bằng Rust backend, giữ React UI.
- Dùng `tauri-plugin-autostart`, `tauri-plugin-notification`.
- SQLite thông qua `sqlx`/`sea-orm`.
- Bảo toàn domain services & IPC contracts (map sang Tauri commands).

