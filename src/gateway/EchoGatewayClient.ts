// ============================================================================
// PHOENIX COMMAND — Echo Gateway WebSocket Client
// Connects to the Phoenix Echo Gateway for real-time communication
// ============================================================================

import type { GatewayMessage, GatewayState } from '../types';

// --- Configuration ---
const GATEWAY_WS_URL = import.meta.env.VITE_GATEWAY_WS_URL || 'ws://localhost:18790/ws';
const HEARTBEAT_INTERVAL_MS = 25_000;
const RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000, 16000, 30000];

// --- Event Types ---
type GatewayEventType = 'message' | 'stateChange' | 'error' | 'heartbeat';

type GatewayEventHandler =
  | ((message: GatewayMessage) => void)
  | ((state: GatewayState) => void)
  | ((error: Error) => void)
  | (() => void);

// --- Internal State ---
let ws: WebSocket | null = null;
let currentState: GatewayState = 'CLOSED';
let reconnectAttempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let circuitOpenTimer: ReturnType<typeof setTimeout> | null = null;
let consecutiveFailures = 0;
const CIRCUIT_OPEN_THRESHOLD = 5;
const CIRCUIT_OPEN_DURATION_MS = 60_000;

const listeners: Map<GatewayEventType, Set<GatewayEventHandler>> = new Map([
  ['message', new Set()],
  ['stateChange', new Set()],
  ['error', new Set()],
  ['heartbeat', new Set()],
]);

// --- Helpers ---

function setState(newState: GatewayState): void {
  if (currentState === newState) return;
  const previous = currentState;
  currentState = newState;
  console.log(`[EchoGateway] State: ${previous} -> ${newState}`);
  listeners.get('stateChange')?.forEach((handler) => {
    try {
      (handler as (state: GatewayState) => void)(newState);
    } catch (err) {
      console.error('[EchoGateway] stateChange handler error:', err);
    }
  });
}

function getReconnectDelay(): number {
  const index = Math.min(reconnectAttempt, RECONNECT_DELAYS_MS.length - 1);
  return RECONNECT_DELAYS_MS[index];
}

function startHeartbeat(): void {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      try {
        const ping: GatewayMessage = {
          id: crypto.randomUUID(),
          type: 'heartbeat',
          payload: { ping: true },
          timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(ping));
        listeners.get('heartbeat')?.forEach((handler) => {
          try {
            (handler as () => void)();
          } catch (err) {
            // Silently ignore heartbeat handler errors
          }
        });
      } catch (err) {
        console.warn('[EchoGateway] Heartbeat send failed:', err);
        setState('DEGRADED');
      }
    }
  }, HEARTBEAT_INTERVAL_MS);
}

function stopHeartbeat(): void {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function clearReconnectTimer(): void {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect(): void {
  if (currentState === 'CIRCUIT_OPEN') return;

  clearReconnectTimer();
  const delay = getReconnectDelay();
  console.log(`[EchoGateway] Reconnecting in ${delay}ms (attempt ${reconnectAttempt + 1})`);

  reconnectTimer = setTimeout(() => {
    reconnectAttempt++;
    connect();
  }, delay);
}

function openCircuit(): void {
  setState('CIRCUIT_OPEN');
  console.warn(
    `[EchoGateway] Circuit opened after ${consecutiveFailures} consecutive failures. ` +
    `Will retry in ${CIRCUIT_OPEN_DURATION_MS / 1000}s.`
  );
  circuitOpenTimer = setTimeout(() => {
    circuitOpenTimer = null;
    consecutiveFailures = 0;
    reconnectAttempt = 0;
    console.log('[EchoGateway] Circuit half-open, attempting reconnect...');
    connect();
  }, CIRCUIT_OPEN_DURATION_MS);
}

// --- Public API ---

/**
 * Connect to the Echo Gateway WebSocket.
 * @param token Optional auth token to pass as query parameter
 */
export function connect(token?: string): void {
  if (currentState === 'CIRCUIT_OPEN') {
    console.warn('[EchoGateway] Circuit is open, cannot connect');
    return;
  }

  if (ws) {
    try {
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      ws.onopen = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    } catch {
      // Ignore close errors on stale socket
    }
    ws = null;
  }

  setState('CONNECTING');

  // TODO(gateway): Add authentication query parameter once Gateway auth is finalized
  const url = token
    ? `${GATEWAY_WS_URL}?token=${encodeURIComponent(token)}`
    : GATEWAY_WS_URL;

  try {
    ws = new WebSocket(url);
  } catch (err) {
    console.error('[EchoGateway] WebSocket constructor error:', err);
    setState('CLOSED');
    consecutiveFailures++;
    if (consecutiveFailures >= CIRCUIT_OPEN_THRESHOLD) {
      openCircuit();
    } else {
      scheduleReconnect();
    }
    return;
  }

  ws.onopen = () => {
    console.log('[EchoGateway] Connected');
    setState('OPEN');
    reconnectAttempt = 0;
    consecutiveFailures = 0;
    startHeartbeat();
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data as string) as GatewayMessage;
      listeners.get('message')?.forEach((handler) => {
        try {
          (handler as (msg: GatewayMessage) => void)(message);
        } catch (err) {
          console.error('[EchoGateway] Message handler error:', err);
        }
      });
    } catch (err) {
      console.warn('[EchoGateway] Failed to parse message:', err);
    }
  };

  ws.onerror = (event: Event) => {
    console.error('[EchoGateway] WebSocket error:', event);
    const error = new Error('WebSocket connection error');
    listeners.get('error')?.forEach((handler) => {
      try {
        (handler as (e: Error) => void)(error);
      } catch {
        // Silently ignore error handler errors
      }
    });
  };

  ws.onclose = (event: CloseEvent) => {
    console.log(`[EchoGateway] Closed: code=${event.code} reason=${event.reason}`);
    stopHeartbeat();
    ws = null;

    // Normal closure — don't reconnect
    if (event.code === 1000) {
      setState('CLOSED');
      return;
    }

    consecutiveFailures++;
    if (consecutiveFailures >= CIRCUIT_OPEN_THRESHOLD) {
      openCircuit();
    } else {
      setState('CLOSED');
      scheduleReconnect();
    }
  };
}

/**
 * Send a message to the Gateway.
 */
export function send(message: GatewayMessage): boolean {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn('[EchoGateway] Cannot send — not connected');
    return false;
  }

  try {
    ws.send(JSON.stringify(message));
    return true;
  } catch (err) {
    console.error('[EchoGateway] Send failed:', err);
    return false;
  }
}

/**
 * Send a chat message via the Gateway.
 */
export function sendChat(content: string, correlationId?: string): boolean {
  // TODO(gateway): Adjust message shape once Gateway chat protocol is finalized
  const message: GatewayMessage = {
    id: crypto.randomUUID(),
    type: 'chat',
    payload: { content },
    timestamp: new Date().toISOString(),
    correlationId,
  };
  return send(message);
}

/**
 * Disconnect from the Gateway.
 */
export function disconnect(): void {
  clearReconnectTimer();
  stopHeartbeat();
  if (circuitOpenTimer) {
    clearTimeout(circuitOpenTimer);
    circuitOpenTimer = null;
  }

  if (ws) {
    try {
      ws.onclose = null;
      ws.close(1000, 'Client disconnect');
    } catch {
      // Ignore
    }
    ws = null;
  }

  consecutiveFailures = 0;
  reconnectAttempt = 0;
  setState('CLOSED');
}

/**
 * Subscribe to gateway events.
 */
export function on(event: GatewayEventType, handler: GatewayEventHandler): void {
  listeners.get(event)?.add(handler);
}

/**
 * Unsubscribe from gateway events.
 */
export function off(event: GatewayEventType, handler: GatewayEventHandler): void {
  listeners.get(event)?.delete(handler);
}

/**
 * Get the current gateway state.
 */
export function getState(): GatewayState {
  return currentState;
}

/**
 * Cleanup — disconnect and remove all listeners.
 * Call on module teardown / app unmount.
 */
export function cleanup(): void {
  disconnect();
  listeners.forEach((set) => set.clear());
}
