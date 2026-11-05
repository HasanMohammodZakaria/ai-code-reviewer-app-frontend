import { useId } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Trash2 } from "lucide-react";
import {
  buildFilePath,
  isPasteLanguage,
  LANGUAGE_OPTIONS,
} from "../../lib/languages";
import {
  MAX_FILE_CONTENT_LENGTH,
  type PasteProjectValues,
} from "../../lib/schemas/project";
import { TextField } from "../common/form-controls";
import { TextAreaField } from "../common/text-area-field";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PasteFileFieldProps = {
  /** Position of this file in the form's files array */
  index: number;
  /** A project needs at least one file, so the last one cannot be removed */
  canRemove: boolean;
  onRemove: () => void;
};

/**
 * One file of the Paste code form: name (optional), language and the code.
 * Must be rendered inside the <FormProvider> of PasteProjectForm.
 */
export function PasteFileField({
  index,
  canRemove,
  onRemove,
}: PasteFileFieldProps) {
  const languageId = useId();
  const languageErrorId = `${languageId}-error`;

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PasteProjectValues>();

  const fileErrors = errors.files?.[index];

  const name = useWatch({ control, name: `files.${index}.name` });
  const language = useWatch({ control, name: `files.${index}.language` });
  const content = useWatch({ control, name: `files.${index}.content` });

  // The path that will be sent to the API, shown so nothing is a surprise
  const savedAs = buildFilePath(name ?? "", language, index);

  return (
    <section
      aria-label={`File ${index + 1}`}
      className="space-y-4 rounded-lg border border-border bg-background/40 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          File {index + 1}
        </h3>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label={`Remove file ${index + 1}`}
          >
            <Trash2 />
            Remove
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="File name (optional)"
          placeholder="main"
          autoComplete="off"
          spellCheck={false}
          hint={`Saved as ${savedAs}`}
          error={fileErrors?.name?.message}
          {...register(`files.${index}.name`)}
        />

        <div className="space-y-2">
          <Label htmlFor={languageId}>Language</Label>
          <Controller
            control={control}
            name={`files.${index}.language`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (isPasteLanguage(value)) field.onChange(value);
                }}
              >
                <SelectTrigger
                  ref={field.ref}
                  id={languageId}
                  onBlur={field.onBlur}
                  aria-invalid={fileErrors?.language ? true : undefined}
                  aria-describedby={
                    fileErrors?.language ? languageErrorId : undefined
                  }
                >
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} ({option.extension})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {fileErrors?.language ? (
            <p id={languageErrorId} className="text-sm text-destructive">
              {fileErrors.language.message}
            </p>
          ) : null}
        </div>
      </div>

      <TextAreaField
        label="Code"
        rows={12}
        wrap="off"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Paste your code here"
        textareaClassName="min-h-48 overflow-x-auto font-mono text-sm"
        count={content?.length ?? 0}
        limit={MAX_FILE_CONTENT_LENGTH}
        error={fileErrors?.content?.message}
        {...register(`files.${index}.content`)}
      />
    </section>
  );
}
