import { EventEmitter } from 'events';
import pino from 'pino';

// Import platform adapters - need to import from specific paths
// Since both Windows and macOS export ActivityDetector with same name,
// we'll use dynamic import or type-only imports
import type { ActivityDetector as WindowsDetectorType } from '@bao-thuc/platform/src/windows/activity-detector.js';
import type { ActivityDetector as MacOSDetectorType } from '@bao-thuc/platform/src/macos/activity-detector.js';

// Type for ActivityDetector interface (both Windows and macOS have same interface)
type ActivityDetector = WindowsDetectorType | MacOSDetectorType;

/**
 * Activity state types
 */
export type ActivityState = 'ACTIVE' | 'IDLE';
export type ServiceState = 'stopped' | 'running' | 'paused';

/**
 * Activity Monitor Events
 */
export interface ActivityMonitorEvents {
  ACTIVE: (state: 'ACTIVE') => void;
  IDLE: (state: 'IDLE') => void;
  stateChange: (state: ActivityState) => void;
}

/**
 * Activity Monitor Service
 * 
 * Background service that polls platform adapters, tracks usage time,
 * and detects idle state. Emits ACTIVE/IDLE events for other services.
 */
export class ActivityMonitor extends EventEmitter {
  private adapter: ActivityDetector | null = null;
  private state: ActivityState = 'IDLE';
  private serviceState: ServiceState = 'stopped';
  private activeSessionStart: number = 0;
  private lastActivityTime: number = 0;
  private idleThreshold: number = 300000; // 5 minutes in milliseconds
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly logger: pino.Logger;

  constructor(idleThresholdMs: number = 300000) {
    super();
    this.idleThreshold = idleThresholdMs;
    this.logger = pino({
      name: 'activity-monitor',
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    });

    // Initialize adapter asynchronously using dynamic imports
    this.initializeAdapter();
  }

  /**
   * Initialize platform adapter based on current platform
   */
  private initializeAdapter(): void {
    try {
      if (process.platform === 'win32') {
        // Dynamic import for Windows adapter
        import('@bao-thuc/platform/src/windows/activity-detector.js').then((module) => {
          this.adapter = new module.ActivityDetector() as ActivityDetector;
          this.logger.info('Initialized Windows Activity Detector');
          if (this.adapter && !this.adapter.isAvailable()) {
            this.logger.warn('Windows adapter is not available');
            this.adapter = null;
          }
        }).catch((error) => {
          this.logger.error({ error }, 'Failed to load Windows adapter');
          this.adapter = null;
        });
      } else if (process.platform === 'darwin') {
        // Dynamic import for macOS adapter
        import('@bao-thuc/platform/src/macos/activity-detector.js').then((module) => {
          this.adapter = new module.ActivityDetector() as ActivityDetector;
          this.logger.info('Initialized macOS Activity Detector');
          if (this.adapter && !this.adapter.isAvailable()) {
            this.logger.warn('macOS adapter is not available');
            this.adapter = null;
          }
        }).catch((error) => {
          this.logger.error({ error }, 'Failed to load macOS adapter');
          this.adapter = null;
        });
      } else {
        this.logger.warn(`Unsupported platform: ${process.platform}, Activity Monitor will not work`);
        this.adapter = null;
      }
    } catch (error) {
      this.logger.error({ error }, 'Failed to initialize platform adapter');
      this.adapter = null;
    }
  }

  /**
   * Start the Activity Monitor service
   */
  start(): void {
    if (this.serviceState === 'running') {
      this.logger.warn('Activity Monitor is already running');
      return;
    }

    if (!this.adapter) {
      this.logger.error('Cannot start Activity Monitor: platform adapter not available');
      return;
    }

    this.serviceState = 'running';
    this.logger.info('Starting Activity Monitor service');

    // Start platform adapter polling
    this.adapter.startPolling(5000); // 5 seconds as per architecture

    // Register activity callback
    this.adapter.onActivity((timestamp: number) => {
      this.handleActivity(timestamp);
    });

    // Start checking for idle state
    this.startIdleCheck();

    // Initial state check
    const initialTime = this.adapter.getLastInputTime();
    if (initialTime > 0) {
      this.handleActivity(initialTime);
    }
  }

  /**
   * Stop the Activity Monitor service
   */
  stop(): void {
    if (this.serviceState === 'stopped') {
      return;
    }

    this.serviceState = 'stopped';
    this.logger.info('Stopping Activity Monitor service');

    // Stop platform adapter polling
    if (this.adapter) {
      this.adapter.stopPolling();
    }

    // Stop idle check
    this.stopIdleCheck();

    // Reset state
    this.state = 'IDLE';
    this.activeSessionStart = 0;
    this.lastActivityTime = 0;
  }

  /**
   * Pause the Activity Monitor service
   */
  pause(): void {
    if (this.serviceState !== 'running') {
      this.logger.warn('Cannot pause: Activity Monitor is not running');
      return;
    }

    this.serviceState = 'paused';
    this.logger.info('Pausing Activity Monitor service');

    // Stop idle check but keep adapter running
    this.stopIdleCheck();
  }

  /**
   * Resume the Activity Monitor service
   */
  resume(): void {
    if (this.serviceState !== 'paused') {
      this.logger.warn('Cannot resume: Activity Monitor is not paused');
      return;
    }

    this.serviceState = 'running';
    this.logger.info('Resuming Activity Monitor service');

    // Resume idle check
    this.startIdleCheck();
  }

  /**
   * Handle activity detected from platform adapter
   */
  private handleActivity(timestamp: number): void {
    const now = Date.now();

    // Update last activity time
    this.lastActivityTime = timestamp;

    // If transitioning from IDLE to ACTIVE
    if (this.state === 'IDLE') {
      this.state = 'ACTIVE';
      this.activeSessionStart = now;
      this.logger.info('State changed: IDLE → ACTIVE');
      this.emit('ACTIVE', 'ACTIVE');
      this.emit('stateChange', 'ACTIVE');
    } else if (this.state === 'ACTIVE') {
      // If already ACTIVE, just update session start if it was reset
      if (this.activeSessionStart === 0) {
        this.activeSessionStart = now;
      }
    }
  }

  /**
   * Start checking for idle state
   */
  private startIdleCheck(): void {
    if (this.checkInterval) {
      return;
    }

    // Check every 5 seconds (same as polling interval)
    this.checkInterval = setInterval(() => {
      this.checkIdleState();
    }, 5000);
  }

  /**
   * Stop checking for idle state
   */
  private stopIdleCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check if idle threshold has been reached
   */
  private checkIdleState(): void {
    if (this.serviceState !== 'running' || !this.adapter) {
      return;
    }

    const now = Date.now();
    const currentActivityTime = this.adapter.getLastInputTime();

    // If no activity detected or adapter unavailable
    if (currentActivityTime === 0) {
      return;
    }

    // Calculate time since last activity
    const timeSinceLastActivity = now - currentActivityTime;

    // Check if idle threshold reached
    if (timeSinceLastActivity >= this.idleThreshold && this.state === 'ACTIVE') {
      this.state = 'IDLE';
      this.activeSessionStart = 0; // Reset active session
      this.logger.info({ timeSinceLastActivity }, 'State changed: ACTIVE → IDLE (idle threshold reached)');
      this.emit('IDLE', 'IDLE');
      this.emit('stateChange', 'IDLE');
    } else if (timeSinceLastActivity < this.idleThreshold && this.state === 'IDLE') {
      // Activity resumed before threshold
      this.state = 'ACTIVE';
      this.activeSessionStart = now;
      this.logger.info('State changed: IDLE → ACTIVE (activity resumed)');
      this.emit('ACTIVE', 'ACTIVE');
      this.emit('stateChange', 'ACTIVE');
    }
  }

  /**
   * Get current usage time in milliseconds
   * @returns Usage time in milliseconds, or 0 if IDLE or not started
   */
  getUsageTime(): number {
    if (this.state === 'IDLE' || this.activeSessionStart === 0) {
      return 0;
    }
    return Date.now() - this.activeSessionStart;
  }

  /**
   * Get current activity state
   * @returns Current activity state (ACTIVE or IDLE)
   */
  getState(): ActivityState {
    return this.state;
  }

  /**
   * Get current service state
   * @returns Current service state (stopped, running, or paused)
   */
  getServiceState(): ServiceState {
    return this.serviceState;
  }

  /**
   * Get idle threshold in milliseconds
   * @returns Idle threshold in milliseconds
   */
  getIdleThreshold(): number {
    return this.idleThreshold;
  }

  /**
   * Set idle threshold
   * @param thresholdMs Idle threshold in milliseconds
   */
  setIdleThreshold(thresholdMs: number): void {
    if (thresholdMs < 0) {
      throw new Error('Idle threshold must be non-negative');
    }
    this.idleThreshold = thresholdMs;
    this.logger.info({ thresholdMs }, 'Idle threshold updated');
  }

  /**
   * Check if platform adapter is available
   * @returns true if adapter is available, false otherwise
   */
  isAdapterAvailable(): boolean {
    return this.adapter !== null && (this.adapter.isAvailable?.() ?? false);
  }
}

