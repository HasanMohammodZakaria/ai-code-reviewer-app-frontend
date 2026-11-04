import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { FullScreenSpinner } from "../common/full-screen-spinner";

/** The "/" route: send each visitor to the right place */
export function HomeRedirect() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <FullScreenSpinner />;
  }

  if (status === "authenticated" && user !== null) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Navigate to={ROUTES.login} replace />;
}
