import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES } from "../../lib/routes";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/** Right side of the header: the user's image and name when logged in, a Log in button otherwise */
function AccountArea() {
  const { status } = useAuth();

  // The first session check on app load is still running: keep the space so nothing jumps
  if (status === "loading") {
    return <Skeleton className="h-9 w-24" />;
  }

  if (status === "authenticated") {
    return <UserMenu />;
  }

  return (
    <Button asChild>
      <Link to={ROUTES.login}>Log in</Link>
    </Button>
  );
}

/** Public header: logo on the left, theme toggle and account area on the right */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          to={ROUTES.landing}
          className="rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <span className="text-primary">AI</span> Code Reviewer
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <AccountArea />
        </div>
      </div>
    </header>
  );
}
