import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { ROUTES } from "../../lib/routes";
import { PageHeader } from "../common/page-header";
import { Button } from "../ui/button";

/** My projects title with the "New project" button */
export function ProjectsHeader() {
  return (
    <PageHeader
      title="My projects"
      description="All the code you have submitted for review."
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
