import { createContext } from "react";
import type { LoginInput, RegisterInput } from "../api/auth";
import type { User } from "../types/user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  /** The logged-in user, or null while loading and when logged out */
  user: User | null;
  /** "loading" until the first refresh on app load has finished */
  status: AuthStatus;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  /** Always clears local state, even if the server request fails */
  logout: () => Promise<void>;
  /** Replace the stored user, e.g. after a profile update or password change */
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
