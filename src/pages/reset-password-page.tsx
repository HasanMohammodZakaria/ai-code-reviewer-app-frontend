import { ResetForm } from "../components/auth/reset-form";
import { AuthLayout } from "../components/layout/auth-layout";

export function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Choose a new password"
      description="Enter a new password for your account."
    >
      <ResetForm />
    </AuthLayout>
  );
}
