// ============================================================================
// PHOENIX COMMAND — Location / GPS Service
// GPS tracking, geofencing, and location-verified clock in/out
// ============================================================================

import type { LocationData, GeofenceZone } from '../types';

// --- State ---
let watchId: number | null = null;
let currentLocation: LocationData | null = null;
let geofences: GeofenceZone[] = [];
let locationListeners: Set<(loc: LocationData) => void> = new Set();
let geofenceListeners: Set<(zone: GeofenceZone, inside: boolean) => void> = new Set();
let lastGeofenceState: Map<string, boolean> = new Map();

// --- Constants ---
const EARTH_RADIUS_METERS = 6_371_000;
const DEFAULT_GEOFENCE_RADIUS = 150; // meters

// --- Helpers ---

/**
 * Calculate the distance between two GPS points using the Haversine formula.
 * Returns distance in meters.
 */
export function calculateDistance(a: LocationData, b: LocationData): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

/**
 * Check if a point is inside a geofence zone.
 */
export function isInsideGeofence(location: LocationData, zone: GeofenceZone): boolean {
  const distance = calculateDistance(location, zone.center);
  return distance <= zone.radiusMeters;
}

/**
 * Get the current GPS position (one-shot).
 */
export function getCurrentPosition(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('[LocationService] Geolocation API not available');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString(),
        };
        currentLocation = loc;
        resolve(loc);
      },
      (error) => {
        console.warn('[LocationService] getCurrentPosition error:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000,
      }
    );
  });
}

/**
 * Start continuous GPS tracking.
 */
export function startTracking(): void {
  if (watchId !== null) {
    console.log('[LocationService] Already tracking');
    return;
  }

  if (!navigator.geolocation) {
    console.warn('[LocationService] Geolocation API not available');
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const loc: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString(),
      };
      currentLocation = loc;

      // Notify location listeners
      locationListeners.forEach((handler) => {
        try {
          handler(loc);
        } catch (err) {
          console.error('[LocationService] Location listener error:', err);
        }
      });

      // Check geofences
      checkGeofences(loc);
    },
    (error) => {
      console.warn('[LocationService] watchPosition error:', error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 15_000,
      maximumAge: 5_000,
    }
  );

  console.log('[LocationService] Tracking started');
}

/**
 * Stop continuous GPS tracking.
 */
export function stopTracking(): void {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log('[LocationService] Tracking stopped');
  }
}

/**
 * Check if the current position is inside any registered geofences.
 * Emits geofence events on state changes.
 */
function checkGeofences(loc: LocationData): void {
  for (const zone of geofences) {
    const inside = isInsideGeofence(loc, zone);
    const previouslyInside = lastGeofenceState.get(zone.id) ?? false;

    if (inside !== previouslyInside) {
      lastGeofenceState.set(zone.id, inside);
      geofenceListeners.forEach((handler) => {
        try {
          handler(zone, inside);
        } catch (err) {
          console.error('[LocationService] Geofence listener error:', err);
        }
      });
    }
  }
}

/**
 * Register a geofence zone.
 */
export function addGeofence(zone: GeofenceZone): void {
  const exists = geofences.some((z) => z.id === zone.id);
  if (!exists) {
    geofences.push(zone);
    lastGeofenceState.set(zone.id, false);
  }
}

/**
 * Remove a geofence zone.
 */
export function removeGeofence(zoneId: string): void {
  geofences = geofences.filter((z) => z.id !== zoneId);
  lastGeofenceState.delete(zoneId);
}

/**
 * Clear all geofence zones.
 */
export function clearGeofences(): void {
  geofences = [];
  lastGeofenceState.clear();
}

/**
 * Get the current cached location (from tracking or last one-shot).
 */
export function getLastKnownLocation(): LocationData | null {
  return currentLocation;
}

/**
 * Verify location for clock in/out — returns true if within job site geofence
 * or if no geofence is set for the job.
 */
export function verifyClockLocation(
  location: LocationData,
  jobSite?: GeofenceZone
): { verified: boolean; distance?: number } {
  if (!jobSite) {
    // No geofence set — allow clock action but flag as unverified
    return { verified: true };
  }

  const distance = calculateDistance(location, jobSite.center);
  const verified = distance <= jobSite.radiusMeters;

  return { verified, distance: Math.round(distance) };
}

/**
 * Calculate distance from current location to a job site.
 * Returns distance in meters, or null if location is unavailable.
 */
export function distanceToJobSite(jobSite: LocationData): number | null {
  if (!currentLocation) return null;
  return Math.round(calculateDistance(currentLocation, jobSite));
}

/**
 * Subscribe to location updates.
 */
export function onLocationUpdate(handler: (loc: LocationData) => void): void {
  locationListeners.add(handler);
}

/**
 * Unsubscribe from location updates.
 */
export function offLocationUpdate(handler: (loc: LocationData) => void): void {
  locationListeners.delete(handler);
}

/**
 * Subscribe to geofence enter/exit events.
 */
export function onGeofenceChange(handler: (zone: GeofenceZone, inside: boolean) => void): void {
  geofenceListeners.add(handler);
}

/**
 * Unsubscribe from geofence events.
 */
export function offGeofenceChange(handler: (zone: GeofenceZone, inside: boolean) => void): void {
  geofenceListeners.delete(handler);
}

/**
 * Cleanup — stop tracking, clear geofences, remove all listeners.
 */
export function cleanup(): void {
  stopTracking();
  clearGeofences();
  locationListeners.clear();
  geofenceListeners.clear();
  currentLocation = null;
}
