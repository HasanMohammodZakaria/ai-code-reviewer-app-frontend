import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  /** Field error message; also sets aria-invalid on the input */
  error?: string;
  /** Short helper text shown under the input */
  hint?: string;
  /** Content placed inside the input, at its right edge (e.g. an icon button) */
  endSlot?: ReactNode;
  id?: string;
};

/** Label + input + hint + error. className applies to the wrapper. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, endSlot, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const describedBy =
      [hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={inputId}>{label}</Label>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={endSlot ? "pr-11" : undefined}
            {...props}
          />
          {endSlot ? (
            <div className="absolute inset-y-0 right-1 flex items-center">
              {endSlot}
            </div>
          ) : null}
        </div>
        {hint ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
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
TextField.displayName = "TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "endSlot">;

/** TextField for passwords with a show/hide toggle inside the input */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const toggleLabel = visible ? "Hide password" : "Show password";

    return (
      <TextField
        ref={ref}
        {...props}
        type={visible ? "text" : "password"}
        endSlot={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setVisible((current) => !current)}
            aria-label={toggleLabel}
            title={toggleLabel}
          >
            {visible ? <EyeOff /> : <Eye />}
          </Button>
        }
      />
    );
  },
);
PasswordField.displayName = "PasswordField";

type FormErrorProps = {
  message?: string | null;
  className?: string;
};

/** Form-level error (server message that belongs to no single field) */
export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
        className,
      )}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
