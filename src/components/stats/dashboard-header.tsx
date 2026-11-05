import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES } from "../../lib/routes";
import { PageHeader } from "../common/page-header";
import { Button } from "../ui/button";

/** Dashboard title with a greeting and the "New project" shortcut */
export function DashboardHeader() {
  const { user } = useAuth();
  const firstName = user?.fullName.trim().split(/\s+/)[0];

  return (
    <PageHeader
      title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
      description="Your projects, scores and recent reviews at a glance."
      actions={
        <Button asChild>
          <Link to={ROUTES.newProject}>
            <Plus />
            New project
          </Link>
        </Button>
      }
    />
  );
}
