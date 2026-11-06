import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

/** Closing call to action, just above the footer */
export function CtaBand() {
  const { user, status } = useAuth();
  const homePath =
    status === "authenticated" && user !== null ? getHomePath(user.role) : null;

  return (
    <section aria-labelledby="cta-title">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <Card className="relative overflow-hidden px-6 py-10 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-xl space-y-4">
            <h2
              id="cta-title"
              className="text-balance text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl"
            >
              Ready to review your code?
            </h2>
            <p className="text-muted-foreground sm:text-lg">
              Create an account, add a project and get your first review.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
          </div>
        </Card>
      </div>
    </section>
  );
}
