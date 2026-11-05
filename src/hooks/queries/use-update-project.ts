import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../api/projects";
import type { NormalizedError } from "../../types/api";
import type { Project, UpdateProjectInput } from "../../types/project";
import { queryKeys } from "./keys";

type UpdateProjectVariables = {
  id: string;
  input: UpdateProjectInput;
};

/**
 * Edit a project (PATCH /projects/:id). Owner only.
 * title and description work for every project; files only for paste projects
 * (decision 10), so the edit form never sends files for a GitHub project.
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, NormalizedError, UpdateProjectVariables>({
    mutationFn: ({ id, input }) => updateProject(id, input),
    onSuccess: (project, { id }) => {
      queryClient.setQueryData(queryKeys.project(id), project);
      // The list shows the title, and the latest score may belong to old code
      return queryClient.invalidateQueries({
        queryKey: queryKeys.projectStats,
      });
    },
  });
}
