import { useEffect, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useCreateProject } from "../../hooks/queries/use-create-project";
import { projectPath } from "../../lib/routes";
import {
  createEmptyPasteFile,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILES,
  pasteProjectSchema,
  toCreateProjectInput,
  type PasteProjectValues,
} from "../../lib/schemas/project";
import { FormError, TextField } from "../common/form-controls";
import { TextAreaField } from "../common/text-area-field";
import { Button } from "../ui/button";
import { PasteFileField } from "./paste-file-field";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

/** Server field names ("files.0.path") to form field names. null = no matching field */
function toFormField(name: string): Path<PasteProjectValues> | null {
  if (name === "title" || name === "description") return name;

  const match = /^files\.(\d+)\.(path|content|language)$/.exec(name);
  if (!match) return null;

  const position = Number(match[1]);
  const key = match[2];

  // The server's "path" is built from the name field and the language
  if (key === "path") return `files.${position}.name`;
  if (key === "content") return `files.${position}.content`;
  return `files.${position}.language`;
}

/** Create a project from pasted code: title, description and one or more files */
export function PasteProjectForm() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const [formError, setFormError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const form = useForm<PasteProjectValues>({
    resolver: zodResolver(pasteProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [createEmptyPasteFile()],
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "files" });
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

  const handleAddFile = () => {
    // A new file starts with the language of the last one
    const files = getValues("files");
    append(createEmptyPasteFile(files[files.length - 1]?.language));
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const project = await createProject.mutateAsync(
        toCreateProjectInput(values),
      );
      navigate(projectPath(project._id));
    } catch (error) {
      const normalized = normalizeError(error);
      let matchedField = false;

      Object.entries(getFieldErrors(normalized)).forEach(([name, message]) => {
        const target = toFormField(name);
        if (target) {
          setError(target, { message });
          matchedField = true;
        }
      });

      // No field to blame (for example 413 too large, 429, network): show it on top
      if (!matchedField) {
        setFormError(normalized.message);
      }
      if (normalized.status === 429) {
        setRateLimited(true);
      }
    }
  });

  // Errors about the list itself ("Add at least one file", "too large together")
  const filesError = errors.files?.root?.message ?? errors.files?.message;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <FormError message={formError} />

        <fieldset disabled={isSubmitting} className="min-w-0 space-y-6">
          <div className="space-y-4">
            <TextField
              label="Title"
              placeholder="Todo app backend"
              error={errors.title?.message}
              {...register("title")}
            />

            <TextAreaField
              label="Description (optional)"
              rows={3}
              count={description.length}
              limit={MAX_DESCRIPTION_LENGTH}
              error={errors.description?.message}
              {...register("description")}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Files</h2>
              <p className="text-sm tabular-nums text-muted-foreground">
                {fields.length} / {MAX_FILES}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Only about the first 40,000 characters of code are reviewed, so
              very large projects may have some files skipped.
            </p>

            {fields.map((field, index) => (
              <PasteFileField
                key={field.id}
                index={index}
                canRemove={fields.length > 1}
                onRemove={() => remove(index)}
              />
            ))}

            {filesError ? (
              <p role="alert" className="text-sm text-destructive">
                {filesError}
              </p>
            ) : null}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddFile}
              disabled={fields.length >= MAX_FILES}
            >
              <Plus />
              Add file
            </Button>
          </div>
        </fieldset>

        <Button type="submit" disabled={isSubmitting || rateLimited}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "Creating..." : "Create project"}
        </Button>
      </form>
    </FormProvider>
  );
}
