// ============================================================================
// PHOENIX COMMAND -- EchoGatewayClient Tests
// Connection states, reconnection, heartbeat
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number = MockWebSocket.CONNECTING;
  onopen: ((ev: Event) => void) | null = null;
  onclose: ((ev: CloseEvent) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  send = vi.fn();
  close = vi.fn();

  simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    if (this.onopen) {
      this.onopen(new Event('open'));
    }
  }

  simulateClose(code: number = 1006, reason: string = '') {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }

  simulateMessage(data: string) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data }));
    }
  }

  simulateError() {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }
}

// Polyfill CloseEvent for Node environment
if (typeof globalThis.CloseEvent === 'undefined') {
  (globalThis as any).CloseEvent = class CloseEvent extends Event {
    code: number;
    reason: string;
    wasClean: boolean;
    constructor(type: string, init?: { code?: number; reason?: string; wasClean?: boolean }) {
      super(type);
      this.code = init?.code ?? 1000;
      this.reason = init?.reason ?? '';
      this.wasClean = init?.wasClean ?? true;
    }
  };
}

// Polyfill MessageEvent if needed
if (typeof globalThis.MessageEvent === 'undefined') {
  (globalThis as any).MessageEvent = class MessageEvent extends Event {
    data: any;
    constructor(type: string, init?: { data?: any }) {
      super(type);
      this.data = init?.data ?? null;
    }
  };
}

// Store WebSocket instances for test access
let wsInstances: MockWebSocket[] = [];

vi.stubGlobal('WebSocket', class extends MockWebSocket {
  constructor(url: string) {
    super(url);
    wsInstances.push(this);
  }
});

// Must import after mocking WebSocket
let gateway: typeof import('../gateway/EchoGatewayClient');

describe('EchoGatewayClient', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    wsInstances = [];
    // Re-import to reset module state
    vi.resetModules();
    gateway = await import('../gateway/EchoGatewayClient');
  });

  afterEach(() => {
    gateway.cleanup();
    vi.useRealTimers();
  });

  describe('Connection States', () => {
    it('should start in CLOSED state', () => {
      expect(gateway.getState()).toBe('CLOSED');
    });

    it('should transition to CONNECTING when connect() is called', () => {
      gateway.connect();
      expect(gateway.getState()).toBe('CONNECTING');
    });

    it('should transition to OPEN when WebSocket opens', () => {
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();
      expect(gateway.getState()).toBe('OPEN');
    });

    it('should transition to CLOSED on normal close (code 1000)', () => {
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();
      ws.simulateClose(1000, 'Normal closure');
      expect(gateway.getState()).toBe('CLOSED');
    });

    it('should fire stateChange listeners', () => {
      const listener = vi.fn();
      gateway.on('stateChange', listener);

      gateway.connect();
      expect(listener).toHaveBeenCalledWith('CONNECTING');

      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();
      expect(listener).toHaveBeenCalledWith('OPEN');

      gateway.off('stateChange', listener);
    });
  });

  describe('Reconnection', () => {
    it('should schedule reconnect on abnormal close', () => {
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();
      ws.simulateClose(1006, 'Abnormal');

      // After abnormal close, state goes to CLOSED
      expect(gateway.getState()).toBe('CLOSED');

      // After 1000ms (first reconnect delay), it should reconnect
      vi.advanceTimersByTime(1000);
      expect(wsInstances.length).toBe(2); // New WebSocket created
    });

    it('should use exponential backoff for reconnection', () => {
      gateway.connect();

      // First connection and abnormal close
      let ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();
      ws.simulateClose(1006);

      // First reconnect at 1000ms
      vi.advanceTimersByTime(1000);
      expect(wsInstances.length).toBe(2);

      // Second close
      ws = wsInstances[wsInstances.length - 1];
      ws.simulateClose(1006);

      // Second reconnect at 2000ms
      vi.advanceTimersByTime(1999);
      expect(wsInstances.length).toBe(2); // Not yet
      vi.advanceTimersByTime(1);
      expect(wsInstances.length).toBe(3); // Now
    });

    it('should open circuit after threshold consecutive failures', () => {
      gateway.connect();

      // Fail 5 times consecutively
      for (let i = 0; i < 5; i++) {
        const ws = wsInstances[wsInstances.length - 1];
        ws.simulateClose(1006);
        if (i < 4) {
          // Advance past the reconnect delay
          vi.advanceTimersByTime(30000);
        }
      }

      expect(gateway.getState()).toBe('CIRCUIT_OPEN');
    });
  });

  describe('Heartbeat', () => {
    it('should send heartbeat pings every 25s when connected', () => {
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();

      expect(ws.send).not.toHaveBeenCalled();

      // Advance 25 seconds
      vi.advanceTimersByTime(25000);
      expect(ws.send).toHaveBeenCalledTimes(1);

      const sentData = JSON.parse(ws.send.mock.calls[0][0]);
      expect(sentData.type).toBe('heartbeat');
      expect(sentData.payload).toEqual({ ping: true });
    });

    it('should stop heartbeat on disconnect', () => {
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();

      gateway.disconnect();

      vi.advanceTimersByTime(50000);
      // send should not have been called (heartbeat stopped before first tick)
      expect(ws.send).not.toHaveBeenCalled();
    });
  });

  describe('Message Handling', () => {
    it('should emit parsed messages to listeners', () => {
      const listener = vi.fn();
      gateway.on('message', listener);
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();

      const msg = {
        id: 'test-1',
        type: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date().toISOString(),
      };
      ws.simulateMessage(JSON.stringify(msg));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(msg);

      gateway.off('message', listener);
    });

    it('should handle malformed messages gracefully', () => {
      const listener = vi.fn();
      gateway.on('message', listener);
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();

      // Send invalid JSON
      ws.simulateMessage('not-json');

      // Listener should not be called
      expect(listener).not.toHaveBeenCalled();

      gateway.off('message', listener);
    });
  });

  describe('send()', () => {
    it('should return false when not connected', () => {
      const result = gateway.send({
        id: '1',
        type: 'chat',
        payload: {},
        timestamp: new Date().toISOString(),
      });
      expect(result).toBe(false);
    });

    it('should return true when connected and send succeeds', () => {
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();

      const result = gateway.send({
        id: '1',
        type: 'chat',
        payload: { content: 'test' },
        timestamp: new Date().toISOString(),
      });
      expect(result).toBe(true);
      expect(ws.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanup()', () => {
    it('should disconnect and clear all listeners', () => {
      const listener = vi.fn();
      gateway.on('stateChange', listener);
      gateway.connect();
      const ws = wsInstances[wsInstances.length - 1];
      ws.simulateOpen();

      // cleanup calls disconnect which fires stateChange -> CLOSED, then clears listeners
      gateway.cleanup();

      expect(gateway.getState()).toBe('CLOSED');

      // After cleanup, the listener set was cleared, so a new connect should not trigger it
      listener.mockClear();
      gateway.connect();
      // The listener was removed by cleanup(), so it should NOT receive the new CONNECTING state
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
