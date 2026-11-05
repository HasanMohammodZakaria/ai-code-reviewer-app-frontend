import { ProjectsHeader } from "../components/projects/projects-header";
import { ProjectsView } from "../components/projects/projects-view";

export function ProjectsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ProjectsHeader />
      <ProjectsView />
    </div>
  );
}
