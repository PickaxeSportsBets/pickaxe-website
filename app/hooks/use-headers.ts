"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

interface Headers {
  get: (name: string) => string | null;
  set: (name: string, value: string) => void;
}

interface UseHeadersResult {
  headers: Headers | null;
  token: string | null;
  loading: boolean;
  error: Error | null;
  getAuthHeaders: () => Promise<HeadersInit>;
  refreshHeaders: () => Promise<void>;
}

interface CachedHeaders {
  headers: Record<string, string>;
  timestamp: number;
}

const CACHE_DURATION = 55 * 60 * 1000; // 55 minutes in milliseconds

export function useHeaders(): UseHeadersResult {
  const [headers, setHeaders] = useState<Headers | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref to store cached headers across renders
  const cachedHeadersRef = useRef<CachedHeaders | null>(null);

  const fetchHeaders = async () => {
    try {
      const response = await fetch('/api/headers', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch headers');
      }

      const headerEntries = Array.from(response.headers.entries());
      const headersMap = new Map(headerEntries);

      // Create Headers object for internal state
      const headersObj: Headers = {
        get: (name: string) => {
          const value = headersMap.get(name);
          return value || null;
        },
        set: (name: string, value: string) => {
          headersMap.set(name, value);
        },
      };

      // Create plain object for cache
      const headersPlainObj: Record<string, string> = {};
      for (const [key, value] of headerEntries) {
        headersPlainObj[key] = value;
      }
      headersPlainObj['Content-Type'] = 'application/json';

      // Update cache
      cachedHeadersRef.current = {
        headers: headersPlainObj,
        timestamp: Date.now(),
      };

      setHeaders(headersObj);

      const authHeader = headersObj.get('Authorization');
      const token = authHeader?.replace('Bearer ', '') || null;
      setToken(token);

      return headersObj;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const shouldRefreshHeaders = () => {
    if (!cachedHeadersRef.current) return true;
    
    const age = Date.now() - cachedHeadersRef.current.timestamp;
    return age > CACHE_DURATION;
  };

  const refreshHeaders = async () => {
    await fetchHeaders();
  };

  const getAuthHeaders = useCallback(async (): Promise<HeadersInit> => {
    if (shouldRefreshHeaders()) {
      await fetchHeaders();
    }
    
    return cachedHeadersRef.current?.headers || {};
  }, []);

  useEffect(() => {
    if (!cachedHeadersRef.current) {
      fetchHeaders();
    }
  }, []);

  return { headers, token, loading, error, getAuthHeaders, refreshHeaders };
} 