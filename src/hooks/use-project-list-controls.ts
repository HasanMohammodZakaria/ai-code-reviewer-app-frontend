import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_PROJECT_SORT,
  isProjectSort,
  type ProjectSort,
} from "../lib/project-list";

const SEARCH_PARAM = "q";
const SORT_PARAM = "sort";
const PAGE_PARAM = "page";

function parsePage(value: string | null): number {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page >= 1 ? page : 1;
}

/**
 * Search, sort and page of the My projects list, kept in the URL
 * (?q=api&sort=score-desc&page=2), so a reload or the Back button keeps them.
 * Default values are left out of the URL to keep it short.
 */
export function useProjectListControls() {
  const [params, setParams] = useSearchParams();

  const search = params.get(SEARCH_PARAM) ?? "";
  const sortParam = params.get(SORT_PARAM);
  const sort: ProjectSort =
    sortParam !== null && isProjectSort(sortParam)
      ? sortParam
      : DEFAULT_PROJECT_SORT;
  const page = parsePage(params.get(PAGE_PARAM));

  const setSearch = useCallback(
    (value: string) => {
      // replace: typing must not fill the Back history with one entry per key
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value.trim() === "") next.delete(SEARCH_PARAM);
          else next.set(SEARCH_PARAM, value);
          next.delete(PAGE_PARAM);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setSort = useCallback(
    (value: ProjectSort) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value === DEFAULT_PROJECT_SORT) next.delete(SORT_PARAM);
          else next.set(SORT_PARAM, value);
          next.delete(PAGE_PARAM);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setPage = useCallback(
    (value: number) => {
      setParams((previous) => {
        const next = new URLSearchParams(previous);
        if (value <= 1) next.delete(PAGE_PARAM);
        else next.set(PAGE_PARAM, String(Math.floor(value)));
        return next;
      });
    },
    [setParams],
  );

  const reset = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  const hasFilters = search.trim() !== "" || sort !== DEFAULT_PROJECT_SORT;

  return { search, sort, page, setSearch, setSort, setPage, reset, hasFilters };
}
