// ============================================================================
// PHOENIX COMMAND -- Echo API Client Tests
// API calls with mocked fetch
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  askEcho,
  getJobs,
  getSchedule,
  searchKnowledge,
  getCustomer,
  submitTimeEntry,
  getDispatch,
  respondToDispatch,
  setAuthToken,
  cleanup,
} from '../api/echo-api';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockJsonResponse(data: unknown, status: number = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

describe('Echo API Client', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    setAuthToken('test-token-123');
  });

  afterEach(() => {
    cleanup();
  });

  describe('askEcho()', () => {
    it('should POST to /echo/ask with query and agents', async () => {
      const mockResponse = {
        message: 'NEC 210.8(A) covers GFCI protection...',
        result: 'GFCI required in bathrooms, kitchens...',
        sources: ['NEC 2023'],
        confidence: 0.95,
      };

      mockFetch.mockReturnValueOnce(mockJsonResponse(mockResponse));

      const result = await askEcho('What is NEC 210.8?', ['knowledge_keeper']);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('/echo/ask');
      expect(options.method).toBe('POST');

      const body = JSON.parse(options.body);
      expect(body.query).toBe('What is NEC 210.8?');
      expect(body.agents).toEqual(['knowledge_keeper']);

      expect(result.message).toBe(mockResponse.message);
      expect(result.confidence).toBe(0.95);
    });

    it('should include auth header when token is set', async () => {
      mockFetch.mockReturnValueOnce(mockJsonResponse({ message: 'ok' }));

      await askEcho('test');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers['Authorization']).toBe('Bearer test-token-123');
    });

    it('should throw on non-OK response', async () => {
      mockFetch.mockReturnValueOnce(
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: () => Promise.resolve('Server Error'),
        }),
      );

      await expect(askEcho('test')).rejects.toThrow('API 500');
    });
  });

  describe('getJobs()', () => {
    it('should GET /jobs with optional status filter', async () => {
      const mockJobs = [
        { id: 'job-1', name: 'Panel Upgrade', address: '123 Main St', status: 'active' },
      ];

      mockFetch.mockReturnValueOnce(mockJsonResponse(mockJobs));

      const result = await getJobs('active');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/jobs?status=active');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Panel Upgrade');
    });

    it('should GET /jobs without filter when status is undefined', async () => {
      mockFetch.mockReturnValueOnce(mockJsonResponse([]));

      await getJobs();

      const [url] = mockFetch.mock.calls[0];
      expect(url).toMatch(/\/jobs$/);
    });
  });

  describe('getSchedule()', () => {
    it('should GET /schedule with start and end dates', async () => {
      mockFetch.mockReturnValueOnce(mockJsonResponse([]));

      await getSchedule('2026-03-21', '2026-03-27');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/schedule?start=2026-03-21&end=2026-03-27');
    });
  });

  describe('searchKnowledge()', () => {
    it('should POST to /knowledge/search', async () => {
      const mockResults = [
        { type: 'nec-code', title: 'NEC 210.8', content: 'GFCI...', relevance: 0.9, source: 'NEC 2023' },
      ];

      mockFetch.mockReturnValueOnce(mockJsonResponse(mockResults));

      const result = await searchKnowledge('GFCI requirements', 'nec-code');

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.query).toBe('GFCI requirements');
      expect(body.type).toBe('nec-code');
      expect(result).toHaveLength(1);
    });
  });

  describe('getCustomer()', () => {
    it('should GET /customers/:id', async () => {
      const mockCustomer = { id: 'cust-1', name: 'Mike Johnson', phone: '555-0142' };

      mockFetch.mockReturnValueOnce(mockJsonResponse(mockCustomer));

      const result = await getCustomer('cust-1');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/customers/cust-1');
      expect(result.name).toBe('Mike Johnson');
    });
  });

  describe('submitTimeEntry()', () => {
    it('should POST to /time-entries', async () => {
      mockFetch.mockReturnValueOnce(mockJsonResponse({ success: true, id: 'te-1' }));

      const result = await submitTimeEntry({
        clockIn: '2026-03-21T08:00:00Z',
        location: { lat: 33.4484, lng: -112.074 },
      });

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('/time-entries');
      expect(options.method).toBe('POST');
      expect(result.success).toBe(true);
    });
  });

  describe('getDispatch()', () => {
    it('should GET /dispatch', async () => {
      mockFetch.mockReturnValueOnce(mockJsonResponse([]));

      await getDispatch();

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/dispatch');
    });
  });

  describe('respondToDispatch()', () => {
    it('should POST accept response', async () => {
      mockFetch.mockReturnValueOnce(mockJsonResponse({ success: true }));

      const result = await respondToDispatch('disp-1', 'accept', 'On my way');

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('/dispatch/disp-1/respond');
      const body = JSON.parse(options.body);
      expect(body.action).toBe('accept');
      expect(body.notes).toBe('On my way');
      expect(result.success).toBe(true);
    });
  });

  describe('cleanup()', () => {
    it('should clear token and not send auth header after cleanup', async () => {
      cleanup();

      mockFetch.mockReturnValueOnce(mockJsonResponse({ message: 'ok' }));
      await askEcho('test');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers['Authorization']).toBeUndefined();
    });
  });
});
