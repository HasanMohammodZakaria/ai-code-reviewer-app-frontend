import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { getHomePath } from "../../lib/routes";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

type TopBarProps = {
  /** Opens the mobile navigation drawer */
  onOpenMenu: () => void;
};

export function TopBar({ onOpenMenu }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      {user ? (
        <Link
          to={getHomePath(user.role)}
          className="rounded-md text-base font-semibold tracking-tight lg:hidden"
        >
          <span className="text-primary">AI</span> Code Reviewer
        </Link>
      ) : null}

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
