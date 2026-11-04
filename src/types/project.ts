export type ProjectLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "ruby"
  | "php"
  | "c"
  | "cpp"
  | "csharp"
  | "rust"
  | "unknown";

export type ProjectSourceType = "paste" | "github";

export type ProjectFile = {
  path: string;
  language: ProjectLanguage;
  content: string;
};

/** Populated owner, returned by GET /projects and GET /projects/:id */
export type ProjectOwner = {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
};

export type Project = {
  _id: string;
  owner: string | ProjectOwner;
  title: string;
  description?: string;
  sourceType: ProjectSourceType;
  repoUrl?: string;
  files?: ProjectFile[];
  fileCount: number;
  createdAt: string;
  updatedAt: string;
};

/** Items of GET /projects/stats and of a student's detail */
export type ProjectWithScore = Project & {
  latestScore: number | null;
  lastReviewAt: string | null;
  reviewCount: number;
};

/** A file as sent to the API: language is optional, the server detects it */
export type ProjectFileInput = {
  path: string;
  language?: ProjectLanguage;
  content: string;
};

/** POST /projects */
export type CreateProjectInput = {
  title: string;
  description?: string;
  files: ProjectFileInput[];
};

/** POST /projects/import-github */
export type ImportGithubInput = {
  title: string;
  description?: string;
  repoUrl: string;
};

/** PATCH /projects/:id (at least one field is required) */
export type UpdateProjectInput = {
  title?: string;
  description?: string;
  files?: ProjectFileInput[];
};

/** Data of create, get one and update */
export type ProjectResponse = {
  project: Project;
};

/** Data of POST /projects/import-github */
export type ImportGithubResponse = {
  project: Project;
  skipped: number;
};
