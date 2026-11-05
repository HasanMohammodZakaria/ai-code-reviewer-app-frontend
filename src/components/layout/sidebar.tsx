import { Link, useLocation } from "react-router-dom";
import {
  FilePlus2,
  FolderOpen,
  GitCompare,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { cn } from "../../lib/utils";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Active only on this exact path (not on child paths) */
  end?: boolean;
  /** Child paths that belong to another item */
  exclude?: string[];
};

const STUDENT_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: ROUTES.dashboard,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Projects",
    to: ROUTES.projects,
    icon: FolderOpen,
    exclude: [ROUTES.newProject],
  },
  { label: "New project", to: ROUTES.newProject, icon: FilePlus2 },
  { label: "Settings", to: ROUTES.settings, icon: Settings },
];

const TEACHER_ITEMS: NavItem[] = [
  { label: "Overview", to: ROUTES.teacher, icon: LayoutDashboard, end: true },
  { label: "Students", to: ROUTES.teacherStudents, icon: Users },
  { label: "Compare", to: ROUTES.teacherCompare, icon: GitCompare },
  { label: "Settings", to: ROUTES.settings, icon: Settings },
];

function isUnder(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isItemActive(pathname: string, item: NavItem): boolean {
  const matches = item.end ? pathname === item.to : isUnder(pathname, item.to);

  if (!matches) return false;
  return !(item.exclude ?? []).some((path) => isUnder(pathname, path));
}

type SidebarContentProps = {
  /** Called after a link is clicked, e.g. to close the mobile drawer */
  onNavigate?: () => void;
};

/** Logo and links. Used by the desktop sidebar and the mobile drawer. */
export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return null;

  const items = user.role === "teacher" ? TEACHER_ITEMS : STUDENT_ITEMS;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center px-4">
        <Link
          to={getHomePath(user.role)}
          onClick={onNavigate}
          className="rounded-md text-lg font-semibold tracking-tight"
        >
          <span className="text-primary">AI</span> Code Reviewer
        </Link>
      </div>

      <nav
        aria-label="Main"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-2"
      >
        {items.map((item) => {
          const active = isItemActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active && "text-sidebar-primary",
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/** Desktop sidebar: hidden below the lg breakpoint (the mobile drawer is used there) */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
      <div className="sticky top-0 h-svh">
        <SidebarContent />
      </div>
    </aside>
  );
}
