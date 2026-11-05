import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../api/projects";
import type { NormalizedError } from "../../types/api";
import type { CreateProjectInput, Project } from "../../types/project";
import { queryKeys } from "./keys";

/**
 * Create a project from pasted code (POST /projects).
 * On success the stats are refreshed, so the dashboard and My projects show it,
 * and the new project (with files) is put in the cache for its detail page.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, NormalizedError, CreateProjectInput>({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.setQueryData(queryKeys.project(project._id), project);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.projectStats,
      });
    },
  });
}
