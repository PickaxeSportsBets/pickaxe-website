"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

interface HeadersContextType {
  headers: Record<string, string> | null;
  token: string | null;
  loading: boolean;
  error: Error | null;
  getAuthHeaders: () => Promise<HeadersInit>;
  refreshHeaders: () => Promise<void>;
}

const HeadersContext = createContext<HeadersContextType | undefined>(undefined);

// Cache timeout (55 minutes)
const CACHE_TIMEOUT = 55 * 60 * 1000;

export function HeadersProvider({ children }: { children: ReactNode }) {
  const [headers, setHeaders] = useState<Record<string, string> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  const fetchHeaders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/headers", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch headers: ${response.status}`);
      }

      const headerEntries = Array.from(response.headers.entries());
      const headersObject: Record<string, string> = {};

      for (const [key, value] of headerEntries) {
        headersObject[key] = value;
      }

      // Add Content-Type
      headersObject["Content-Type"] = "application/json";

      setHeaders(headersObject);

      // Extract token
      const authHeader = response.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "") || null;
      setToken(token);

      // Update last fetch timestamp
      setLastFetch(Date.now());

      return headersObject;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchHeaders();
  }, []);

  // Get headers with caching
  const getAuthHeaders = async (): Promise<HeadersInit> => {
    // Check if we need to refresh (cache expired or no headers)
    if (!headers || Date.now() - lastFetch > CACHE_TIMEOUT) {
      return await fetchHeaders();
    }
    return headers;
  };

  // Manual refresh function
  const refreshHeaders = async (): Promise<void> => {
    await fetchHeaders();
  };

  const value = useMemo(
    () => ({
      headers,
      token,
      loading,
      error,
      getAuthHeaders,
      refreshHeaders,
    }),
    [headers, token, loading, error]
  );

  return (
    <HeadersContext.Provider value={value}>{children}</HeadersContext.Provider>
  );
}

export function useHeaders(): HeadersContextType {
  const context = useContext(HeadersContext);
  if (context === undefined) {
    throw new Error("useHeaders must be used within a HeadersProvider");
  }
  return context;
}
