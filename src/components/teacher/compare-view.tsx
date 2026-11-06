import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, GitCompare } from "lucide-react";
import { COMPARE_MAX, COMPARE_MIN } from "../../api/teacher";
import { useCompare } from "../../hooks/queries/use-compare";
import { ROUTES } from "../../lib/routes";
import { CompareChart } from "../charts/compare-chart";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { CompareTable } from "./compare-table";

/** "a,b,c" from the URL to a list of unique, non-empty ids */
function parseIds(value: string | null): string[] {
  const ids = (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return [...new Set(ids)];
}

function BackToStudents() {
  return (
    <Button asChild variant="outline">
      <Link to={ROUTES.teacherStudents}>
        <ArrowLeft />
        Back to students
      </Link>
    </Button>
  );
}

/** The Compare page body. The students come from ?ids=a,b,c (2 to 10 ids) */
export function CompareView() {
  const [params] = useSearchParams();
  const ids = useMemo(() => parseIds(params.get("ids")), [params]);
  const isValid = ids.length >= COMPARE_MIN && ids.length <= COMPARE_MAX;

  const { data, isPending, error, refetch, isFetching } = useCompare(ids);

  if (!isValid) {
    return (
      <EmptyState
        icon={GitCompare}
        title={
          ids.length > COMPARE_MAX
            ? "Too many students"
            : "Choose students to compare"
        }
        description={`Select between ${COMPARE_MIN} and ${COMPARE_MAX} students on the Students page.`}
        action={<BackToStudents />}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        action={<BackToStudents />}
      />
    );
  }

  if (isPending) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading comparison">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to={ROUTES.teacherStudents}>
          <ArrowLeft />
          Students
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Score history</CardTitle>
        </CardHeader>
        <CardContent>
          <CompareChart students={data} />
        </CardContent>
      </Card>

      <section aria-labelledby="compare-numbers-title" className="space-y-4">
        <h2
          id="compare-numbers-title"
          className="text-lg font-semibold text-foreground"
        >
          Numbers side by side
        </h2>
        <CompareTable students={data} />
      </section>
    </div>
  );
}
