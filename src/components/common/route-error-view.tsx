import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { RotateCw, TriangleAlert } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { Button } from "../ui/button";

function describe(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

/** Shown when a page crashes while rendering, instead of a blank screen */
export function RouteErrorView() {
  const error = useRouteError();
  const { user, status } = useAuth();
  const loggedIn = status === "authenticated" && user !== null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div
        role="alert"
        className="flex max-w-md flex-col items-center gap-4 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            The page could not be shown. Reload it, or go back to the start.
          </p>
          {import.meta.env.DEV ? (
            <p className="wrap-break-word rounded-md border border-border bg-muted px-3 py-2 text-left font-mono text-xs text-muted-foreground">
              {describe(error)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button type="button" onClick={() => window.location.reload()}>
            <RotateCw />
            Reload page
          </Button>
          <Button asChild variant="outline">
            <Link to={loggedIn ? getHomePath(user.role) : ROUTES.login}>
              {loggedIn ? "Go to my dashboard" : "Go to login"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
