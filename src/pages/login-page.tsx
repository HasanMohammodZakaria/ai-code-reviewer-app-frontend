import { LoginForm } from "../components/auth/login-form";
import { AuthLayout } from "../components/layout/auth-layout";

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to continue to AI Code Reviewer."
    >
      <LoginForm />
    </AuthLayout>
  );
}
