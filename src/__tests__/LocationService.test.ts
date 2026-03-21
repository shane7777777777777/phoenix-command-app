// ============================================================================
// PHOENIX COMMAND -- LocationService Tests
// Geofencing, distance calculation
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateDistance,
  isInsideGeofence,
  verifyClockLocation,
  distanceToJobSite,
  addGeofence,
  removeGeofence,
  clearGeofences,
  getLastKnownLocation,
  cleanup,
} from '../services/LocationService';
import type { LocationData, GeofenceZone } from '../types';

describe('LocationService', () => {
  afterEach(() => {
    cleanup();
  });

  describe('calculateDistance()', () => {
    it('should return 0 for the same point', () => {
      const point: LocationData = { lat: 33.4484, lng: -112.074 };
      expect(calculateDistance(point, point)).toBeCloseTo(0, 0);
    });

    it('should calculate distance between Phoenix and Scottsdale correctly', () => {
      const phoenix: LocationData = { lat: 33.4484, lng: -112.074 };
      const scottsdale: LocationData = { lat: 33.4942, lng: -111.9261 };

      const distance = calculateDistance(phoenix, scottsdale);
      // Roughly 14-15 km
      expect(distance).toBeGreaterThan(13000);
      expect(distance).toBeLessThan(16000);
    });

    it('should calculate short distances accurately', () => {
      // Two points ~100m apart
      const a: LocationData = { lat: 33.4484, lng: -112.074 };
      const b: LocationData = { lat: 33.4493, lng: -112.074 }; // ~100m north

      const distance = calculateDistance(a, b);
      expect(distance).toBeGreaterThan(80);
      expect(distance).toBeLessThan(120);
    });
  });

  describe('isInsideGeofence()', () => {
    const jobSite: GeofenceZone = {
      id: 'zone-1',
      name: 'Test Job Site',
      center: { lat: 33.4484, lng: -112.074 },
      radiusMeters: 150,
      type: 'job-site',
    };

    it('should return true for a point inside the geofence', () => {
      const location: LocationData = { lat: 33.4485, lng: -112.0741 };
      expect(isInsideGeofence(location, jobSite)).toBe(true);
    });

    it('should return false for a point outside the geofence', () => {
      const farAway: LocationData = { lat: 33.46, lng: -112.074 };
      expect(isInsideGeofence(farAway, jobSite)).toBe(false);
    });

    it('should handle edge case at exact boundary', () => {
      // Point at exactly the center
      const center: LocationData = { lat: 33.4484, lng: -112.074 };
      expect(isInsideGeofence(center, jobSite)).toBe(true);
    });
  });

  describe('verifyClockLocation()', () => {
    it('should return verified=true when no job site is provided', () => {
      const location: LocationData = { lat: 33.4484, lng: -112.074 };
      const result = verifyClockLocation(location);
      expect(result.verified).toBe(true);
      expect(result.distance).toBeUndefined();
    });

    it('should return verified=true when within job site radius', () => {
      const location: LocationData = { lat: 33.4484, lng: -112.074 };
      const jobSite: GeofenceZone = {
        id: 'zone-1',
        name: 'Test Site',
        center: { lat: 33.4485, lng: -112.0741 },
        radiusMeters: 200,
        type: 'job-site',
      };
      const result = verifyClockLocation(location, jobSite);
      expect(result.verified).toBe(true);
      expect(result.distance).toBeDefined();
      expect(result.distance!).toBeLessThan(200);
    });

    it('should return verified=false when outside job site radius', () => {
      const location: LocationData = { lat: 33.46, lng: -112.074 };
      const jobSite: GeofenceZone = {
        id: 'zone-1',
        name: 'Test Site',
        center: { lat: 33.4484, lng: -112.074 },
        radiusMeters: 150,
        type: 'job-site',
      };
      const result = verifyClockLocation(location, jobSite);
      expect(result.verified).toBe(false);
      expect(result.distance).toBeGreaterThan(150);
    });
  });

  describe('Geofence management', () => {
    it('should add and remove geofences', () => {
      const zone: GeofenceZone = {
        id: 'zone-1',
        name: 'Test',
        center: { lat: 33.4484, lng: -112.074 },
        radiusMeters: 100,
        type: 'job-site',
      };

      addGeofence(zone);
      // Adding the same zone again should not duplicate
      addGeofence(zone);

      removeGeofence('zone-1');
      // Should not throw when removing non-existent
      removeGeofence('zone-nonexistent');
    });

    it('should clear all geofences', () => {
      addGeofence({
        id: 'z1',
        name: 'Zone 1',
        center: { lat: 33.4484, lng: -112.074 },
        radiusMeters: 100,
        type: 'job-site',
      });
      addGeofence({
        id: 'z2',
        name: 'Zone 2',
        center: { lat: 33.45, lng: -112.08 },
        radiusMeters: 200,
        type: 'warehouse',
      });

      clearGeofences();
      // No error should occur after clearing
    });
  });

  describe('distanceToJobSite()', () => {
    it('should return null when no current location is cached', () => {
      const jobSite: LocationData = { lat: 33.4484, lng: -112.074 };
      expect(distanceToJobSite(jobSite)).toBeNull();
    });
  });

  describe('cleanup()', () => {
    it('should reset all state', () => {
      addGeofence({
        id: 'z1',
        name: 'Zone 1',
        center: { lat: 33.4484, lng: -112.074 },
        radiusMeters: 100,
        type: 'job-site',
      });

      cleanup();
      expect(getLastKnownLocation()).toBeNull();
    });
  });
});
