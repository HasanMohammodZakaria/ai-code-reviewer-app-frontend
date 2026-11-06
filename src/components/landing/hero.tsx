import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { Button } from "../ui/button";
import { ReviewPreview } from "./review-preview";

const FACTS = [
  "Paste code or import a public GitHub repository",
  "11 languages",
  "Quality score from 0 to 100",
] as const;

export function Hero() {
  const { user, status } = useAuth();
  const homePath =
    status === "authenticated" && user !== null ? getHomePath(user.role) : null;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-128 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:text-sm">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            Linter + AI code review
          </p>

          <h1
            id="hero-title"
            className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Get your code reviewed in seconds
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Submit your code and get a quality score, clear explanations and a
            suggested fix for every issue. Fix it, run the review again, and
            watch your score improve.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {homePath !== null ? (
              <Button asChild size="lg">
                <Link to={homePath}>
                  Go to your dashboard
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to={ROUTES.register}>
                    Get started
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={ROUTES.login}>Log in</Link>
                </Button>
              </>
            )}
          </div>

          <ul className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
            {FACTS.map((fact) => (
              <li key={fact} className="inline-flex items-center gap-2">
                <Check
                  className="size-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <ReviewPreview />
      </div>
    </section>
  );
}
