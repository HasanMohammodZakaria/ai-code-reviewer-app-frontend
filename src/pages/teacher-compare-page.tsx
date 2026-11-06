import { PageHeader } from "../components/common/page-header";
import { CompareView } from "../components/teacher/compare-view";

export function TeacherComparePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Compare students"
        description="Scores and score history, side by side."
      />
      <CompareView />
    </div>
  );
}
