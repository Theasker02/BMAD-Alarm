# PRD Shard · Technical Considerations & Constraints

Nguồn: `docs/prd.md`

## Technical Considerations

### Platform Requirements
- Windows 10/11, macOS 10.15+, (tùy chọn) Linux Ubuntu 20.04+
- Desktop app native; performance: CPU <1% idle/<5% active, RAM <50 MB, startup <3s, notification latency <1s.

### Technology Preferences
- **Frontend:** Electron + React/Vite (hoặc Tauri tương lai) với UI framework nhẹ (Tailwind/Radix).
- **Backend (local):** Node.js trong main process hoặc Rust (Tauri). Local-first architecture.
- **Database:** SQLite lưu settings, statistics.
- **Hosting:** Không cần backend; phân phối installer qua GitHub Releases hoặc store.

### Architecture Considerations
- Monorepo (apps + packages) cho main/renderer/shared logic.
- Desktop app with background service (activity monitor + scheduler).
- Integration với OS APIs: activity detection, notifications, system tray, auto-start.
- Security/privacy: local storage only, minimal permissions.

## Constraints

- **Budget:** MVP self-funded ~$0; chỉ chi phí nhỏ cho assets/signing nếu cần.
- **Timeline:** MVP 4-6 tuần; beta 2 tuần; public release 1-2 tuần sau beta.
- **Resources:** Solo dev hoặc team 1-2 người; không có designer riêng; hạn chế marketing.
- **Technical:** Bắt buộc hỗ trợ ≥2 platforms; activity detection chính xác; không xung đột với ứng dụng khác.

## Key Assumptions

- Người dùng muốn giải pháp tự động, không cần cấu hình nhiều.
- 45 phút là khoảng thời gian hợp lý (có thể chỉnh).
- Người dùng không tắt ứng dụng ngay và có quyền cài đặt app.
- OS notification APIs hoạt động ổn định; không cần internet.

## Risks & Open Questions

- Người dùng có thể thấy phiền → cần UX tinh tế, tùy chỉnh Snooze.
- API khác biệt giữa platforms → cần adapter + testing.
- Battery/performance → tối ưu code, giám sát.
- Cạnh tranh → khác biệt nhờ tự động, tập trung sức khỏe.
- Story: snooze, break timer, calendar integration? cần xác nhận.

## Areas for Research

- API detect activity từng platform.
- Notification frameworks native.
- Competitive analysis (Pomodoro, break reminder apps).
- Hành vi nghỉ ngơi của người dùng; lợi ích sức khỏe khoa học.

