/** The Google OAuth Client ID. Empty until it is set in .env */
export const GOOGLE_CLIENT_ID: string = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""
).trim();

/** Without a Client ID the Google button is hidden and the rest of login works as before */
export const isGoogleEnabled: boolean = GOOGLE_CLIENT_ID !== "";
