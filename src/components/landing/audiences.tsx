import { Check, Lightbulb, Users, type LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { LandingSection } from "./landing-section";

type Audience = {
  title: string;
  icon: LucideIcon;
  points: readonly string[];
  note?: string;
};

const AUDIENCES: readonly Audience[] = [
  {
    title: "For students",
    icon: Lightbulb,
    points: [
      "Paste code or import a public GitHub repository",
      "Get an explanation and a suggested fix for every issue",
      "Run the review again after each change and track your score",
    ],
  },
  {
    title: "For teachers",
    icon: Users,
    points: [
      "See every student's latest score, average and issue counts",
      "Open any student's projects and reviews, read-only",
      "Compare 2 to 10 students on one chart",
    ],
    note: "Teacher accounts are not created through sign-up.",
  },
];

export function Audiences() {
  return (
    <LandingSection
      id="who-its-for"
      title="Built for students and teachers"
      description="Students get feedback while they learn. Teachers get a clear picture of the whole class."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {AUDIENCES.map((audience) => {
          const Icon = audience.icon;

          return (
            <Card key={audience.title} className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {audience.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {audience.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              {audience.note ? (
                <p className="text-xs text-muted-foreground">{audience.note}</p>
              ) : null}
            </Card>
          );
        })}
      </div>
    </LandingSection>
  );
}
