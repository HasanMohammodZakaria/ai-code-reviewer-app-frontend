import { api, refreshSession } from "./client";
import { setAccessToken } from "../lib/token-store";
import type { ApiSuccess, AuthResponse, UserResponse } from "../types/api";

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  image?: File | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateProfileInput = {
  fullName?: string;
  image?: File | null;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const form = new FormData();
  form.append("fullName", input.fullName);
  form.append("email", input.email);
  form.append("password", input.password);
  if (input.image) {
    form.append("image", input.image);
  }

  const response = await api.post<ApiSuccess<AuthResponse>>(
    "/auth/register",
    form,
  );
  setAccessToken(response.data.data.accessToken);
  return response.data.data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await api.post<ApiSuccess<AuthResponse>>(
    "/auth/login",
    input,
  );
  setAccessToken(response.data.data.accessToken);
  return response.data.data;
}

/** Used on app load. Shares the single-flight promise from client.ts */
export function refresh(): Promise<AuthResponse> {
  return refreshSession();
}

export async function logout(): Promise<void> {
  await api.post<ApiSuccess<null>>("/auth/logout");
}

export async function getMe(): Promise<UserResponse["user"]> {
  const response = await api.get<ApiSuccess<UserResponse>>("/auth/me");
  return response.data.data.user;
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<UserResponse["user"]> {
  const form = new FormData();
  if (input.fullName !== undefined) {
    form.append("fullName", input.fullName);
  }
  if (input.image) {
    form.append("image", input.image);
  }

  const response = await api.patch<ApiSuccess<UserResponse>>("/auth/me", form);
  return response.data.data.user;
}

/**
 * A wrong current password returns 400 (never retried by the client).
 * On success every old access token is invalid, so the new one replaces it.
 */
export async function changePassword(
  input: ChangePasswordInput,
): Promise<AuthResponse> {
  const response = await api.patch<ApiSuccess<AuthResponse>>(
    "/auth/password",
    input,
  );
  setAccessToken(response.data.data.accessToken);
  return response.data.data;
}

export async function forgotPassword(email: string): Promise<string> {
  const response = await api.post<ApiSuccess<null>>("/auth/forgot-password", {
    email,
  });
  return (
    response.data.message ??
    "If that email is registered, a reset link has been sent."
  );
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<string> {
  const response = await api.post<ApiSuccess<null>>(
    "/auth/reset-password",
    input,
  );
  return (
    response.data.message ??
    "Password reset. Please log in with your new password."
  );
}
