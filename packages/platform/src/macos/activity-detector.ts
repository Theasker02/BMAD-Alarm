import ffi from 'ffi-napi';
import pino from 'pino';

/**
 * macOS Activity Detector
 * Detects user keyboard and mouse activity using macOS Quartz Event Services
 * Uses CGEventSourceSecondsSinceLastEventType API
 */

// Logger instance
const logger = pino({
  name: 'macos-activity-detector',
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * macOS Activity Detector
 * Detects user keyboard and mouse activity using macOS Quartz Event Services
 */
export class ActivityDetector {
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastInputTime: number = 0;
  private activityCallbacks: Array<(timestamp: number) => void> = [];
  private isPolling: boolean = false;
  private cgEventSourceSecondsSinceLastEventType: (() => number) | null = null;
  private isApiAvailable: boolean = false;

  constructor() {
    this.initializeMacOSAPI();
  }

  /**
   * Initialize macOS API bindings
   * Uses Quartz Event Services: CGEventSourceSecondsSinceLastEventType
   */
  private initializeMacOSAPI(): void {
    // Only initialize on macOS platform
    if (process.platform !== 'darwin') {
      logger.warn('macOS Activity Detector initialized on non-macOS platform');
      this.isApiAvailable = false;
      return;
    }

    try {
      // Load CoreGraphics framework
      const coreGraphics = ffi.Library('/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics', {
        CGEventSourceSecondsSinceLastEventType: ['double', ['int', 'int']],
      });

      // Constants for CGEventSourceStateID and CGEventType
      // kCGEventSourceStateHIDSystemState = 1
      // kCGAnyInputEventType = 0
      const kCGEventSourceStateHIDSystemState = 1;
      const kCGAnyInputEventType = 0;

      // Create function wrapper
      this.cgEventSourceSecondsSinceLastEventType = (): number => {
        return coreGraphics.CGEventSourceSecondsSinceLastEventType(
          kCGEventSourceStateHIDSystemState,
          kCGAnyInputEventType
        );
      };

      // Test API availability
      try {
        const testResult = this.cgEventSourceSecondsSinceLastEventType();
        if (testResult >= 0) {
          this.isApiAvailable = true;
          logger.info('macOS API CGEventSourceSecondsSinceLastEventType initialized successfully');
        } else {
          logger.warn('macOS API test call returned invalid result');
          this.isApiAvailable = false;
        }
      } catch (testError) {
        logger.warn({ error: testError }, 'macOS API test call failed - may require Accessibility permissions');
        // API might still work, but permissions may be needed
        this.isApiAvailable = true; // Set to true, will handle errors in getLastInputTime
      }
    } catch (error) {
      logger.error({ error }, 'Failed to initialize macOS API');
      this.isApiAvailable = false;
    }
  }

  /**
   * Get the timestamp of the last user input (keyboard or mouse)
   * @returns Timestamp in milliseconds since epoch, or 0 if unavailable
   */
  getLastInputTime(): number {
    if (!this.isApiAvailable || !this.cgEventSourceSecondsSinceLastEventType) {
      logger.warn('macOS API not available, returning last known timestamp');
      return this.lastInputTime;
    }

    // Only work on macOS
    if (process.platform !== 'darwin') {
      return this.lastInputTime;
    }

    try {
      // Call macOS API - returns seconds since last input
      const secondsSinceLastInput = this.cgEventSourceSecondsSinceLastEventType();

      // Handle permission errors (API returns -1 or throws)
      if (secondsSinceLastInput < 0) {
        logger.warn('macOS API returned negative value - may require Accessibility permissions');
        return this.lastInputTime;
      }

      // Convert to absolute timestamp (milliseconds since epoch)
      const now = Date.now();
      const absoluteTime = now - secondsSinceLastInput * 1000;

      this.lastInputTime = absoluteTime;
      return absoluteTime;
    } catch (error) {
      logger.error({ error }, 'Error getting last input time from macOS API');
      // May need Accessibility permissions - return last known timestamp
      return this.lastInputTime;
    }
  }

  /**
   * Start polling for activity changes
   * @param intervalMs Polling interval in milliseconds (default: 5000ms)
   */
  startPolling(intervalMs: number = 5000): void {
    if (this.isPolling) {
      logger.warn('Polling already started, stopping previous instance');
      this.stopPolling();
    }

    if (!this.isApiAvailable) {
      logger.error('Cannot start polling: macOS API not available');
      return;
    }

    // Only work on macOS
    if (process.platform !== 'darwin') {
      logger.warn('Cannot start polling: not running on macOS platform');
      return;
    }

    this.isPolling = true;
    logger.info({ intervalMs }, 'Starting activity polling');

    // Initial poll
    const initialTime = this.getLastInputTime();
    if (initialTime > 0) {
      this.notifyActivity(initialTime);
    }

    // Set up polling interval
    this.pollingInterval = setInterval(() => {
      const currentTime = this.getLastInputTime();
      if (currentTime > 0 && currentTime !== this.lastInputTime) {
        this.notifyActivity(currentTime);
      }
    }, intervalMs);
  }

  /**
   * Stop polling for activity changes
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.isPolling = false;
      logger.info('Activity polling stopped');
    }
  }

  /**
   * Register callback for activity events
   * @param callback Function to call when activity is detected
   */
  onActivity(callback: (timestamp: number) => void): void {
    this.activityCallbacks.push(callback);
  }

  /**
   * Remove activity callback
   * @param callback Callback to remove
   */
  offActivity(callback: (timestamp: number) => void): void {
    const index = this.activityCallbacks.indexOf(callback);
    if (index > -1) {
      this.activityCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify all registered callbacks of activity
   * @param timestamp Activity timestamp
   */
  private notifyActivity(timestamp: number): void {
    this.activityCallbacks.forEach((callback) => {
      try {
        callback(timestamp);
      } catch (error) {
        logger.error({ error }, 'Error in activity callback');
      }
    });
  }

  /**
   * Check if macOS API is available
   */
  isAvailable(): boolean {
    return this.isApiAvailable && process.platform === 'darwin';
  }

  /**
   * Get current polling status
   */
  getPollingStatus(): boolean {
    return this.isPolling;
  }
}

