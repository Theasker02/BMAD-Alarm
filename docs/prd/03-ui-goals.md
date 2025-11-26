# PRD Shard · User Interface Design Goals

Nguồn: `docs/prd.md`

## Overall UX Vision

Giao diện của **Báo thức** được thiết kế với triết lý "minimal và non-intrusive". Ứng dụng chủ yếu hoạt động ở background với icon nhỏ trong system tray. Khi cần tương tác, giao diện sẽ đơn giản, rõ ràng, và tập trung vào các chức năng cốt lõi: cài đặt thời gian, chọn loại cảnh báo, và xem thống kê. Mục tiêu là người dùng có thể sử dụng ứng dụng mà không cần đọc hướng dẫn.

## Key Interaction Paradigms

- **System Tray First:** Ứng dụng chủ yếu tương tác qua system tray icon, click để mở settings hoặc xem thống kê.
- **Minimal Popups:** Cảnh báo nghỉ ngơi hiển thị dưới dạng non-blocking notification hoặc popup nhỏ, không chiếm toàn bộ màn hình.
- **Quick Settings:** Settings window đơn giản với các tùy chọn chính: thời gian cảnh báo, loại cảnh báo, auto-start.
- **Visual Statistics:** Thống kê hiển thị dưới dạng số liệu đơn giản và có thể có biểu đồ cơ bản.

## Core Screens

1. **System Tray Menu** – Open Settings, View Statistics, Pause/Resume, Quit.
2. **Settings Window** – Reminder interval slider, notification type selector, auto-start toggle, reset statistics button.
3. **Statistics View** – Breaks hôm nay/tuần, usage time, biểu đồ đơn giản.
4. **Reminder Popup/Notification** – Message “Time for a break! ...”, nút Dismiss, optional countdown.

## Accessibility

- Tuân thủ WCAG AA: color contrast ≥ 4.5:1; keyboard navigation; screen reader support; text size theo system settings.

## Branding

- Color scheme nhẹ nhàng (xanh lá/xanh dương), icon đơn giản, typography dễ đọc, không quảng cáo gây xao nhãng.

