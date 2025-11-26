# Báo thức Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Người dùng được tự động nhắc nhở nghỉ ngơi sau mỗi 45 phút sử dụng máy tính liên tục để bảo vệ sức khỏe
- Ứng dụng tự động theo dõi thời gian sử dụng máy tính mà không cần người dùng can thiệp
- Người dùng có thể tùy chỉnh khoảng thời gian cảnh báo và loại cảnh báo phù hợp với nhu cầu
- Ứng dụng hoạt động ổn định ở background không làm gián đoạn công việc của người dùng
- Người dùng có thể xem thống kê cơ bản về thói quen nghỉ ngơi của mình
- Đạt 70% user retention sau 30 ngày sử dụng
- Đạt 80% reminder response rate (người dùng nghỉ ngơi sau khi nhận cảnh báo)

### Background Context

**Báo thức** được phát triển để giải quyết vấn đề người dùng máy tính quá say mê làm việc mà quên đi sức khỏe của bản thân. Nghiên cứu cho thấy sử dụng màn hình liên tục >2 giờ có thể gây khô mắt, mỏi mắt, đau cổ, đau lưng và các vấn đề sức khỏe khác. Các giải pháp hiện tại như báo thức truyền thống yêu cầu người dùng tự đặt (dễ bị quên hoặc bỏ qua), trong khi các ứng dụng Pomodoro tập trung vào quản lý thời gian hơn là sức khỏe.

**Báo thức** khác biệt bằng cách tự động hoàn toàn - không cần cấu hình, tự động theo dõi và nhắc nhở. Ứng dụng hoạt động ở background, không xâm phạm, và chỉ hiển thị thông báo nhẹ nhàng khi đến thời điểm nghỉ. Giải pháp này phù hợp với xu hướng làm việc từ xa ngày càng tăng và nhu cầu về sức khỏe kỹ thuật số.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-26 | 1.0 | Initial PRD creation | PM (John) |

## Requirements

### Functional

**FR1:** Ứng dụng phải tự động theo dõi thời gian sử dụng máy tính (keyboard/mouse activity) mà không cần người dùng can thiệp.

**FR2:** Ứng dụng phải hiển thị cảnh báo nghỉ ngơi sau mỗi 45 phút sử dụng liên tục (hoặc thời gian đã cài đặt).

**FR3:** Ứng dụng phải cho phép người dùng điều chỉnh khoảng thời gian cảnh báo (mặc định 45 phút, có thể thay đổi).

**FR4:** Ứng dụng phải cho phép người dùng chọn loại cảnh báo: popup window, system notification, hoặc sound alert.

**FR5:** Ứng dụng phải hoạt động ở background (system tray) và không làm gián đoạn công việc của người dùng.

**FR6:** Ứng dụng phải có giao diện settings để người dùng cấu hình các tùy chọn (thời gian cảnh báo, loại cảnh báo).

**FR7:** Ứng dụng phải hiển thị thống kê cơ bản: số lần nghỉ ngơi trong ngày/tuần, thời gian sử dụng máy tính.

**FR8:** Ứng dụng phải lưu trữ dữ liệu thống kê và cài đặt locally (SQLite database).

**FR9:** Ứng dụng phải tự động reset timer khi người dùng nghỉ ngơi (không có keyboard/mouse activity trong một khoảng thời gian nhất định).

**FR10:** Ứng dụng phải có khả năng chạy tự động khi khởi động hệ thống (optional, có thể bật/tắt).

### Non Functional

**NFR1:** Ứng dụng phải sử dụng <1% CPU khi idle và <5% CPU khi active để không ảnh hưởng đến hiệu suất hệ thống.

**NFR2:** Ứng dụng phải sử dụng <50MB RAM để đảm bảo nhẹ và không tốn tài nguyên.

**NFR3:** Ứng dụng phải khởi động trong <3 giây sau khi hệ thống boot.

**NFR4:** Cảnh báo phải hiển thị trong <1 giây sau khi đạt đến thời gian đã cài đặt.

**NFR5:** Ứng dụng phải hoạt động ổn định 24/7 không bị crash hoặc memory leak.

**NFR6:** Ứng dụng phải tương thích với Windows 10/11 và macOS 10.15+ (cross-platform).

**NFR7:** Ứng dụng phải hoạt động offline hoàn toàn, không cần internet connection.

**NFR8:** Dữ liệu người dùng phải được lưu trữ locally, không gửi lên server (privacy-first).

**NFR9:** Ứng dụng phải có khả năng detect user activity chính xác (keyboard/mouse activity hoặc active window).

**NFR10:** Ứng dụng phải sử dụng native system notification APIs cho mỗi platform để đảm bảo trải nghiệm nhất quán.

## User Interface Design Goals

### Overall UX Vision

Giao diện của **Báo thức** được thiết kế với triết lý "minimal và non-intrusive". Ứng dụng chủ yếu hoạt động ở background với icon nhỏ trong system tray. Khi cần tương tác, giao diện sẽ đơn giản, rõ ràng, và tập trung vào các chức năng cốt lõi: cài đặt thời gian, chọn loại cảnh báo, và xem thống kê. Mục tiêu là người dùng có thể sử dụng ứng dụng mà không cần đọc hướng dẫn.

### Key Interaction Paradigms

- **System Tray First:** Ứng dụng chủ yếu tương tác qua system tray icon, click để mở settings hoặc xem thống kê
- **Minimal Popups:** Cảnh báo nghỉ ngơi hiển thị dưới dạng non-blocking notification hoặc popup nhỏ, không chiếm toàn bộ màn hình
- **Quick Settings:** Settings window đơn giản với các tùy chọn chính: thời gian cảnh báo, loại cảnh báo, auto-start
- **Visual Statistics:** Thống kê hiển thị dưới dạng số liệu đơn giản và có thể có biểu đồ cơ bản

### Core Screens and Views

1. **System Tray Menu:** Menu context khi click vào system tray icon
   - Open Settings
   - View Statistics
   - Pause/Resume
   - Quit

2. **Settings Window:** Giao diện cài đặt chính
   - Reminder Interval (slider hoặc input, mặc định 45 phút)
   - Reminder Type (radio buttons: Popup, Notification, Sound)
   - Auto-start on boot (checkbox)
   - Reset Statistics button

3. **Statistics View:** Hiển thị thống kê
   - Breaks today/week (số lần nghỉ ngơi)
   - Total usage time today/week
   - Simple chart showing break frequency

4. **Reminder Popup/Notification:** Cảnh báo nghỉ ngơi
   - Non-blocking popup hoặc system notification
   - Message: "Time for a break! You've been using your computer for 45 minutes."
   - Optional: "Dismiss" button

### Accessibility: WCAG AA

Ứng dụng sẽ tuân thủ WCAG AA standards:
- Color contrast đủ cho text và background
- Keyboard navigation cho settings window
- Screen reader support cho các thông báo
- Text size có thể điều chỉnh (theo system settings)

### Branding

Ứng dụng sẽ có branding tối giản, tập trung vào sức khỏe và sự đơn giản:
- Color scheme: Soft, calming colors (có thể xanh lá nhẹ hoặc xanh dương nhẹ)
- Icons: Simple, clear icons cho system tray và notifications
- Typography: Clean, readable fonts
- No aggressive marketing hoặc distracting elements

### Target Device and Platforms: Cross-Platform Desktop

- **Windows 10/11:** Native desktop application
- **macOS 10.15+:** Native desktop application
- **Linux (Ubuntu 20.04+):** Native desktop application (optional cho MVP, có thể thêm sau)

## Technical Assumptions

### Repository Structure: Monorepo

Sử dụng monorepo structure để quản lý code cho cả Windows, macOS, và Linux trong cùng một repository. Điều này giúp:
- Chia sẻ code chung giữa các platforms
- Dễ dàng maintain và sync changes
- Có thể có platform-specific code trong các folders riêng

**Rationale:** Vì đây là desktop app cần cross-platform, monorepo giúp quản lý codebase hiệu quả hơn polyrepo.

### Service Architecture: Desktop Application with Background Service

Ứng dụng sẽ có kiến trúc desktop application với background service:
- **Main Process:** Theo dõi user activity, quản lý timer, trigger notifications
- **UI Process:** Hiển thị settings window và statistics view
- **Background Service:** Chạy liên tục để monitor activity và trigger reminders

**Rationale:** Desktop app không cần server architecture. Background service pattern phù hợp cho ứng dụng cần chạy liên tục.

### Testing Requirements: Unit + Integration

- **Unit Tests:** Test các core functions (timer logic, activity detection, data storage)
- **Integration Tests:** Test flow từ activity detection → timer → notification
- **Manual Testing:** Test trên các platforms khác nhau (Windows, macOS) để đảm bảo compatibility

**Rationale:** Vì đây là MVP và solo developer, không cần full testing pyramid. Unit + Integration tests đủ để đảm bảo chất lượng cơ bản.

### Additional Technical Assumptions and Requests

- **Technology Stack:** Sử dụng Electron hoặc Tauri để cross-platform development
  - **Electron:** Pros: Mature, large ecosystem, easy to use. Cons: Larger bundle size, higher memory usage
  - **Tauri:** Pros: Smaller bundle, better performance, Rust backend. Cons: Less mature, smaller ecosystem
  - **Recommendation:** Electron cho MVP (dễ develop hơn), có thể migrate sang Tauri sau nếu cần performance tốt hơn

- **User Activity Detection:**
  - **Windows:** Sử dụng Windows API (GetLastInputInfo) để detect keyboard/mouse activity
  - **macOS:** Sử dụng IOKit hoặc Quartz Event Services để detect activity
  - **Linux:** Sử dụng X11 hoặc Wayland APIs tùy desktop environment

- **Data Storage:** SQLite database local để lưu:
  - Settings (reminder interval, reminder type, auto-start)
  - Statistics (breaks per day/week, usage time)
  - Timestamps và activity logs

- **Notification System:**
  - **Windows:** Windows 10/11 Toast Notifications API
  - **macOS:** NSUserNotificationCenter
  - **Linux:** Desktop notification spec (freedesktop.org)

- **System Tray Integration:**
  - **Windows:** System Tray API
  - **macOS:** NSStatusItem
  - **Linux:** AppIndicator hoặc StatusNotifierItem

- **Auto-start:**
  - **Windows:** Registry hoặc Startup folder
  - **macOS:** Launch Agents (plist file)
  - **Linux:** systemd user service hoặc autostart .desktop file

## Epic List

**Epic 1: Foundation & Core Infrastructure**
Thiết lập project structure, development environment, và core infrastructure bao gồm activity detection, timer system, và basic UI framework. Epic này cũng sẽ deliver một working prototype có thể detect activity và hiển thị notification cơ bản.

**Epic 2: Reminder System & Notifications**
Xây dựng hệ thống reminder hoàn chỉnh với timer logic, multiple notification types (popup, system notification, sound), và user preferences management. Epic này sẽ deliver core functionality của ứng dụng.

**Epic 3: Settings & Configuration UI**
Tạo giao diện settings đầy đủ cho phép người dùng cấu hình reminder interval, notification type, auto-start, và các tùy chọn khác. Epic này cũng bao gồm system tray integration.

**Epic 4: Statistics & Data Persistence**
Implement data storage (SQLite), statistics tracking, và UI để hiển thị thống kê cơ bản về thói quen nghỉ ngơi của người dùng.

## Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Thiết lập nền tảng vững chắc cho ứng dụng bao gồm project setup, development environment, core activity detection system, và basic notification framework. Epic này sẽ deliver một working prototype có thể detect user activity và hiển thị notification cơ bản, đảm bảo technical feasibility trước khi phát triển các features phức tạp hơn.

### Story 1.1: Project Setup and Development Environment

As a developer,
I want to set up the project structure and development environment,
so that I can start developing the application efficiently.

**Acceptance Criteria:**
1. Project repository được tạo với monorepo structure phù hợp cho cross-platform desktop app
2. Development environment được setup (Node.js, Electron/Tauri, dependencies)
3. Build scripts và development scripts được cấu hình (npm scripts hoặc tương đương)
4. Git repository được initialize với .gitignore phù hợp
5. Basic project documentation (README) được tạo với hướng dẫn setup
6. Code có thể build và run được trên ít nhất một platform (Windows hoặc macOS)

### Story 1.2: User Activity Detection - Windows

As a developer,
I want to implement user activity detection for Windows platform,
so that the application can track when the user is actively using the computer.

**Acceptance Criteria:**
1. Function detect keyboard/mouse activity trên Windows sử dụng Windows API (GetLastInputInfo)
2. Function trả về timestamp của lần activity cuối cùng
3. Function có thể được gọi định kỳ (polling) để check activity
4. Code được test trên Windows 10/11 và hoạt động chính xác
5. Error handling được implement cho các edge cases (API failures, permissions)

### Story 1.3: User Activity Detection - macOS

As a developer,
I want to implement user activity detection for macOS platform,
so that the application can track when the user is actively using the computer on Mac.

**Acceptance Criteria:**
1. Function detect keyboard/mouse activity trên macOS sử dụng IOKit hoặc Quartz Event Services
2. Function trả về timestamp của lần activity cuối cùng
3. Function có thể được gọi định kỳ (polling) để check activity
4. Code được test trên macOS 10.15+ và hoạt động chính xác
5. Error handling được implement cho các edge cases
6. Permissions được handle đúng cách (nếu cần user consent)

### Story 1.4: Activity Monitoring Service

As a developer,
I want to create a background service that continuously monitors user activity,
so that the application can track usage time accurately.

**Acceptance Criteria:**
1. Background service được tạo có thể chạy liên tục
2. Service poll activity detection functions định kỳ (ví dụ: mỗi 30 giây)
3. Service tính toán thời gian sử dụng liên tục dựa trên activity
4. Service reset timer khi không có activity trong một khoảng thời gian (ví dụ: 5 phút)
5. Service có thể start/stop/pause/resume
6. Service log activity data để debug (có thể disable trong production)

### Story 1.5: Basic System Notification - Windows

As a developer,
I want to implement basic system notification for Windows,
so that the application can display reminders to users.

**Acceptance Criteria:**
1. Function hiển thị Windows Toast Notification sử dụng Windows 10/11 Toast API
2. Notification hiển thị message "Time for a break! You've been using your computer for X minutes."
3. Notification có thể được dismissed bởi user
4. Code được test trên Windows 10/11 và notification hiển thị đúng
5. Error handling được implement (fallback nếu API không available)

### Story 1.6: Basic System Notification - macOS

As a developer,
I want to implement basic system notification for macOS,
so that the application can display reminders to users on Mac.

**Acceptance Criteria:**
1. Function hiển thị macOS notification sử dụng NSUserNotificationCenter
2. Notification hiển thị message "Time for a break! You've been using your computer for X minutes."
3. Notification có thể được dismissed bởi user
4. Code được test trên macOS 10.15+ và notification hiển thị đúng
5. Permissions được handle đúng cách (request notification permission nếu cần)

### Story 1.7: Working Prototype Integration

As a developer,
I want to integrate activity detection, monitoring service, and notifications into a working prototype,
so that I can verify the core functionality works end-to-end.

**Acceptance Criteria:**
1. Activity detection, monitoring service, và notifications được integrate với nhau
2. Prototype có thể detect activity, track time, và hiển thị notification sau 45 phút (hoặc thời gian test ngắn hơn)
3. Prototype chạy được trên cả Windows và macOS
4. Basic error handling và logging được implement
5. Prototype có thể được build và run từ source code

## Epic 2: Reminder System & Notifications

**Epic Goal:** Xây dựng hệ thống reminder hoàn chỉnh với timer logic chính xác, multiple notification types (popup window, system notification, sound), và user preferences management. Epic này sẽ deliver core functionality của ứng dụng - khả năng tự động nhắc nhở người dùng nghỉ ngơi sau khoảng thời gian đã cài đặt.

### Story 2.1: Configurable Reminder Timer

As a user,
I want to set a custom reminder interval (default 45 minutes),
so that I can adjust the break frequency to my preference.

**Acceptance Criteria:**
1. Application có default reminder interval là 45 phút
2. User có thể thay đổi reminder interval (ví dụ: 30-120 phút)
3. Timer sử dụng interval đã cài đặt để trigger reminders
4. Timer reset đúng cách sau mỗi reminder
5. Settings được persist và load lại khi app restart
6. Validation được implement (minimum 15 phút, maximum 180 phút)

### Story 2.2: Multiple Notification Types - Popup Window

As a user,
I want to receive reminders as a popup window,
so that I have a visible, attention-grabbing reminder to take a break.

**Acceptance Criteria:**
1. Popup window được hiển thị khi reminder trigger
2. Popup hiển thị message rõ ràng về việc nghỉ ngơi
3. Popup có "Dismiss" button để đóng
4. Popup không block toàn bộ screen (non-modal hoặc có thể minimize)
5. Popup tự động đóng sau một khoảng thời gian (ví dụ: 30 giây) nếu user không tương tác
6. Popup hoạt động trên cả Windows và macOS

### Story 2.3: Multiple Notification Types - System Notification

As a user,
I want to receive reminders as system notifications,
so that I get a less intrusive reminder that doesn't interrupt my workflow.

**Acceptance Criteria:**
1. System notification được hiển thị khi reminder trigger
2. Notification hiển thị message về việc nghỉ ngơi
3. Notification có thể được dismissed bởi user
4. Notification sử dụng native system notification APIs
5. Notification hoạt động trên cả Windows và macOS
6. Notification có icon và title phù hợp

### Story 2.4: Multiple Notification Types - Sound Alert

As a user,
I want to receive reminders with sound alerts,
so that I can be notified even when I'm not looking at the screen.

**Acceptance Criteria:**
1. Sound alert được phát khi reminder trigger
2. Sound có thể được enable/disable trong settings
3. Sound volume có thể được điều chỉnh (hoặc sử dụng system volume)
4. Sound file được include trong application bundle
5. Sound hoạt động trên cả Windows và macOS
6. Sound có thể được combine với popup hoặc system notification

### Story 2.5: Notification Type Selection and Persistence

As a user,
I want to choose my preferred notification type and have it saved,
so that the application remembers my preference.

**Acceptance Criteria:**
1. User có thể chọn notification type: Popup, System Notification, Sound, hoặc combination
2. Selection được persist trong settings
3. Application sử dụng notification type đã chọn khi trigger reminder
4. Settings được load khi app start
5. Default notification type là System Notification nếu user chưa chọn

### Story 2.6: Break Detection and Timer Reset

As a user,
I want the timer to automatically reset when I take a break (no activity),
so that the reminder system accurately tracks my continuous usage time.

**Acceptance Criteria:**
1. System detect khi không có user activity trong một khoảng thời gian (ví dụ: 5 phút)
2. Timer tự động reset về 0 khi break được detect
3. Break threshold có thể được cấu hình (ví dụ: 3-10 phút)
4. Logic xử lý edge cases (user quay lại trước khi break threshold đạt)
5. Break detection hoạt động chính xác trên cả Windows và macOS

## Epic 3: Settings & Configuration UI

**Epic Goal:** Tạo giao diện settings đầy đủ và user-friendly cho phép người dùng cấu hình tất cả các tùy chọn của ứng dụng. Epic này cũng bao gồm system tray integration để người dùng có thể dễ dàng truy cập ứng dụng và settings.

### Story 3.1: System Tray Integration

As a user,
I want the application to run in the system tray,
so that it doesn't clutter my taskbar and runs unobtrusively in the background.

**Acceptance Criteria:**
1. Application icon xuất hiện trong system tray khi app chạy
2. Icon có visual indicator (có thể thay đổi màu hoặc icon) khi reminder sắp trigger
3. Right-click vào icon hiển thị context menu với options: Open Settings, View Statistics, Pause/Resume, Quit
4. Left-click vào icon có thể mở settings window hoặc show menu (tùy platform convention)
5. System tray integration hoạt động trên cả Windows và macOS
6. Icon có tooltip hiển thị status (ví dụ: "Báo thức - Active, 30 minutes remaining")

### Story 3.2: Settings Window - Basic Layout

As a user,
I want to access a settings window to configure the application,
so that I can customize the reminder behavior to my needs.

**Acceptance Criteria:**
1. Settings window có thể được mở từ system tray menu
2. Window có layout rõ ràng với các sections: Reminder Settings, Notification Settings, General
3. Window có thể được minimize, maximize, và close
4. Window size và position được remember khi user đóng và mở lại
5. Window có title "Báo thức - Settings"
6. Window hoạt động trên cả Windows và macOS

### Story 3.3: Settings Window - Reminder Interval Configuration

As a user,
I want to adjust the reminder interval in the settings,
so that I can set how often I want to be reminded to take breaks.

**Acceptance Criteria:**
1. Settings có input field hoặc slider để set reminder interval
2. Input có validation (minimum 15 phút, maximum 180 phút)
3. Value được hiển thị rõ ràng (ví dụ: "45 minutes")
4. Changes được apply ngay lập tức (timer sử dụng interval mới)
5. Value được persist và load lại khi app restart
6. UI có label và instructions rõ ràng

### Story 3.4: Settings Window - Notification Type Selection

As a user,
I want to choose my preferred notification type in the settings,
so that I receive reminders in the way that works best for me.

**Acceptance Criteria:**
1. Settings có radio buttons hoặc checkboxes để chọn notification type
2. Options: Popup Window, System Notification, Sound Alert (có thể chọn multiple)
3. Selection được apply ngay lập tức
4. Selection được persist và load lại khi app restart
5. UI có description cho mỗi option để user hiểu sự khác biệt
6. Default selection là System Notification nếu user chưa chọn

### Story 3.5: Settings Window - Auto-start Configuration

As a user,
I want to enable/disable auto-start on system boot,
so that the application can start automatically when I turn on my computer.

**Acceptance Criteria:**
1. Settings có checkbox để enable/disable auto-start
2. Khi enable, application được add vào system startup (Windows: Registry/Startup folder, macOS: Launch Agents)
3. Khi disable, application được remove khỏi system startup
4. Setting được persist và load lại khi app restart
5. Auto-start hoạt động trên cả Windows và macOS
6. User được thông báo rõ ràng về permission requirements (nếu cần)

### Story 3.6: Settings Window - Reset Statistics

As a user,
I want to reset my statistics in the settings,
so that I can start fresh if needed.

**Acceptance Criteria:**
1. Settings có "Reset Statistics" button
2. Button có confirmation dialog để prevent accidental reset
3. Khi confirm, tất cả statistics data được xóa (breaks, usage time)
4. Statistics được reset về 0 và UI update ngay lập tức
5. Reset không ảnh hưởng đến settings (reminder interval, notification type, etc.)

### Story 3.7: Pause/Resume Functionality

As a user,
I want to pause and resume the reminder system,
so that I can temporarily disable reminders when needed (e.g., during important meetings).

**Acceptance Criteria:**
1. System tray menu có "Pause" option khi app đang active
2. System tray menu có "Resume" option khi app đang paused
3. Khi pause, timer dừng và không trigger reminders
4. When resume, timer tiếp tục từ thời điểm đã pause
5. System tray icon có visual indicator khi app paused (ví dụ: icon màu xám)
6. Pause/resume state được persist (nếu user muốn, có thể là temporary only)

## Epic 4: Statistics & Data Persistence

**Epic Goal:** Implement data storage system và statistics tracking để người dùng có thể theo dõi thói quen nghỉ ngơi của mình. Epic này sẽ deliver SQLite database, data persistence layer, và UI để hiển thị thống kê cơ bản.

### Story 4.1: SQLite Database Setup and Schema

As a developer,
I want to set up SQLite database with proper schema,
so that the application can store settings and statistics data persistently.

**Acceptance Criteria:**
1. SQLite database được tạo trong user data directory (platform-specific)
2. Database schema có tables: settings, statistics, activity_logs
3. Settings table lưu: reminder_interval, notification_type, auto_start, break_threshold
4. Statistics table lưu: date, breaks_count, total_usage_time, longest_session
5. Activity_logs table lưu: timestamp, activity_type (active/inactive)
6. Database migration system được implement (nếu cần update schema sau này)
7. Database được initialize khi app first run

### Story 4.2: Settings Persistence

As a user,
I want my settings to be saved automatically,
so that the application remembers my preferences when I restart it.

**Acceptance Criteria:**
1. Settings được save vào database mỗi khi user thay đổi
2. Settings được load từ database khi app start
3. Settings được apply đúng cách (reminder interval, notification type, auto-start)
4. Default settings được sử dụng nếu database không có data
5. Settings persistence hoạt động reliable trên cả Windows và macOS

### Story 4.3: Statistics Tracking - Break Counting

As a developer,
I want to track the number of breaks taken each day,
so that users can see their break frequency statistics.

**Acceptance Criteria:**
1. System track số lần reminder được trigger mỗi ngày
2. Break count được increment mỗi khi reminder trigger
3. Break count được reset mỗi ngày mới (hoặc track per day)
4. Data được save vào database
5. Break count được aggregate cho weekly statistics
6. Edge cases được handle (app restart, date change)

### Story 4.4: Statistics Tracking - Usage Time

As a developer,
I want to track total usage time each day,
so that users can see how much time they spend on the computer.

**Acceptance Criteria:**
1. System track total time user active trên máy tính mỗi ngày
2. Usage time được tính từ activity detection (sum of active periods)
3. Usage time được save vào database mỗi ngày
4. Usage time được aggregate cho weekly statistics
5. Usage time được format đúng cách (hours:minutes)
6. Edge cases được handle (app restart, long idle periods)

### Story 4.5: Statistics View - Basic Display

As a user,
I want to view my break and usage statistics,
so that I can see my progress in maintaining healthy break habits.

**Acceptance Criteria:**
1. Statistics view có thể được mở từ system tray menu
2. View hiển thị: Breaks today, Breaks this week, Total usage time today, Total usage time this week
3. Data được load từ database và hiển thị đúng
4. View có layout rõ ràng và dễ đọc
5. View update real-time khi có data mới (hoặc refresh khi mở lại)
6. View hoạt động trên cả Windows và macOS

### Story 4.6: Statistics View - Weekly Summary

As a user,
I want to see a weekly summary of my statistics,
so that I can understand my break habits over time.

**Acceptance Criteria:**
1. Statistics view có section "This Week" hiển thị:
   - Total breaks this week
   - Average breaks per day
   - Total usage time this week
   - Average usage time per day
2. Data được tính từ database (last 7 days)
3. Weekly summary được format đúng cách và dễ đọc
4. View có thể scroll hoặc có pagination nếu cần
5. Weekly summary update khi có data mới

### Story 4.7: Data Export (Optional for MVP)

As a user,
I want to export my statistics data,
so that I can analyze my habits in external tools or keep a backup.

**Acceptance Criteria:**
1. Statistics view có "Export" button
2. Export tạo file CSV hoặc JSON với statistics data
3. File được save vào user-selected location
4. Export includes: date, breaks_count, usage_time cho mỗi ngày
5. Export format có thể được đọc bởi Excel, Google Sheets, hoặc text editor
6. Export có error handling nếu file write fails

## Checklist Results Report

*(Will be populated after running PM checklist)*

## Next Steps

### UX Expert Prompt

Please review this PRD and create a Front-end Specification document. Focus on the UI/UX design for the Settings window, Statistics view, and Reminder popup/notifications. Consider the minimal, non-intrusive design philosophy and ensure the interface is simple, clear, and user-friendly.

### Architect Prompt

Please review this PRD and create a Full-stack Architecture document. Focus on the technical architecture for a cross-platform desktop application using Electron (or Tauri). Include details on activity detection implementation, notification system, data persistence with SQLite, system tray integration, and auto-start functionality for Windows and macOS.

---

**Document Status:** Draft v1.0  
**Created:** 2025-11-26  
**Last Updated:** 2025-11-26  
**Author:** PM (John)

