import { RegisterForm } from "../components/auth/register-form";
import { AuthLayout } from "../components/layout/auth-layout";

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Submit your code and get an AI-powered review in seconds."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
