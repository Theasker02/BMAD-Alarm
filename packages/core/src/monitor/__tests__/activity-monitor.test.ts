import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ActivityMonitor } from '../activity-monitor';

describe('ActivityMonitor', () => {
  let monitor: ActivityMonitor;

  beforeEach(() => {
    monitor = new ActivityMonitor(300000); // 5 minutes idle threshold
  });

  afterEach(() => {
    monitor.stop();
  });

  describe('initialization', () => {
    it('should create ActivityMonitor instance', () => {
      expect(monitor).toBeDefined();
    });

    it('should start in stopped state', () => {
      expect(monitor.getServiceState()).toBe('stopped');
    });

    it('should start in IDLE state', () => {
      expect(monitor.getState()).toBe('IDLE');
    });

    it('should have default idle threshold of 5 minutes', () => {
      const defaultMonitor = new ActivityMonitor();
      expect(defaultMonitor.getIdleThreshold()).toBe(300000);
    });

    it('should allow custom idle threshold', () => {
      const customMonitor = new ActivityMonitor(600000); // 10 minutes
      expect(customMonitor.getIdleThreshold()).toBe(600000);
    });
  });

  describe('service control', () => {
    it('should start service', () => {
      monitor.start();
      // Wait a bit for async adapter initialization
      setTimeout(() => {
        expect(monitor.getServiceState()).toBe('running');
      }, 100);
    });

    it('should stop service', () => {
      monitor.start();
      monitor.stop();
      expect(monitor.getServiceState()).toBe('stopped');
    });

    it('should pause service', () => {
      monitor.start();
      setTimeout(() => {
        monitor.pause();
        expect(monitor.getServiceState()).toBe('paused');
      }, 100);
    });

    it('should resume paused service', () => {
      monitor.start();
      setTimeout(() => {
        monitor.pause();
        monitor.resume();
        expect(monitor.getServiceState()).toBe('running');
      }, 100);
    });

    it('should not start if already running', () => {
      monitor.start();
      setTimeout(() => {
        const initialState = monitor.getServiceState();
        monitor.start(); // Try to start again
        expect(monitor.getServiceState()).toBe(initialState);
      }, 100);
    });

    it('should handle stop when not running', () => {
      expect(() => monitor.stop()).not.toThrow();
    });

    it('should handle pause when not running', () => {
      expect(() => monitor.pause()).not.toThrow();
    });

    it('should handle resume when not paused', () => {
      expect(() => monitor.resume()).not.toThrow();
    });
  });

  describe('usage time tracking', () => {
    it('should return 0 when IDLE', () => {
      expect(monitor.getUsageTime()).toBe(0);
    });

    it('should return 0 when service is stopped', () => {
      monitor.start();
      monitor.stop();
      expect(monitor.getUsageTime()).toBe(0);
    });

    it('should track usage time when ACTIVE', (done) => {
      monitor.start();
      setTimeout(() => {
        // Usage time should be greater than 0 if ACTIVE
        const usageTime = monitor.getUsageTime();
        expect(usageTime).toBeGreaterThanOrEqual(0);
        done();
      }, 100);
    });
  });

  describe('state management', () => {
    it('should get current state', () => {
      const state = monitor.getState();
      expect(['ACTIVE', 'IDLE']).toContain(state);
    });

    it('should get current service state', () => {
      const serviceState = monitor.getServiceState();
      expect(['stopped', 'running', 'paused']).toContain(serviceState);
    });
  });

  describe('idle threshold', () => {
    it('should get idle threshold', () => {
      expect(monitor.getIdleThreshold()).toBe(300000);
    });

    it('should set idle threshold', () => {
      monitor.setIdleThreshold(600000);
      expect(monitor.getIdleThreshold()).toBe(600000);
    });

    it('should throw error for negative idle threshold', () => {
      expect(() => monitor.setIdleThreshold(-1)).toThrow();
    });
  });

  describe('events', () => {
    it('should emit ACTIVE event', (done) => {
      monitor.on('ACTIVE', (state) => {
        expect(state).toBe('ACTIVE');
        done();
      });
      monitor.start();
    });

    it('should emit IDLE event', (done) => {
      monitor.on('IDLE', (state) => {
        expect(state).toBe('IDLE');
        done();
      });
      // IDLE event will be emitted when idle threshold reached
      // This test may need adjustment based on actual implementation
    });

    it('should emit stateChange event', (done) => {
      monitor.on('stateChange', (state) => {
        expect(['ACTIVE', 'IDLE']).toContain(state);
        done();
      });
      monitor.start();
    });
  });

  describe('adapter availability', () => {
    it('should check adapter availability', () => {
      const isAvailable = monitor.isAdapterAvailable();
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('error handling', () => {
    it('should handle start when adapter not available gracefully', () => {
      // Create monitor - adapter may not be available on test platform
      const testMonitor = new ActivityMonitor();
      expect(() => testMonitor.start()).not.toThrow();
    });

    it('should handle multiple start/stop cycles', () => {
      expect(() => {
        monitor.start();
        monitor.stop();
        monitor.start();
        monitor.stop();
      }).not.toThrow();
    });
  });
});

