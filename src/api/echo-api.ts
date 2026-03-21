// ============================================================================
// PHOENIX COMMAND -- Echo Gateway REST API Client
// Connects to the Phoenix Echo Bot backend for AI, dispatch, schedule, etc.
// ============================================================================

import type {
  EchoResponse,
  Job,
  Dispatch,
  ScheduleEntry,
  TimeEntry,
  KnowledgeResult,
  ServiceFusionCustomer,
} from '../types';

// --- Configuration ---
const ECHO_API_URL = import.meta.env.VITE_ECHO_API_URL || 'http://localhost:18790/api';

// --- Internal State ---
let currentToken: string | null = null;
let abortController: AbortController | null = null;

// --- Token Management ---

/**
 * Set the MSAL auth token for all subsequent API calls.
 */
export function setAuthToken(token: string): void {
  currentToken = token;
}

// --- Helpers ---

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }
  return headers;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  abortController = new AbortController();

  const url = `${ECHO_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
    signal: abortController.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${response.statusText} - ${body}`);
  }

  return response.json() as Promise<T>;
}

// --- Public API ---

/**
 * Send a chat message to Echo AI and receive a response.
 * TODO(gateway): Switch to WebSocket streaming once Gateway supports it
 */
export async function askEcho(
  query: string,
  agents: string[] = ['knowledge_keeper'],
): Promise<EchoResponse> {
  return apiFetch<EchoResponse>('/echo/ask', {
    method: 'POST',
    body: JSON.stringify({ query, agents }),
  });
}

/**
 * Get assigned jobs for the current technician.
 * TODO(gateway): Add real-time job updates via WebSocket
 */
export async function getJobs(
  status?: string,
): Promise<Job[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiFetch<Job[]>(`/jobs${params}`);
}

/**
 * Get schedule entries for a date range.
 * TODO(gateway): Add real-time schedule push via WebSocket
 */
export async function getSchedule(
  startDate: string,
  endDate: string,
): Promise<ScheduleEntry[]> {
  const params = `?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
  return apiFetch<ScheduleEntry[]>(`/schedule${params}`);
}

/**
 * Search the knowledge base (NEC 2023 codes, Rexel products, general).
 * TODO(gateway): Add knowledge indexing status via WebSocket
 */
export async function searchKnowledge(
  query: string,
  type?: 'nec-code' | 'product' | 'general',
): Promise<KnowledgeResult[]> {
  return apiFetch<KnowledgeResult[]>('/knowledge/search', {
    method: 'POST',
    body: JSON.stringify({ query, type }),
  });
}

/**
 * Look up a customer from ServiceFusion CRM.
 * TODO(gateway): Add CRM webhook notifications via WebSocket
 */
export async function getCustomer(
  customerId: string,
): Promise<ServiceFusionCustomer> {
  return apiFetch<ServiceFusionCustomer>(`/customers/${encodeURIComponent(customerId)}`);
}

/**
 * Submit a time entry (clock in/out with location verification).
 * TODO(gateway): Add time entry confirmation via WebSocket
 */
export async function submitTimeEntry(
  entry: TimeEntry,
): Promise<{ success: boolean; id: string }> {
  return apiFetch<{ success: boolean; id: string }>('/time-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

/**
 * Get dispatch queue for the current technician.
 * TODO(gateway): Add real-time dispatch push via WebSocket
 */
export async function getDispatch(): Promise<Dispatch[]> {
  return apiFetch<Dispatch[]>('/dispatch');
}

/**
 * Accept or decline a dispatch.
 * TODO(gateway): Add dispatch response confirmation via WebSocket
 */
export async function respondToDispatch(
  dispatchId: string,
  action: 'accept' | 'decline',
  notes?: string,
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/dispatch/${encodeURIComponent(dispatchId)}/respond`, {
    method: 'POST',
    body: JSON.stringify({ action, notes }),
  });
}

/**
 * Cleanup -- abort pending requests and clear token.
 */
export function cleanup(): void {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  currentToken = null;
}
