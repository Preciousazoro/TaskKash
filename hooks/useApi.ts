import { useCallback, useRef, useEffect } from 'react';

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

interface UseApiOptions {
  cacheTTL?: number; // Time to live in milliseconds
  retries?: number;
  retryDelay?: number;
}

export function useApi() {
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());

  const fetchWithCache = useCallback(async (
    url: string,
    options: RequestInit = {},
    apiOptions: UseApiOptions = {}
  ): Promise<any> => {
    const { cacheTTL = 5 * 60 * 1000, retries = 2, retryDelay = 1000 } = apiOptions;
    const cacheKey = `${url}:${JSON.stringify(options)}`;

    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Check if there's already a pending request for this URL
    const pending = pendingRequests.current.get(cacheKey);
    if (pending) {
      return pending;
    }

    // Create new request
    const request = makeRequest(url, options, retries, retryDelay);
    pendingRequests.current.set(cacheKey, request);

    try {
      const data = await request;
      
      // Cache the response
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL
      });

      return data;
    } finally {
      // Clean up pending request
      pendingRequests.current.delete(cacheKey);
    }
  }, []);

  return { fetchWithCache };
}

async function makeRequest(
  url: string,
  options: RequestInit,
  retries: number,
  retryDelay: number
): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError;
}

// Hook for preventing repeated API calls in useEffect
export function useApiCall<T = any>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
  options: { enabled?: boolean; cacheKey?: string } = {}
) {
  const { enabled = true, cacheKey } = options;
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  return useCallback(() => {
    if (!enabled) return Promise.resolve<T | null>(null);

    // Check cache if cacheKey is provided
    if (cacheKey) {
      const cached = cacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 30000) { // 30 seconds cache
        return Promise.resolve(cached.data);
      }
    }

    const promise = fetcher();
    
    if (cacheKey) {
      promise.then(data => {
        cacheRef.current.set(cacheKey, { data, timestamp: Date.now() });
      }).catch(() => {
        // Don't cache errors
      });
    }

    return promise;
  }, deps);
}

// Cleanup function to clear old cache entries
export function clearExpiredCache() {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      apiCache.delete(key);
    }
  }
}

// Clear cache periodically
if (typeof window !== 'undefined') {
  setInterval(clearExpiredCache, 60000); // Clean up every minute
}
