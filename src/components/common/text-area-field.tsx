import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { formatNumber } from "../../lib/format";
import { cn } from "../../lib/utils";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextAreaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> & {
  label: string;
  /** Field error message; also sets aria-invalid on the textarea */
  error?: string;
  /** Short helper text shown under the textarea */
  hint?: string;
  /** Current length and limit. Shows "120 / 1,000" and turns red above the limit */
  count?: number;
  limit?: number;
  id?: string;
  /** Extra classes for the textarea itself, e.g. "font-mono". className styles the wrapper */
  textareaClassName?: string;
};

/** Label + textarea + hint + character count + error */
export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(
  (
    {
      label,
      error,
      hint,
      count,
      limit,
      id,
      className,
      textareaClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;

    const describedBy =
      [hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const showCount = count !== undefined && limit !== undefined;
    const overLimit = showCount && count > limit;

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={fieldId}>{label}</Label>
        <Textarea
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={textareaClassName}
          {...props}
        />
        {hint || showCount ? (
          <div className="flex items-start justify-between gap-3 text-xs text-muted-foreground">
            {hint ? <p id={hintId}>{hint}</p> : <span />}
            {showCount ? (
              <p
                className={cn(
                  "shrink-0 tabular-nums",
                  overLimit && "font-medium text-destructive",
                )}
              >
                {formatNumber(count)} / {formatNumber(limit)}
              </p>
            ) : null}
          </div>
        ) : null}
        {error ? (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
TextAreaField.displayName = "TextAreaField";
