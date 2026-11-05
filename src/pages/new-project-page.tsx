import { PageHeader } from "../components/common/page-header";
import { NewProjectView } from "../components/projects/new-project-view";

export function NewProjectPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="New project"
        description="Paste your code or import a public GitHub repository to get an AI review."
      />
      <NewProjectView />
    </div>
  );
}
