/** What the register form hands to the login page through the router's location state */
export type RegisteredState = { registeredEmail: string };

export function createRegisteredState(email: string): RegisteredState {
  return { registeredEmail: email };
}

/** The email of a user who just registered, or null when the login page was opened normally */
export function readRegisteredEmail(state: unknown): string | null {
  if (typeof state !== "object" || state === null) return null;

  const email = (state as Partial<RegisteredState>).registeredEmail;
  return typeof email === "string" && email !== "" ? email : null;
}
