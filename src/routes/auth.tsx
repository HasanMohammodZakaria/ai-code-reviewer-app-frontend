import { AuthGuard } from "../components/auth/auth-guard";
import { GuestGuard } from "../components/auth/guest-guard";
import type { UserRole } from "../types/user";

type AuthOptions = {
  /** Only this role may enter. Without it, any logged-in user may enter. */
  role?: UserRole;
};

/**
 * Route guard factory. Called as auth(), never referenced directly.
 *   auth()                    any logged-in user
 *   auth({ role: "teacher" }) teachers only
 * Use the result as a layout route element; the child routes render inside it.
 */
export function auth(options: AuthOptions = {}) {
  return <AuthGuard role={options.role} />;
}

/** For login, register, forgot and reset pages: logged-in users go to their home */
export function guest() {
  return <GuestGuard />;
}
