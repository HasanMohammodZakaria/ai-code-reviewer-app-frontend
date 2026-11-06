import { PageHeader } from "../components/common/page-header";
import { StudentsView } from "../components/teacher/students-view";

export function TeacherStudentsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Students"
        description="Search, sort by score and select students to compare."
      />
      <StudentsView />
    </div>
  );
}
