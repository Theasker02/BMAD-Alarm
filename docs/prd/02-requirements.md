# PRD Shard · Requirements

Nguồn: `docs/prd.md`

## Functional Requirements

- **FR1:** Ứng dụng phải tự động theo dõi thời gian sử dụng máy tính (keyboard/mouse activity) mà không cần người dùng can thiệp.
- **FR2:** Ứng dụng phải hiển thị cảnh báo nghỉ ngơi sau mỗi 45 phút sử dụng liên tục (hoặc thời gian đã cài đặt).
- **FR3:** Ứng dụng phải cho phép người dùng điều chỉnh khoảng thời gian cảnh báo (mặc định 45 phút, có thể thay đổi).
- **FR4:** Ứng dụng phải cho phép người dùng chọn loại cảnh báo: popup window, system notification, hoặc sound alert.
- **FR5:** Ứng dụng phải hoạt động ở background (system tray) và không làm gián đoạn công việc của người dùng.
- **FR6:** Ứng dụng phải có giao diện settings để người dùng cấu hình các tùy chọn (thời gian cảnh báo, loại cảnh báo).
- **FR7:** Ứng dụng phải hiển thị thống kê cơ bản: số lần nghỉ ngơi trong ngày/tuần, thời gian sử dụng máy tính.
- **FR8:** Ứng dụng phải lưu trữ dữ liệu thống kê và cài đặt locally (SQLite database).
- **FR9:** Ứng dụng phải tự động reset timer khi người dùng nghỉ ngơi (không có keyboard/mouse activity trong một khoảng thời gian nhất định).
- **FR10:** Ứng dụng phải có khả năng chạy tự động khi khởi động hệ thống (optional, có thể bật/tắt).

## Non-Functional Requirements

- **NFR1:** Ứng dụng phải sử dụng <1% CPU khi idle và <5% CPU khi active để không ảnh hưởng đến hiệu suất hệ thống.
- **NFR2:** Ứng dụng phải sử dụng <50MB RAM để đảm bảo nhẹ và không tốn tài nguyên.
- **NFR3:** Ứng dụng phải khởi động trong <3 giây sau khi hệ thống boot.
- **NFR4:** Cảnh báo phải hiển thị trong <1 giây sau khi đạt đến thời gian đã cài đặt.
- **NFR5:** Ứng dụng phải hoạt động ổn định 24/7 không bị crash hoặc memory leak.
- **NFR6:** Ứng dụng phải tương thích với Windows 10/11 và macOS 10.15+ (cross-platform).
- **NFR7:** Ứng dụng phải hoạt động offline hoàn toàn, không cần internet connection.
- **NFR8:** Dữ liệu người dùng phải được lưu trữ locally, không gửi lên server (privacy-first).
- **NFR9:** Ứng dụng phải có khả năng detect user activity chính xác (keyboard/mouse activity hoặc active window).
- **NFR10:** Ứng dụng phải sử dụng native system notification APIs cho mỗi platform để đảm bảo trải nghiệm nhất quán.

