import { useEffect, useId, useRef, useState } from "react";
import { FilterX, Search, X } from "lucide-react";
import {
  isProjectSort,
  PROJECT_SORT_OPTIONS,
  type ProjectSort,
} from "../../lib/project-list";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

/** Typing is sent to the URL only after this pause */
const SEARCH_DELAY_MS = 250;

type ProjectListToolbarProps = {
  /** Current values, from useProjectListControls() */
  search: string;
  sort: ProjectSort;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ProjectSort) => void;
  onReset: () => void;
  className?: string;
};

/** Search box, sort select and a "Clear filters" button for My projects */
export function ProjectListToolbar({
  search,
  sort,
  hasFilters,
  onSearchChange,
  onSortChange,
  onReset,
  className,
}: ProjectListToolbarProps) {
  const searchId = useId();
  const sortId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  /* The field keeps its own text, so typing never waits for the URL update.
     `pushed` is the last value this field sent up; `seenSearch` notices when
     the URL changes from outside (Clear filters, the Back button). */
  const [draft, setDraft] = useState(search);
  const [pushed, setPushed] = useState(search);
  const [seenSearch, setSeenSearch] = useState(search);

  if (search !== seenSearch) {
    setSeenSearch(search);
    if (search !== pushed) {
      setDraft(search);
      setPushed(search);
    }
  }

  useEffect(() => {
    if (draft === pushed) return;

    const timer = window.setTimeout(() => {
      setPushed(draft);
      onSearchChange(draft);
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [draft, pushed, onSearchChange]);

  const handleClearSearch = () => {
    setDraft("");
    setPushed("");
    onSearchChange("");
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setDraft("");
    setPushed("");
    onReset();
  };

  return (
    <div
      role="search"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Label htmlFor={searchId} className="sr-only">
          Search projects
        </Label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          id={searchId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by title or description"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="pl-9 pr-10"
        />
        {draft !== "" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X />
          </Button>
        ) : null}
      </div>

      <div className="sm:w-52">
        <Label htmlFor={sortId} className="sr-only">
          Sort projects
        </Label>
        <select
          id={sortId}
          value={sort}
          onChange={(event) => {
            const value = event.target.value;
            if (isProjectSort(value)) onSortChange(value);
          }}
          className={cn(
            "h-10 w-full rounded-md border border-input bg-background px-3 text-base text-foreground transition-colors md:h-9 md:text-sm",
            "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            "dark:scheme-dark",
          )}
        >
          {PROJECT_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          className="self-start sm:self-auto"
          onClick={handleReset}
        >
          <FilterX />
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
