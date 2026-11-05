import { z } from "zod";
import type {
  CreateProjectInput,
  ImportGithubInput,
} from "../../types/project";
import {
  buildFilePath,
  DEFAULT_PASTE_LANGUAGE,
  isPasteLanguage,
  type PasteLanguage,
} from "../languages";

/* ---------- Limits (backend brief, section 9) ---------- */

export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_FILES = 20;
export const MAX_FILE_CONTENT_LENGTH = 100_000;
/** The path gets an extension added, so the typed name is kept shorter than the 200 the API allows */
export const MAX_FILE_NAME_LENGTH = 150;
/** The API body limit is 3 MB. Content is counted in bytes, with room left for the JSON around it */
export const MAX_TOTAL_CONTENT_BYTES = 2_900_000;

const GITHUB_REPO_PATTERN =
  /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/i;

/* ---------- Shared fields ---------- */

export const titleSchema = z
  .string()
  .trim()
  .min(2, "Title must be at least 2 characters")
  .max(
    MAX_TITLE_LENGTH,
    `Title must be at most ${MAX_TITLE_LENGTH} characters`,
  );

/** Always a string in the form; an empty one is simply not sent */
export const descriptionSchema = z
  .string()
  .trim()
  .max(
    MAX_DESCRIPTION_LENGTH,
    `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
  );

/* ---------- Paste code ---------- */

export const pasteFileSchema = z.object({
  /** Optional: an empty name becomes main.py, file-2.py... (see buildFilePath) */
  name: z
    .string()
    .trim()
    .max(
      MAX_FILE_NAME_LENGTH,
      `File name must be at most ${MAX_FILE_NAME_LENGTH} characters`,
    ),
  language: z.custom<PasteLanguage>(
    (value) => typeof value === "string" && isPasteLanguage(value),
    "Choose a language",
  ),
  content: z
    .string()
    .min(1, "Code is required")
    .max(
      MAX_FILE_CONTENT_LENGTH,
      `Code must be at most ${MAX_FILE_CONTENT_LENGTH.toLocaleString("en-US")} characters`,
    )
    .refine((value) => value.trim().length > 0, "Code is required"),
});
export type PasteFileValues = z.infer<typeof pasteFileSchema>;

const encoder = new TextEncoder();

function totalBytes(files: readonly { content: string }[]): number {
  return files.reduce(
    (sum, file) => sum + encoder.encode(file.content).length,
    0,
  );
}

export const pasteProjectSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    files: z
      .array(pasteFileSchema)
      .min(1, "Add at least one file")
      .max(MAX_FILES, `A project can have at most ${MAX_FILES} files`),
  })
  .superRefine((values, context) => {
    // Two files must not end up with the same path
    const seen = new Set<string>();
    values.files.forEach((file, index) => {
      const path = buildFilePath(file.name, file.language, index).toLowerCase();
      if (seen.has(path)) {
        context.addIssue({
          code: "custom",
          path: ["files", index, "name"],
          message: "Two files have the same name",
        });
      }
      seen.add(path);
    });

    if (totalBytes(values.files) > MAX_TOTAL_CONTENT_BYTES) {
      context.addIssue({
        code: "custom",
        path: ["files"],
        message: "The files are too large together. Remove some code or a file",
      });
    }
  });
export type PasteProjectValues = z.infer<typeof pasteProjectSchema>;

/** A new, empty file row for the form */
export function createEmptyPasteFile(
  language: PasteLanguage = DEFAULT_PASTE_LANGUAGE,
): PasteFileValues {
  return { name: "", language, content: "" };
}

/* ---------- GitHub import ---------- */

export const importGithubSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  repoUrl: z
    .string()
    .trim()
    .min(1, "Repository URL is required")
    .regex(
      GITHUB_REPO_PATTERN,
      "Use a link like https://github.com/owner/repository",
    ),
});
export type ImportGithubValues = z.infer<typeof importGithubSchema>;

/* ---------- Form values to API input ---------- */

/** Drops trailing slashes: "https://github.com/a/b/" becomes "https://github.com/a/b" */
export function normalizeRepoUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function toCreateProjectInput(
  values: PasteProjectValues,
): CreateProjectInput {
  const description = values.description.trim();

  return {
    title: values.title.trim(),
    ...(description ? { description } : {}),
    files: values.files.map((file, index) => ({
      path: buildFilePath(file.name, file.language, index),
      content: file.content,
    })),
  };
}

export function toImportGithubInput(
  values: ImportGithubValues,
): ImportGithubInput {
  const description = values.description.trim();

  return {
    title: values.title.trim(),
    ...(description ? { description } : {}),
    repoUrl: normalizeRepoUrl(values.repoUrl),
  };
}
