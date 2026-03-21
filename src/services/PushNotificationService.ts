// ============================================================================
// PHOENIX COMMAND -- Push Notification Service
// Service worker registration, permission flow, and notification categories
// ============================================================================

import type { NotificationCategory, PushNotification } from '../types';

// --- State ---
let swRegistration: ServiceWorkerRegistration | null = null;
let permissionState: NotificationPermission = 'default';
let notificationListeners: Set<(notification: PushNotification) => void> = new Set();

// --- Constants ---
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// --- Helpers ---

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// --- Public API ---

/**
 * Check if push notifications are supported in this browser.
 */
export function isSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Get the current notification permission state.
 */
export function getPermissionState(): NotificationPermission {
  if (!isSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permission from the user.
 * Returns the resulting permission state.
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) {
    console.warn('[PushNotification] Not supported in this browser');
    return 'denied';
  }

  try {
    permissionState = await Notification.requestPermission();
    console.log(`[PushNotification] Permission: ${permissionState}`);
    return permissionState;
  } catch (err) {
    console.error('[PushNotification] Permission request failed:', err);
    return 'denied';
  }
}

/**
 * Register the service worker and subscribe to push notifications.
 * TODO(gateway): Send subscription to Gateway backend for server-side push
 */
export async function register(): Promise<boolean> {
  if (!isSupported()) {
    console.warn('[PushNotification] Not supported');
    return false;
  }

  try {
    // Register the service worker
    swRegistration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('[PushNotification] Service worker registered');

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // Request permission if not yet granted
    if (Notification.permission === 'default') {
      await requestPermission();
    }

    if (Notification.permission !== 'granted') {
      console.log('[PushNotification] Permission not granted, skipping subscription');
      return false;
    }

    // Subscribe to push if VAPID key is available
    if (VAPID_PUBLIC_KEY) {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // TODO(gateway): POST subscription to backend
      console.log('[PushNotification] Push subscription created:', subscription.endpoint);
    }

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', handleSwMessage);

    return true;
  } catch (err) {
    console.error('[PushNotification] Registration failed:', err);
    return false;
  }
}

/**
 * Handle messages forwarded from the service worker.
 */
function handleSwMessage(event: MessageEvent): void {
  if (event.data?.type === 'PUSH_NOTIFICATION') {
    const notification = event.data.payload as PushNotification;
    notificationListeners.forEach((handler) => {
      try {
        handler(notification);
      } catch (err) {
        console.error('[PushNotification] Listener error:', err);
      }
    });
  }
}

/**
 * Show a local notification (when app is in foreground).
 */
export async function showLocalNotification(
  title: string,
  body: string,
  category: NotificationCategory,
  data?: Record<string, unknown>,
): Promise<void> {
  if (!swRegistration || Notification.permission !== 'granted') {
    console.warn('[PushNotification] Cannot show notification: not registered or no permission');
    return;
  }

  const tagMap: Record<NotificationCategory, string> = {
    dispatch: 'px-dispatch',
    'schedule-change': 'px-schedule',
    urgent: 'px-urgent',
    chat: 'px-chat',
  };

  await swRegistration.showNotification(title, {
    body,
    icon: '/phoenix-logo.png',
    badge: '/phoenix-logo.png',
    tag: tagMap[category],
    data: { category, ...data },
    vibrate: category === 'urgent' ? [200, 100, 200, 100, 200] : [200, 100, 200],
    requireInteraction: category === 'urgent' || category === 'dispatch',
  });
}

/**
 * Subscribe to incoming push notification events.
 */
export function onNotification(handler: (notification: PushNotification) => void): void {
  notificationListeners.add(handler);
}

/**
 * Unsubscribe from notification events.
 */
export function offNotification(handler: (notification: PushNotification) => void): void {
  notificationListeners.delete(handler);
}

/**
 * Cleanup -- unsubscribe push, remove listeners.
 */
export function cleanup(): void {
  navigator.serviceWorker?.removeEventListener('message', handleSwMessage);
  notificationListeners.clear();
  swRegistration = null;
  permissionState = 'default';
}
