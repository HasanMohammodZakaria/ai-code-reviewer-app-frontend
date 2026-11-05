import { useMutation } from "@tanstack/react-query";
import { updateProfile, type UpdateProfileInput } from "../../api/auth";
import type { NormalizedError } from "../../types/api";
import type { User } from "../../types/user";
import { useAuth } from "../use-auth";

/**
 * Update the logged-in user's name and/or profile image (PATCH /auth/me).
 * On success the new user replaces the one in the auth context, so the
 * top bar and user menu show the change immediately.
 */
export function useUpdateProfile() {
  const { setUser } = useAuth();

  return useMutation<User, NormalizedError, UpdateProfileInput>({
    mutationFn: (input) => updateProfile(input),
    onSuccess: (user) => {
      setUser(user);
    },
  });
}
