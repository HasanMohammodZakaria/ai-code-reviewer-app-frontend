import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import type { UpdateProfileInput } from "../../api/auth";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useUpdateProfile } from "../../hooks/queries/use-update-profile";
import {
  imageSchema,
  updateProfileSchema,
  type UpdateProfileValues,
} from "../../lib/schemas/auth";
import type { User } from "../../types/user";
import { FormError, TextField } from "../common/form-controls";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

function getInitials(fullName: string): string {
  const letters = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase());
  return letters.join("") || "?";
}

type ProfileFormProps = {
  user: User;
};

/** Change the full name and the profile image. The email is shown but cannot be changed. */
export function ProfileForm({ user }: ProfileFormProps) {
  const { mutateAsync } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: user.fullName, image: null },
  });

  const selectedImage = useWatch({ control, name: "image" });

  // Free the temporary preview URL when it is replaced or the form unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset the input so choosing the same file again still fires onChange
    event.target.value = "";
    if (!file) return;

    setSaved(false);
    const result = imageSchema.safeParse(file);
    if (!result.success) {
      setError("image", { message: result.error.issues[0]?.message });
      return;
    }

    clearErrors("image");
    setValue("image", file);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveSelection() {
    setValue("image", null);
    clearErrors("image");
    setPreview(null);
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);

    // Only send what changed
    const input: UpdateProfileInput = {};
    if (values.fullName !== user.fullName) input.fullName = values.fullName;
    if (values.image) input.image = values.image;
    if (Object.keys(input).length === 0) return;

    try {
      const updated = await mutateAsync(input);
      reset({ fullName: updated.fullName, image: null });
      setPreview(null);
      setSaved(true);
    } catch (caught) {
      const normalized = normalizeError(caught);
      let matchedField = false;

      Object.entries(getFieldErrors(normalized)).forEach(([name, message]) => {
        if (name === "fullName" || name === "image") {
          setError(name, { message });
          matchedField = true;
        }
      });

      if (!matchedField) setFormError(normalized.message);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormError message={formError} />

      <fieldset disabled={isSubmitting} className="min-w-0 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={preview ?? user.image} alt="" />
            <AvatarFallback className="text-lg">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera />
                Change photo
              </Button>
              {selectedImage ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveSelection}
                >
                  Discard new photo
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG or WebP, up to 2 MB.
            </p>
            {errors.image?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.image.message}
              </p>
            ) : null}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="sr-only"
            tabIndex={-1}
            aria-label="Profile photo"
            onChange={handleImageChange}
          />
        </div>

        <TextField
          label="Full name"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName", { onChange: () => setSaved(false) })}
        />

        <TextField
          label="Email"
          type="email"
          value={user.email}
          readOnly
          disabled
          hint="Your email address cannot be changed here."
        />
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
        {saved ? (
          <p role="status" className="text-sm text-muted-foreground">
            Profile updated.
          </p>
        ) : null}
      </div>
    </form>
  );
}
