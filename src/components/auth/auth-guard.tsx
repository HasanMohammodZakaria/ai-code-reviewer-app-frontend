import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import type { UserRole } from "../../types/user";
import { FullScreenSpinner } from "../common/full-screen-spinner";

type AuthGuardProps = {
  /** Only this role may enter. Without it, any logged-in user may enter. */
  role?: UserRole;
};

export function AuthGuard({ role }: AuthGuardProps) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <FullScreenSpinner />;
  }

  if (status === "unauthenticated" || user === null) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  // Wrong role: send the user to their own home. The server enforces this again.
  if (role !== undefined && user.role !== role) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
