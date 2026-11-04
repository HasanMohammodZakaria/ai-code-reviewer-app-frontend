import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type {
  CreateProjectInput,
  ImportGithubInput,
  ImportGithubResponse,
  Project,
  ProjectResponse,
  UpdateProjectInput,
} from "../types/project";
import type { ProjectStats } from "../types/review";

/** Importing from GitHub can take a while, so it gets a longer timeout */
const IMPORT_TIMEOUT_MS = 60_000;

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const response = await api.post<ApiSuccess<ProjectResponse>>(
    "/projects",
    input,
  );
  return response.data.data.project;
}

export async function importGithubProject(
  input: ImportGithubInput,
): Promise<ImportGithubResponse> {
  const response = await api.post<ApiSuccess<ImportGithubResponse>>(
    "/projects/import-github",
    input,
    { timeout: IMPORT_TIMEOUT_MS },
  );
  return response.data.data;
}

export async function getProjectStats(): Promise<ProjectStats> {
  const response = await api.get<ApiSuccess<ProjectStats>>("/projects/stats");
  return response.data.data;
}

export async function getProject(id: string): Promise<Project> {
  const response = await api.get<ApiSuccess<ProjectResponse>>(
    `/projects/${id}`,
  );
  return response.data.data.project;
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
): Promise<Project> {
  const response = await api.patch<ApiSuccess<ProjectResponse>>(
    `/projects/${id}`,
    input,
  );
  return response.data.data.project;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete<ApiSuccess<null>>(`/projects/${id}`);
}
