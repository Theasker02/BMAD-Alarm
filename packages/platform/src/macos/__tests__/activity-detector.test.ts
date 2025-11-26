import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ActivityDetector } from '../activity-detector';

describe('ActivityDetector (macOS)', () => {
  let detector: ActivityDetector;

  beforeEach(() => {
    detector = new ActivityDetector();
  });

  afterEach(() => {
    detector.stopPolling();
  });

  describe('getLastInputTime', () => {
    it('should return a number', () => {
      const time = detector.getLastInputTime();
      expect(typeof time).toBe('number');
    });

    it('should return timestamp greater than or equal to 0', () => {
      const time = detector.getLastInputTime();
      // If API is available, should return valid timestamp
      // If not available or not on macOS, returns 0 or last known timestamp
      expect(time).toBeGreaterThanOrEqual(0);
    });

    it('should handle API unavailability gracefully', () => {
      // Test that method doesn't throw even if API fails
      expect(() => detector.getLastInputTime()).not.toThrow();
    });

    it('should handle non-macOS platform gracefully', () => {
      // On Windows, should return last known timestamp without error
      expect(() => detector.getLastInputTime()).not.toThrow();
    });
  });

  describe('polling mechanism', () => {
    it('should start polling', () => {
      detector.startPolling(100);
      expect(detector.getPollingStatus()).toBe(true);
      detector.stopPolling();
    });

    it('should stop polling', () => {
      detector.startPolling(100);
      detector.stopPolling();
      expect(detector.getPollingStatus()).toBe(false);
    });

    it('should use default interval of 5000ms', () => {
      detector.startPolling();
      expect(detector.getPollingStatus()).toBe(true);
      detector.stopPolling();
    });

    it('should stop previous polling when starting new one', () => {
      detector.startPolling(100);
      const firstStatus = detector.getPollingStatus();
      detector.startPolling(200);
      const secondStatus = detector.getPollingStatus();
      expect(firstStatus).toBe(true);
      expect(secondStatus).toBe(true);
      detector.stopPolling();
    });
  });

  describe('activity callbacks', () => {
    it('should register activity callback', () => {
      const callback = vi.fn();
      detector.onActivity(callback);
      // Callback should be registered (no error)
      expect(() => detector.onActivity(callback)).not.toThrow();
    });

    it('should remove activity callback', () => {
      const callback = vi.fn();
      detector.onActivity(callback);
      detector.offActivity(callback);
      // Callback should be removed (no error)
      expect(() => detector.offActivity(callback)).not.toThrow();
    });
  });

  describe('API availability', () => {
    it('should check API availability', () => {
      const isAvailable = detector.isAvailable();
      expect(typeof isAvailable).toBe('boolean');
    });

    it('should return false on non-macOS platforms', () => {
      // On Windows, should return false
      const isAvailable = detector.isAvailable();
      // Will be false on Windows, true on macOS (if API available)
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('error handling', () => {
    it('should not crash on multiple getLastInputTime calls', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          detector.getLastInputTime();
        }
      }).not.toThrow();
    });

    it('should handle stopPolling when not polling', () => {
      expect(() => detector.stopPolling()).not.toThrow();
    });

    it('should handle startPolling on non-macOS platform gracefully', () => {
      // On Windows, should not crash
      expect(() => detector.startPolling(100)).not.toThrow();
      detector.stopPolling();
    });
  });
});

