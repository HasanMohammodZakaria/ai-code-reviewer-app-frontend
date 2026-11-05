import { useNavigate } from "react-router-dom";
import { Loader2, TriangleAlert } from "lucide-react";
import { useDeleteProject } from "../../hooks/queries/use-delete-project";
import { ROUTES } from "../../lib/routes";
import type { Project } from "../../types/project";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type DeleteProjectDialogProps = {
  project: Pick<Project, "_id" | "title">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Asks for confirmation, then deletes the project and all of its reviews
 * (the backend deletes them too). The dialog stays open while the request
 * runs and when it fails, so the error is shown right where the user clicked.
 */
export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error, reset } = useDeleteProject();

  function handleOpenChange(next: boolean) {
    // Do not let Esc or Cancel close the dialog in the middle of the request
    if (isPending) return;
    if (!next) reset();
    onOpenChange(next);
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    // The action button would close the dialog by itself: keep it open until we know the result
    event.preventDefault();
    if (isPending) return;

    try {
      await mutateAsync(project._id);
      navigate(ROUTES.projects, { replace: true });
    } catch (caught) {
      // 404: the project is already gone (for example deleted in another tab), so leave the page
      if (
        typeof caught === "object" &&
        caught !== null &&
        "status" in caught &&
        caught.status === 404
      ) {
        navigate(ROUTES.projects, { replace: true });
      }
      // Any other error is shown below from `error`, and the user can try again
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{project.title}</span>{" "}
            and all of its reviews will be deleted. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm"
          >
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <p className="min-w-0 wrap-break-word text-foreground">
              {error.status === 403
                ? "Only the owner of a project can delete it."
                : error.message}
            </p>
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : null}
            {isPending ? "Deleting..." : error ? "Try again" : "Delete project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
