import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { Button } from "../ui/button";

/** Shown for any path that does not exist. The button leads to the user's own home, or to login */
export function NotFoundView() {
  const { user, status } = useAuth();
  const loggedIn = status === "authenticated" && user !== null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Compass className="size-7" aria-hidden="true" />
        </span>

        <p className="text-sm font-medium tabular-nums text-muted-foreground">
          404
        </p>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            This page does not exist, or the link is wrong.
          </p>
        </div>

        <Button asChild>
          <Link to={loggedIn ? getHomePath(user.role) : ROUTES.login}>
            {loggedIn ? "Go to my dashboard" : "Go to login"}
          </Link>
        </Button>
      </div>
    </main>
  );
}
