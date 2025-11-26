import ffi from 'ffi-napi';
import pino from 'pino';

/**
 * Windows API LASTINPUTINFO structure
 * - cbSize: Size of structure (8 bytes)
 * - dwTime: Time of last input in milliseconds since system start
 */

// Logger instance
const logger = pino({
  name: 'windows-activity-detector',
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * Windows Activity Detector
 * Detects user keyboard and mouse activity using Windows API GetLastInputInfo
 */
export class ActivityDetector {
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastInputTime: number = 0;
  private activityCallbacks: Array<(timestamp: number) => void> = [];
  private isPolling: boolean = false;
  private getLastInputInfo: ((info: Buffer) => boolean) | null = null;
  private isApiAvailable: boolean = false;

  constructor() {
    this.initializeWindowsAPI();
  }

  /**
   * Initialize Windows API bindings
   */
  private initializeWindowsAPI(): void {
    try {
      // Load user32.dll
      const user32 = ffi.Library('user32', {
        GetLastInputInfo: ['bool', ['pointer']],
      });

      // Create function wrapper
      this.getLastInputInfo = (info: Buffer): boolean => {
        return user32.GetLastInputInfo(info);
      };

      // Test API availability
      const testInfo = Buffer.alloc(8);
      testInfo.writeUInt32LE(8, 0); // cbSize = 8
      if (this.getLastInputInfo(testInfo)) {
        this.isApiAvailable = true;
        logger.info('Windows API GetLastInputInfo initialized successfully');
      } else {
        logger.warn('Windows API GetLastInputInfo test call failed');
      }
    } catch (error) {
      logger.error({ error }, 'Failed to initialize Windows API');
      this.isApiAvailable = false;
    }
  }

  /**
   * Get the timestamp of the last user input (keyboard or mouse)
   * @returns Timestamp in milliseconds since system start, or 0 if unavailable
   */
  getLastInputTime(): number {
    if (!this.isApiAvailable || !this.getLastInputInfo) {
      logger.warn('Windows API not available, returning last known timestamp');
      return this.lastInputTime;
    }

    try {
      // Create LASTINPUTINFO structure
      const info = Buffer.alloc(8);
      info.writeUInt32LE(8, 0); // cbSize = 8 bytes
      info.writeUInt32LE(0, 4); // dwTime = 0 (will be filled by API)

      // Call Windows API
      const success = this.getLastInputInfo(info);
      if (!success) {
        logger.warn('GetLastInputInfo API call failed');
        return this.lastInputTime;
      }

      // Read dwTime (milliseconds since system start)
      const dwTime = info.readUInt32LE(4);

      // Convert to absolute timestamp (milliseconds since epoch)
      // Get system uptime and calculate absolute time
      const systemUptime = Date.now() - process.uptime() * 1000;
      const absoluteTime = systemUptime + dwTime;

      this.lastInputTime = absoluteTime;
      return absoluteTime;
    } catch (error) {
      logger.error({ error }, 'Error getting last input time');
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
      logger.error('Cannot start polling: Windows API not available');
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
   * Check if Windows API is available
   */
  isAvailable(): boolean {
    return this.isApiAvailable;
  }

  /**
   * Get current polling status
   */
  getPollingStatus(): boolean {
    return this.isPolling;
  }
}

