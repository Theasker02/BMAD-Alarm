# Epic 1 · Foundation & Core Infrastructure

Nguồn: `docs/prd.md`

**Epic Goal:** Thiết lập nền tảng vững chắc cho ứng dụng gồm project setup, activity detection, notification framework. Deliverable: working prototype chứng minh khả năng detect activity và gửi reminder cơ bản.

## Story 1.1: Project Setup and Development Environment
**As a** developer  
**I want** to set up the project structure and dev environment  
**So that** development có thể bắt đầu hiệu quả.

**Acceptance Criteria**
1. Repo monorepo structure (apps + packages) được tạo.
2. Dev environment (Node.js, Electron/Tauri, pnpm) cấu hình xong.
3. Build/dev scripts (pnpm dev/build) hoạt động.
4. Git init với `.gitignore`.
5. README có hướng dẫn setup.
6. App build & chạy được ít nhất trên một platform.

## Story 1.2: User Activity Detection – Windows
Implement keyboard/mouse detection bằng Windows API (GetLastInputInfo), trả về timestamp, polling định kỳ, test trên Windows 10/11, handle errors.

## Story 1.3: User Activity Detection – macOS
Sử dụng IOKit hoặc Quartz Event Services, trả về timestamp, polling, test macOS 10.15+, handle permissions/errors.

## Story 1.4: Activity Monitoring Service
Background service chạy liên tục, poll adapters, tính thời gian sử dụng, reset khi idle threshold (5 phút), start/stop/pause, logging.

## Story 1.5: Basic System Notification – Windows
Hiển thị Windows Toast Notification với message “Time for a break…”, test Windows 10/11, fallback khi API không khả dụng.

## Story 1.6: Basic System Notification – macOS
Hiển thị notification qua NSUserNotificationCenter, xin permission nếu cần, test macOS 10.15+.

## Story 1.7: Working Prototype Integration
Kết nối activity detection + monitoring + notifications thành prototype: detect, track, trigger reminder sau 45 phút (hoặc thời gian test ngắn), chạy trên Windows & macOS, logging & error handling.

