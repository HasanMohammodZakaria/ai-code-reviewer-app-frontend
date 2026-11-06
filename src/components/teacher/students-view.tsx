import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitCompare, Search, SearchX, Users } from "lucide-react";
import { COMPARE_MAX, COMPARE_MIN } from "../../api/teacher";
import { useStudents } from "../../hooks/queries/use-students";
import { useStudentListControls } from "../../hooks/use-student-list-controls";
import { comparePath } from "../../lib/routes";
import { cn } from "../../lib/utils";
import type { StudentInfo } from "../../types/teacher";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { StudentsPagination } from "./students-pagination";
import { StudentsTable } from "./students-table";

const SEARCH_DELAY_MS = 300;

/** The Students page body: search, sortable table, compare selection and pages */
export function StudentsView() {
  const navigate = useNavigate();
  const { search, sort, order, page, setSearch, toggleSort, setPage } =
    useStudentListControls();

  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState<Map<string, string>>(
    () => new Map(),
  );
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const { data, isPending, error, refetch, isFetching, isPlaceholderData } =
    useStudents({
      page,
      sort,
      order,
      search: search || undefined,
    });

  // The server is asked only after the user stops typing
  function handleSearchChange(value: string) {
    setSearchInput(value);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setSearch(value),
      SEARCH_DELAY_MS,
    );
  }

  function clearSearch() {
    window.clearTimeout(timerRef.current);
    setSearchInput("");
    setSearch("");
  }

  // The selection lives across pages, so students from page 1 and page 3 can be compared
  function toggleStudent(student: StudentInfo) {
    setSelected((current) => {
      const next = new Map(current);
      if (next.has(student._id)) next.delete(student._id);
      else if (next.size < COMPARE_MAX) next.set(student._id, student.fullName);
      return next;
    });
  }

  const canCompare =
    selected.size >= COMPARE_MIN && selected.size <= COMPARE_MAX;

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-xl border border-border bg-card p-3 sm:p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search students"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {selected.size === 0
              ? `Select ${COMPARE_MIN} to ${COMPARE_MAX} students to compare them`
              : selected.size >= COMPARE_MAX
                ? `${selected.size} selected (maximum reached)`
                : `${selected.size} selected`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {selected.size > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Map())}
              >
                Clear selection
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              disabled={!canCompare}
              onClick={() => navigate(comparePath([...selected.keys()]))}
            >
              <GitCompare />
              Compare
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : isPending ? (
        <div className="space-y-2" role="status" aria-label="Loading students">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : data.total === 0 ? (
        search ? (
          <EmptyState
            icon={SearchX}
            title="No students match your search"
            description="Check the spelling, or search by a part of the name or email."
            action={
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Students appear here as soon as they register."
          />
        )
      ) : (
        <div
          className={cn(
            "space-y-4 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <StudentsTable
            items={data.items}
            sort={sort}
            order={order}
            onSort={toggleSort}
            selected={selected}
            maxSelected={COMPARE_MAX}
            onToggle={toggleStudent}
          />
          <StudentsPagination
            page={data.page}
            pages={data.pages}
            total={data.total}
            limit={data.limit}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
