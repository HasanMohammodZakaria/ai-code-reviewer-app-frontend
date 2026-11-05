import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importGithubProject } from "../../api/projects";
import type { NormalizedError } from "../../types/api";
import type {
  ImportGithubInput,
  ImportGithubResponse,
} from "../../types/project";
import { queryKeys } from "./keys";

/**
 * Import a public GitHub repository (POST /projects/import-github).
 * Returns { project, skipped }: skipped is the number of supported files
 * left out because of the size and count limits, so the page can show it.
 */
export function useImportGithubProject() {
  const queryClient = useQueryClient();

  return useMutation<ImportGithubResponse, NormalizedError, ImportGithubInput>({
    mutationFn: importGithubProject,
    onSuccess: ({ project }) => {
      queryClient.setQueryData(queryKeys.project(project._id), project);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.projectStats,
      });
    },
  });
}
