import { SCORE_BANDS } from "../../lib/score";
import { SEVERITY_LIST } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { Severity } from "../../types/review";
import { Card } from "../ui/card";
import { LandingSection } from "./landing-section";

/** Points taken from the score by each issue (the backend's formula) */
const POINTS: Record<Severity, number> = { high: 10, medium: 4, low: 1 };

export function ScoreExplainer() {
  return (
    <LandingSection
      id="score"
      title="How the quality score works"
      description="Every review starts at 100. Each issue takes points away. The lowest score is 0."
      tinted
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Points taken by each issue
          </h3>
          <ul className="space-y-3">
            {SEVERITY_LIST.map((info) => {
              const Icon = info.icon;

              return (
                <li
                  key={info.severity}
                  className="flex items-center justify-between gap-3"
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-medium",
                      info.textClass,
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {info.label} severity
                  </span>
                  <span className="text-sm tabular-nums text-card-foreground">
                    −{POINTS[info.severity]}{" "}
                    {POINTS[info.severity] === 1 ? "point" : "points"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-border pt-4 text-sm text-muted-foreground">
            Example: 1 high, 3 medium and 6 low issues give 100 − (10 + 12 + 6)
            = 72.
          </p>
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Score bands
          </h3>
          <ul className="space-y-3">
            {SCORE_BANDS.map((band) => (
              <li
                key={band.key}
                className="flex items-center justify-between gap-3"
              >
                <span
                  className={cn(
                    "inline-flex min-w-20 justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                    band.textClass,
                    band.softBgClass,
                    band.borderClass,
                  )}
                >
                  {band.range}
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  {band.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="border-t border-border pt-4 text-sm text-muted-foreground">
            The same bands are used everywhere in the app, always with the
            number next to the label.
          </p>
        </Card>
      </div>
    </LandingSection>
  );
}
