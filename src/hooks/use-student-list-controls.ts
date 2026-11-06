import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortOrder, StudentSortField } from "../types/teacher";

const SORT_FIELDS: readonly StudentSortField[] = [
  "latestScore",
  "avgScore",
  "reviewCount",
  "projectCount",
  "name",
];

export const DEFAULT_STUDENT_SORT: StudentSortField = "latestScore";

function isSortField(value: string): value is StudentSortField {
  return (SORT_FIELDS as readonly string[]).includes(value);
}

function parsePage(value: string | null): number {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page >= 1 ? page : 1;
}

/**
 * Search, sort, order and page of the Students list, kept in the URL
 * (?q=ana&sort=name&order=asc&page=2). Defaults (latestScore, desc, page 1)
 * are left out to keep the URL short.
 */
export function useStudentListControls() {
  const [params, setParams] = useSearchParams();

  const search = params.get("q") ?? "";
  const sortParam = params.get("sort");
  const sort: StudentSortField =
    sortParam !== null && isSortField(sortParam)
      ? sortParam
      : DEFAULT_STUDENT_SORT;
  const order: SortOrder = params.get("order") === "asc" ? "asc" : "desc";
  const page = parsePage(params.get("page"));

  const setSearch = useCallback(
    (value: string) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value.trim() === "") next.delete("q");
          else next.set("q", value.trim());
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  /** Same column: flip the order. New column: start with its natural order (name A to Z, the rest high to low) */
  const toggleSort = useCallback(
    (field: StudentSortField) => {
      const nextOrder: SortOrder =
        field === sort
          ? order === "asc"
            ? "desc"
            : "asc"
          : field === "name"
            ? "asc"
            : "desc";

      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (field === DEFAULT_STUDENT_SORT) next.delete("sort");
          else next.set("sort", field);
          if (nextOrder === "asc") next.set("order", "asc");
          else next.delete("order");
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setParams, sort, order],
  );

  const setPage = useCallback(
    (value: number) => {
      setParams((previous) => {
        const next = new URLSearchParams(previous);
        if (value <= 1) next.delete("page");
        else next.set("page", String(Math.floor(value)));
        return next;
      });
    },
    [setParams],
  );

  return { search, sort, order, page, setSearch, toggleSort, setPage };
}
