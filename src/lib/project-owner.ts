import type { Project, ProjectOwner } from "../types/project";
import type { User } from "../types/user";

/**
 * `project.owner` is a plain id string right after create or import, and a
 * populated object ({ _id, fullName, email, image? }) from GET /projects/:id.
 * These helpers accept both, so no component has to check the type itself.
 */

/** The owner's id, whichever shape `owner` has */
export function getOwnerId(project: Pick<Project, "owner">): string {
  return typeof project.owner === "string" ? project.owner : project.owner._id;
}

/** The populated owner, or null when only the id is known */
export function getOwnerInfo(
  project: Pick<Project, "owner">,
): ProjectOwner | null {
  return typeof project.owner === "string" ? null : project.owner;
}

/**
 * True when the logged-in user owns the project. Only the owner may run a
 * review, edit or delete. A teacher who is not the owner gets false, so those
 * buttons are hidden up front (the server still answers 403 or 404).
 */
export function isProjectOwner(
  project: Pick<Project, "owner">,
  user: Pick<User, "_id"> | null | undefined,
): boolean {
  return Boolean(user) && getOwnerId(project) === user?._id;
}
