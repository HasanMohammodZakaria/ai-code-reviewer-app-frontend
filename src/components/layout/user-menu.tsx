import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    // The next person to log in on this browser must not see cached data
    queryClient.clear();
  };

  const isTeacher = user.role === "teacher";
  const roleLabel = isTeacher ? "Teacher" : "Student";
  const dashboardLabel = isTeacher ? "Teacher dashboard" : "Student dashboard";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-10 gap-2 px-2"
          aria-label="Open user menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={user.image} alt="" />
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
            {user.fullName}
          </span>
          <ChevronDown
            className="hidden text-muted-foreground sm:block"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="truncate">{user.fullName}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
          <p className="mt-1 text-xs font-normal text-muted-foreground">
            {roleLabel}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={getHomePath(user.role)}>
            <LayoutDashboard aria-hidden="true" />
            {dashboardLabel}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={ROUTES.settings}>
            <Settings aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem disabled={loggingOut} onSelect={handleLogout}>
          <LogOut aria-hidden="true" />
          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
