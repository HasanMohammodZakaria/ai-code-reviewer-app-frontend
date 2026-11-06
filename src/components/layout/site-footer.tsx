import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";

const linkClass =
  "rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

/** Links to the sections of the landing page */
const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Score", href: "#score" },
  { label: "FAQ", href: "#faq" },
] as const;

export function SiteFooter() {
  const { user, status } = useAuth();
  const homePath =
    status === "authenticated" && user !== null ? getHomePath(user.role) : null;

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm space-y-3 sm:col-span-2 lg:col-span-1">
            <Link
              to={ROUTES.landing}
              className="rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="text-primary">AI</span> Code Reviewer
            </Link>
            <p className="text-sm text-muted-foreground">
              Automated code reviews that combine a linter and an AI reviewer,
              with a quality score you can track. Built for students and
              teachers.
            </p>
          </div>

          <nav aria-label="Product" className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Product</h2>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account" className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Account</h2>
            <ul className="space-y-2">
              {homePath !== null ? (
                <>
                  <li>
                    <Link to={homePath} className={linkClass}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.settings} className={linkClass}>
                      Settings
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to={ROUTES.login} className={linkClass}>
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.register} className={linkClass}>
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Code Reviewer
        </div>
      </div>
    </footer>
  );
}
