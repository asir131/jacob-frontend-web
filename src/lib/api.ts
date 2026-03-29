/**
 * Centralized API client for LocallyServe
 * All fetch calls should go through this module, never raw fetch() in components.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const DEFAULT_TIMEOUT_MS = 10_000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Retrieves the auth token from storage.
 * Replace with your actual auth token retrieval logic (e.g., from cookies or a store).
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Core fetch wrapper with:
 * - Auth token injection
 * - 10s timeout via AbortController
 * - Consistent error shape
 * - JSON serialization/deserialization
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, signal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // Merge caller's signal with our timeout signal
  const mergedSignal = signal ?? controller.signal;

  const token = getAuthToken();

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: mergedSignal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      // Token expired — clear local auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return { data: null, error: 'Session expired. Please log in again.', status: 401 };
    }

    if (!response.ok) {
      const errorBody = await response.text();
      let message = `Request failed with status ${response.status}`;
      try {
        const parsed = JSON.parse(errorBody) as { message?: string };
        if (parsed?.message) message = parsed.message;
      } catch {
        // ignore JSON parse error — use default message
      }
      return { data: null, error: message, status: response.status };
    }

    if (response.status === 204) {
      return { data: null, error: null, status: 204 };
    }

    const data = (await response.json()) as T;
    return { data, error: null, status: response.status };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      return {
        data: null,
        error: 'Request timed out. Please check your connection and try again.',
        status: 408,
      };
    }

    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected network error occurred.',
      status: 0,
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
