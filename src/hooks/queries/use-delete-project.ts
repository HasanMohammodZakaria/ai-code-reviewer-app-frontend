import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../api/projects";
import type { NormalizedError } from "../../types/api";
import { queryKeys } from "./keys";

/**
 * Delete a project and all of its reviews (DELETE /projects/:id). Owner only.
 * The page must ask for confirmation before calling this.
 * Variables: the project id.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<void, NormalizedError, string>({
    mutationFn: deleteProject,
    onSuccess: (_data, id) => {
      // The project and its reviews are gone: drop them, do not refetch them (that would 404)
      queryClient.removeQueries({ queryKey: queryKeys.project(id) });
      queryClient.removeQueries({ queryKey: queryKeys.projectReviews(id) });
      return queryClient.invalidateQueries({
        queryKey: queryKeys.projectStats,
      });
    },
  });
}
