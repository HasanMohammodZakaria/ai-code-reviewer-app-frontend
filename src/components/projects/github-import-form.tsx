import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useImportGithubProject } from "../../hooks/queries/use-import-github-project";
import { pluralize } from "../../lib/format";
import { projectPath } from "../../lib/routes";
import {
  importGithubSchema,
  MAX_DESCRIPTION_LENGTH,
  toImportGithubInput,
  type ImportGithubValues,
} from "../../lib/schemas/project";
import type { ImportGithubResponse } from "../../types/project";
import { FormError, TextField } from "../common/form-controls";
import { TextAreaField } from "../common/text-area-field";
import { Button } from "../ui/button";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

/** Import a public GitHub repository as a new project */
export function GithubImportForm() {
  const importProject = useImportGithubProject();
  const [formError, setFormError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [result, setResult] = useState<ImportGithubResponse | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ImportGithubValues>({
    resolver: zodResolver(importGithubSchema),
    defaultValues: { title: "", description: "", repoUrl: "" },
  });

  const description = useWatch({ control, name: "description" });

  /* After a 429 the button stays disabled for a while; no auto-retry */
  useEffect(() => {
    if (!rateLimited) return;
    const timer = window.setTimeout(
      () => setRateLimited(false),
      RATE_LIMIT_COOLDOWN_MS,
    );
    return () => window.clearTimeout(timer);
  }, [rateLimited]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const response = await importProject.mutateAsync(
        toImportGithubInput(values),
      );
      setResult(response);
    } catch (error) {
      const normalized = normalizeError(error);

      // 404: the repository does not exist or is private
      if (normalized.status === 404) {
        setError("repoUrl", { message: normalized.message });
        return;
      }

      const fieldErrors = getFieldErrors(normalized);
      let matchedField = false;

      (["title", "description", "repoUrl"] as const).forEach((name) => {
        const message = fieldErrors[name];
        if (message) {
          setError(name, { message });
          matchedField = true;
        }
      });

      if (!matchedField) {
        setFormError(normalized.message);
      }
      if (normalized.status === 429) {
        setRateLimited(true);
      }
    }
  });

  const handleImportAnother = () => {
    reset();
    setResult(null);
    setFormError(null);
  };

  if (result) {
    const { project, skipped } = result;

    return (
      <div className="space-y-4">
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <CircleCheck
            className="mt-0.5 size-4 shrink-0 text-success"
            aria-hidden="true"
          />
          <p>
            Imported <span className="font-medium">{project.title}</span> with{" "}
            {pluralize(project.fileCount, "file")}.
          </p>
        </div>

        {skipped > 0 ? (
          <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground">
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-warning"
              aria-hidden="true"
            />
            <p>
              {pluralize(skipped, "supported file")}{" "}
              {skipped === 1 ? "was" : "were"} left out because of the import
              limits (20 files, 100,000 characters per file, 500 KB in total).
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link to={projectPath(project._id)}>Open project</Link>
          </Button>
          <Button type="button" variant="outline" onClick={handleImportAnother}>
            Import another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormError message={formError} />

      <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
        <TextField
          label="Title"
          placeholder="My portfolio website"
          error={errors.title?.message}
          {...register("title")}
        />

        <TextField
          label="Repository URL"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://github.com/owner/repository"
          hint="Public repositories only. The default branch is imported."
          error={errors.repoUrl?.message}
          {...register("repoUrl")}
        />

        <TextAreaField
          label="Description (optional)"
          rows={3}
          count={description.length}
          limit={MAX_DESCRIPTION_LENGTH}
          error={errors.description?.message}
          {...register("description")}
        />
      </fieldset>

      {isSubmitting ? (
        <p role="status" className="text-sm text-muted-foreground">
          Importing the repository. This can take up to a minute.
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting || rateLimited}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {isSubmitting ? "Importing..." : "Import repository"}
      </Button>
    </form>
  );
}
