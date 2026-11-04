import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { getHomePath } from "../../lib/routes";
import { FullScreenSpinner } from "../common/full-screen-spinner";

export function GuestGuard() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <FullScreenSpinner />;
  }

  if (status === "authenticated" && user !== null) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
