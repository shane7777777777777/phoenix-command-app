// ============================================================================
// PHOENIX COMMAND — Shared Type Definitions
// ============================================================================

// --- Screen Navigation ---
export type Screen =
  | 'splash'
  | 'dashboard'
  | 'timeclock'
  | 'files'
  | 'teams'
  | 'dailylog'
  | 'dispatch'
  | 'knowledge'
  | 'schedule';

// --- User ---
export interface UserProfile {
  displayName: string;
  email: string;
  id: string;
}

// --- Gateway / WebSocket ---
export type GatewayState =
  | 'CONNECTING'
  | 'OPEN'
  | 'DEGRADED'
  | 'CLOSED'
  | 'CIRCUIT_OPEN';

export interface GatewayMessage {
  id: string;
  type: 'chat' | 'dispatch' | 'schedule' | 'notification' | 'heartbeat' | 'ack' | 'error';
  payload: unknown;
  timestamp: string;
  correlationId?: string;
}

export interface EchoResponse {
  message: string;
  result?: string;
  sources?: string[];
  confidence?: number;
  agents?: string[];
}

// --- Jobs ---
export interface Job {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'completed' | 'pending' | 'scheduled' | 'in-progress';
  customerId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedDuration?: number;
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assignedTechnicianId?: string;
  location?: LocationData;
}

// --- Dispatch ---
export interface Dispatch {
  id: string;
  jobId: string;
  job: Job;
  status: 'pending' | 'accepted' | 'declined' | 'en-route' | 'on-site' | 'completed';
  assignedAt: string;
  respondedAt?: string;
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedArrival?: string;
  customerName?: string;
  customerPhone?: string;
}

// --- Schedule ---
export interface ScheduleEntry {
  id: string;
  jobId: string;
  jobName: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  customerName?: string;
  notes?: string;
}

// --- Time ---
export interface TimeEntry {
  id?: string;
  clockIn: string;
  clockOut?: string;
  jobId?: string;
  location?: LocationData | null;
  hours?: number;
  notes?: string;
}

// --- Knowledge ---
export interface NECCode {
  article: string;
  section: string;
  title: string;
  content: string;
  year: number;
  tags?: string[];
}

export interface RexelProduct {
  sku: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  inStock?: boolean;
  imageUrl?: string;
  manufacturer?: string;
}

export interface KnowledgeResult {
  type: 'nec-code' | 'product' | 'general';
  title: string;
  content: string;
  relevance: number;
  source: string;
  data?: NECCode | RexelProduct;
}

// --- ServiceFusion CRM ---
export interface ServiceFusionCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

export interface ServiceFusionJob {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  status: string;
  scheduledDate?: string;
  completedDate?: string;
  invoiceAmount?: number;
  technicianId?: string;
  technicianName?: string;
}

// --- Push Notifications ---
export type NotificationCategory = 'dispatch' | 'schedule-change' | 'urgent' | 'chat';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  timestamp: string;
  data?: Record<string, unknown>;
  read: boolean;
  actionUrl?: string;
}

// --- Location / GPS ---
export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  center: LocationData;
  radiusMeters: number;
  jobId?: string;
  type: 'job-site' | 'warehouse' | 'office';
}

// --- Daily Log (existing, preserved) ---
export interface WorkRow {
  taskItem: string;
  qty: number;
  estTime: string;
  description: string;
}

export interface DailyLogEntry {
  id: string;
  date: string;
  technicianName: string;
  jobAddress: string;
  phase: 'rough-in' | 'trim-out';
  completedWork: WorkRow[];
  incompleteWork: WorkRow[];
  notes: string;
  materialNeeded: string;
  techSignature: string;
  leadSignature: string;
  photos: string[];
}

export interface DailyLogFormData {
  date: string;
  technicianName: string;
  jobAddress: string;
  phase: 'rough-in' | 'trim-out';
  completedWork: WorkRow[];
  incompleteWork: WorkRow[];
  notes: string;
  materialNeeded: string;
  techSignature: string;
  leadSignature: string;
  photos: string[];
  // Legacy fields used in App.tsx
  customer?: string;
  jobNumber?: string;
  hours?: number;
  workCompleted?: string;
  issues?: string;
}

// --- Chat ---
export interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp?: string;
  id?: string;
}

// --- Files ---
export interface JobFile {
  name: string;
  type: string;
  items?: string;
  size?: string;
}
