import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID, isGoogleEnabled } from "../../lib/google";

/** Loads Google's sign-in script, but only when a Client ID is set */
export function GoogleProvider({ children }: { children: ReactNode }) {
  if (!isGoogleEnabled) return <>{children}</>;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
