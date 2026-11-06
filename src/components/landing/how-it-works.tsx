import {
  ClipboardPaste,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card } from "../ui/card";
import { LandingSection } from "./landing-section";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: readonly Step[] = [
  {
    title: "Add your code",
    description:
      "Paste code into one or more files, or import a public GitHub repository.",
    icon: ClipboardPaste,
  },
  {
    title: "Get a review",
    description:
      "A linter and an AI reviewer check your code together. A review takes about 5 to 40 seconds.",
    icon: Sparkles,
  },
  {
    title: "Improve and track",
    description:
      "Fix the issues, run the review again and watch your score change over time.",
    icon: TrendingUp,
  },
];

export function HowItWorks() {
  return (
    <LandingSection
      id="how-it-works"
      title="How it works"
      description="From code to a clear list of fixes in three steps."
    >
      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <li key={step.title}>
              <Card className="h-full space-y-3 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <Icon
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ol>
    </LandingSection>
  );
}
