import { ForgotForm } from "../components/auth/forgot-form";
import { AuthLayout } from "../components/layout/auth-layout";

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we will send you a link to reset it."
    >
      <ForgotForm />
    </AuthLayout>
  );
}
