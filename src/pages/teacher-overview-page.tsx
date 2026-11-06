import { PageHeader } from "../components/common/page-header";
import { TeacherOverviewView } from "../components/teacher/overview-view";

export function TeacherOverviewPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Class overview"
        description="How all students are doing, at a glance."
      />
      <TeacherOverviewView />
    </div>
  );
}
