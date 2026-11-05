import { useMutation } from "@tanstack/react-query";
import { changePassword, type ChangePasswordInput } from "../../api/auth";
import type { AuthResponse, NormalizedError } from "../../types/api";
import { useAuth } from "../use-auth";

/**
 * Change the logged-in user's password (PATCH /auth/password).
 * A wrong current password returns 400 and is never retried by the client.
 * On success the server revokes every other session and returns a new access
 * token, which changePassword() already stored, so the user stays logged in here.
 */
export function useChangePassword() {
  const { setUser } = useAuth();

  return useMutation<AuthResponse, NormalizedError, ChangePasswordInput>({
    mutationFn: (input) => changePassword(input),
    onSuccess: ({ user }) => {
      setUser(user);
    },
  });
}
