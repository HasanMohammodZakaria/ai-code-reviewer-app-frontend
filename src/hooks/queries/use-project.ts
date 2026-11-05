import { useQuery } from "@tanstack/react-query";
import { getProject } from "../../api/projects";
import type { NormalizedError } from "../../types/api";
import type { Project } from "../../types/project";
import { queryKeys } from "./keys";

/**
 * One project with its files and a populated owner (GET /projects/:id).
 * Pass undefined while the id is not known yet; the query then stays idle.
 */
export function useProject(id: string | undefined) {
  return useQuery<Project, NormalizedError>({
    queryKey: queryKeys.project(id ?? ""),
    queryFn: () => getProject(id as string),
    enabled: Boolean(id),
  });
}
