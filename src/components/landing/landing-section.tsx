import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type LandingSectionProps = {
  /** Used for the footer links (#features, #faq...) */
  id: string;
  title: string;
  description?: string;
  /** A softly tinted band, to separate neighbouring sections */
  tinted?: boolean;
  children: ReactNode;
};

/** One landing page section: centered heading, then the content */
export function LandingSection({
  id,
  title,
  description,
  tinted = false,
  children,
}: LandingSectionProps) {
  const titleId = `${id}-title`;

  return (
    // scroll-mt-14 keeps the heading clear of the sticky header after a #link jump
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "scroll-mt-14",
        tinted && "border-y border-border bg-muted/40",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center sm:mb-12">
          <h2
            id={titleId}
            className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground sm:text-lg">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
