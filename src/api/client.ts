import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../lib/token-store";
import type { ApiSuccess, AuthResponse, NormalizedError } from "../types/api";
import { normalizeError } from "./errors";

const BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT_MS = 30_000;

/** Auth endpoints that must never trigger refresh-and-retry */
const NO_RETRY_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/google",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
]);

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: DEFAULT_TIMEOUT_MS,
});

/** Bare instance with no interceptors, so refresh can never loop into itself */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: DEFAULT_TIMEOUT_MS,
});

/* ---------- Auth failure notification ---------- */

let authFailureHandler: (() => void) | null = null;

/** The auth provider registers here to clear its state and go to /login */
export function setAuthFailureHandler(handler: (() => void) | null): void {
  authFailureHandler = handler;
}

/* ---------- Single-flight refresh ---------- */

let refreshPromise: Promise<AuthResponse> | null = null;

/**
 * Only one refresh request is ever in flight. Every caller (the 401
 * interceptor, the app-load check, React StrictMode's double effect) shares
 * the same promise. The backend rotates refresh tokens and treats reuse of an
 * old one as theft, so two parallel refreshes would log out every device.
 */
export function refreshSession(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiSuccess<AuthResponse>>("/auth/refresh")
      .then((response) => {
        setAccessToken(response.data.data.accessToken);
        return response.data.data;
      })
      .catch((error: unknown) => {
        throw normalizeError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/* ---------- Request interceptor ---------- */

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/* ---------- Response interceptor ---------- */

/** The session is really gone only when the server rejects the refresh itself */
function isSessionRejected(error: NormalizedError): boolean {
  return error.status === 400 || error.status === 401 || error.status === 403;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    // Only a 401 on a protected call is retried. A 400 (for example a wrong
    // current password) and every other status go straight to the caller.
    if (
      !axios.isAxiosError(error) ||
      !config ||
      error.response?.status !== 401 ||
      config._retry ||
      NO_RETRY_PATHS.has(config.url ?? "")
    ) {
      throw normalizeError(error);
    }

    config._retry = true;

    const sentAuthorization = String(config.headers.get("Authorization") ?? "");
    const currentToken = getAccessToken();
    const alreadyRefreshed =
      currentToken !== null && sentAuthorization !== `Bearer ${currentToken}`;

    try {
      // If another request refreshed while this one was in flight, the store
      // already holds a newer token, so retry without another refresh.
      if (!alreadyRefreshed) {
        await refreshSession();
      }
    } catch (refreshError) {
      const normalized = refreshError as NormalizedError;
      if (isSessionRejected(normalized)) {
        clearAccessToken();
        authFailureHandler?.();
        throw normalizeError(error);
      }
      // Network problem, timeout, 429 or 5xx: keep the session, let the caller retry
      throw normalized;
    }

    // The request interceptor attaches the new token again
    config.headers.delete("Authorization");
    return api(config);
  },
);
