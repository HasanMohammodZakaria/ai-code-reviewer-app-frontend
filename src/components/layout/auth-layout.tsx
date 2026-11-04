import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { ThemeToggle } from "./theme-toggle";

type AuthLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to={ROUTES.login}
          className="rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <span className="text-primary">AI</span> Code Reviewer
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {title}
            </h1>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}
