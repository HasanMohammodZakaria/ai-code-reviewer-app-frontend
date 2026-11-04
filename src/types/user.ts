export type UserRole = "student" | "teacher";

export type AuthProvider = "local" | "google";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};
