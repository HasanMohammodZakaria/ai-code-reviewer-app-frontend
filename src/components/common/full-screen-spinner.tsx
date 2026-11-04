import { Loader2 } from "lucide-react";

export function FullScreenSpinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen items-center justify-center bg-background text-muted-foreground"
    >
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}
