import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api/auth";
import { setAuthFailureHandler } from "../api/client";
import { queryClient } from "../lib/query-client";
import { clearAccessToken, subscribeToken } from "../lib/token-store";
import type { User } from "../types/user";
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
} from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  /* App load: restore the session from the refresh cookie.
     refresh() shares one promise, so StrictMode's double effect sends one request. */
  useEffect(() => {
    let active = true;

    authApi
      .refresh()
      .then(({ user: restored }) => {
        if (!active) return;
        setUserState(restored);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!active) return;
        clearAccessToken();
        setUserState(null);
        setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  /* The Axios client calls this when the server rejects the refresh.
     The auth() guard sees the state change and redirects to /login. */
  useEffect(() => {
    setAuthFailureHandler(() => {
      setUserState(null);
      setStatus("unauthenticated");
    });
    return () => setAuthFailureHandler(null);
  }, []);

  /* If the token is cleared from anywhere (logout, failed refresh, app load),
     drop the user and the cached data, so the next user never sees it */
  useEffect(() => {
    return subscribeToken((token) => {
      if (token === null) {
        queryClient.clear();
        setUserState(null);
        setStatus("unauthenticated");
      }
    });
  }, []);

  const login = useCallback(async (input: authApi.LoginInput) => {
    const { user: loggedIn } = await authApi.login(input);
    setUserState(loggedIn);
    setStatus("authenticated");
    return loggedIn;
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const { user: loggedIn } = await authApi.googleLogin(idToken);
    setUserState(loggedIn);
    setStatus("authenticated");
    return loggedIn;
  }, []);

  const register = useCallback(async (input: authApi.RegisterInput) => {
    const { user: created } = await authApi.register(input);
    setUserState(created);
    setStatus("authenticated");
    return created;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // the server could not be reached: still log out locally
    } finally {
      clearAccessToken();
      setUserState(null);
      setStatus("unauthenticated");
    }
  }, []);

  const setUser = useCallback((next: User) => {
    setUserState(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, loginWithGoogle, register, logout, setUser }),
    [user, status, login, loginWithGoogle, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
