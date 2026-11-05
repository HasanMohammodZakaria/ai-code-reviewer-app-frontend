import type { ReactNode } from "react";
import { useAuth } from "../../hooks/use-auth";
import { PageHeader } from "../common/page-header";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";

type SettingsSectionProps = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
};

function SettingsSection({
  id,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="space-y-6 rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6"
    >
      <div className="space-y-1">
        <h2 id={id} className="text-lg font-semibold leading-tight">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

/** The settings page body: profile for everyone, password only for accounts that have one */
export function SettingsView() {
  const { user } = useAuth();

  // The route is behind auth(), so this only guards the type
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6 sm:space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile and your password."
      />

      <SettingsSection
        id="settings-profile-title"
        title="Profile"
        description="Your name and photo are shown to your teachers and in the top bar."
      >
        {/* key: a new user object (after login as someone else) starts the form fresh */}
        <ProfileForm key={user._id} user={user} />
      </SettingsSection>

      <SettingsSection
        id="settings-password-title"
        title="Password"
        description="Changing your password logs you out on every other device."
      >
        {user.authProvider === "google" ? (
          <p className="text-sm text-muted-foreground">
            This account uses Google sign-in, so there is no password to change.
          </p>
        ) : (
          <PasswordForm />
        )}
      </SettingsSection>
    </div>
  );
}
