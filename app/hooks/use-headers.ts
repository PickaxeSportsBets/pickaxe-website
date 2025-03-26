import { useState, useEffect, useCallback } from 'react';

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
}

export function useHeaders(): UseHeadersResult {
  const [headers, setHeaders] = useState<Headers | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

      const headers: Headers = {
        get: (name: string) => {
          const value = headersMap.get(name);
          return value || null;
        },
        set: (name: string, value: string) => {
          headersMap.set(name, value);
        },
      };

      setHeaders(headers);

      const authHeader = headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '') || null;
      setToken(token);

      return headers;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Modified to return a plain object that matches HeadersInit
  const getAuthHeaders = useCallback(async () => {
    const response = await fetch('/api/headers');
    const headerEntries = Array.from(response.headers.entries());
    
    // Convert headers to a plain object
    const headersObject: Record<string, string> = {};
    for (const [key, value] of headerEntries) {
      headersObject[key] = value;
    }
    
    // Add Content-Type
    headersObject['Content-Type'] = 'application/json';
    
    return headersObject;
  }, []);

  useEffect(() => {
    fetchHeaders();
  }, []);

  return { headers, token, loading, error, getAuthHeaders };
} 