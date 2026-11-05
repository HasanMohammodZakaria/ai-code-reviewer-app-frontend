import { useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { getFieldErrors, normalizeError } from "../../api/errors";
import {
  buildFilePath,
  DEFAULT_PASTE_LANGUAGE,
  isPasteLanguage,
} from "../../lib/languages";
import {
  createEmptyPasteFile,
  descriptionSchema,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILES,
  pasteProjectSchema,
  titleSchema,
  type PasteProjectValues,
} from "../../lib/schemas/project";
import type { NormalizedError } from "../../types/api";
import type { Project, UpdateProjectInput } from "../../types/project";
import { useUpdateProject } from "../../hooks/queries/use-update-project";
import { FormError, TextField } from "../common/form-controls";
import { TextAreaField } from "../common/text-area-field";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { PasteFileField } from "./paste-file-field";

/* ---------- Shared helpers ---------- */

const metaSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});
type MetaValues = z.infer<typeof metaSchema>;

type EditFormProps = {
  project: Project;
  /** Sends the changes. Rejects with the request error, resolves after the dialog was told to close */
  onSave: (input: UpdateProjectInput) => Promise<void>;
  /** Nothing changed, or the user pressed Cancel */
  onCancel: () => void;
};

/** Only the fields that really changed are sent */
function buildMetaInput(
  project: Project,
  values: MetaValues,
): UpdateProjectInput {
  const input: UpdateProjectInput = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (title !== project.title) input.title = title;
  if (description !== (project.description ?? "")) {
    input.description = description;
  }
  return input;
}

function hasChanges(input: UpdateProjectInput): boolean {
  return Object.keys(input).length > 0;
}

function describeError(error: NormalizedError): string {
  if (error.status === 403) return "Only the owner of a project can edit it.";
  if (error.status === 404) return "This project no longer exists.";
  return error.message;
}

/** Server field names ("files.0.path") to form field names. null = no matching field */
function toPasteFormField(name: string): Path<PasteProjectValues> | null {
  if (name === "title" || name === "description") return name;

  const match = /^files\.(\d+)\.(path|content|language)$/.exec(name);
  if (!match) return null;

  const position = Number(match[1]);
  if (match[2] === "path") return `files.${position}.name`;
  if (match[2] === "content") return `files.${position}.content`;
  return `files.${position}.language`;
}

/* ---------- GitHub project: title and description only ---------- */

function EditMetaForm({ project, onSave, onCancel }: EditFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MetaValues>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      title: project.title,
      description: project.description ?? "",
    },
  });

  const description = useWatch({ control, name: "description" });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const input = buildMetaInput(project, values);
    if (!hasChanges(input)) {
      onCancel();
      return;
    }

    try {
      await onSave(input);
    } catch (caught) {
      const normalized = normalizeError(caught);
      let matchedField = false;

      Object.entries(getFieldErrors(normalized)).forEach(([name, message]) => {
        if (name === "title" || name === "description") {
          setError(name, { message });
          matchedField = true;
        }
      });

      if (!matchedField) setFormError(describeError(normalized));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormError message={formError} />

      <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
        <TextField
          label="Title"
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
      </fieldset>

      <EditFooter saving={isSubmitting} onCancel={onCancel} />
    </form>
  );
}

/* ---------- Paste project: title, description and files ---------- */

function toPasteDefaults(project: Project): PasteProjectValues {
  const files = (project.files ?? []).map((file) => ({
    // The saved path already ends with the language's extension, so
    // buildFilePath leaves it unchanged
    name: file.path,
    language: isPasteLanguage(file.language)
      ? file.language
      : DEFAULT_PASTE_LANGUAGE,
    content: file.content,
  }));

  return {
    title: project.title,
    description: project.description ?? "",
    files: files.length > 0 ? files : [createEmptyPasteFile()],
  };
}

function buildPasteInput(
  project: Project,
  values: PasteProjectValues,
): UpdateProjectInput {
  const input = buildMetaInput(project, values);

  const nextFiles = values.files.map((file, index) => ({
    path: buildFilePath(file.name, file.language, index),
    content: file.content,
  }));
  const savedFiles = project.files ?? [];

  const filesChanged =
    nextFiles.length !== savedFiles.length ||
    nextFiles.some(
      (file, index) =>
        file.path !== savedFiles[index].path ||
        file.content !== savedFiles[index].content,
    );

  // Unchanged files are not sent: new code is the only reason to touch them
  if (filesChanged) input.files = nextFiles;
  return input;
}

function EditPasteForm({ project, onSave, onCancel }: EditFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PasteProjectValues>({
    resolver: zodResolver(pasteProjectSchema),
    defaultValues: toPasteDefaults(project),
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

  const handleAddFile = () => {
    const files = getValues("files");
    append(createEmptyPasteFile(files[files.length - 1]?.language));
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const input = buildPasteInput(project, values);
    if (!hasChanges(input)) {
      onCancel();
      return;
    }

    try {
      await onSave(input);
    } catch (caught) {
      const normalized = normalizeError(caught);
      let matchedField = false;

      Object.entries(getFieldErrors(normalized)).forEach(([name, message]) => {
        const target = toPasteFormField(name);
        if (target) {
          setError(target, { message });
          matchedField = true;
        }
      });

      if (!matchedField) setFormError(describeError(normalized));
    }
  });

  const filesError = errors.files?.root?.message ?? errors.files?.message;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <FormError message={formError} />

        <fieldset disabled={isSubmitting} className="min-w-0 space-y-6">
          <div className="space-y-4">
            <TextField
              label="Title"
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
              <h3 className="text-base font-semibold text-foreground">Files</h3>
              <p className="text-sm tabular-nums text-muted-foreground">
                {fields.length} / {MAX_FILES}
              </p>
            </div>

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

        <EditFooter saving={isSubmitting} onCancel={onCancel} />
      </form>
    </FormProvider>
  );
}

function EditFooter({
  saving,
  onCancel,
}: {
  saving: boolean;
  onCancel: () => void;
}) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="animate-spin" /> : null}
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </DialogFooter>
  );
}

/* ---------- The dialog ---------- */

type EditProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Edit a project. Title and description for every project; the files too,
 * but only for paste projects (a GitHub project's files come from the repo).
 * The form lives inside the dialog content, so it starts fresh from the
 * saved project every time the dialog opens.
 */
export function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const { mutateAsync, isPending, reset } = useUpdateProject();

  function handleOpenChange(next: boolean) {
    // Never close in the middle of the request
    if (isPending) return;
    if (!next) reset();
    onOpenChange(next);
  }

  async function handleSave(input: UpdateProjectInput) {
    await mutateAsync({ id: project._id, input });
    onOpenChange(false);
  }

  const formProps: EditFormProps = {
    project,
    onSave: handleSave,
    onCancel: () => handleOpenChange(false),
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton={isPending}
        // A click outside must not throw away what was typed
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => {
          if (isPending) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            {project.sourceType === "paste"
              ? "Change the details or fix the code, then run a new review."
              : "Change the title or description. The files come from the GitHub repository and cannot be edited."}
          </DialogDescription>
        </DialogHeader>

        {project.sourceType === "paste" ? (
          <EditPasteForm {...formProps} />
        ) : (
          <EditMetaForm {...formProps} />
        )}
      </DialogContent>
    </Dialog>
  );
}
