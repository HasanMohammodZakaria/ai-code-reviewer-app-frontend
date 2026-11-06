import { useState } from "react";
import { cn } from "../../lib/utils";
import type { StudentInfo } from "../../types/teacher";

type StudentAvatarSize = "sm" | "md" | "lg";

type StudentAvatarProps = {
  student: Pick<StudentInfo, "fullName" | "image">;
  size?: StudentAvatarSize;
  className?: string;
};

const SIZE_CLASSES: Record<StudentAvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-9 text-sm",
  lg: "size-14 text-lg",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** The student's photo, or their initials when there is none (or it fails to load) */
export function StudentAvatar({
  student,
  size = "md",
  className,
}: StudentAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(student.image) && !failed;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {showImage ? (
        <img
          src={student.image}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(student.fullName)}</span>
      )}
    </span>
  );
}
