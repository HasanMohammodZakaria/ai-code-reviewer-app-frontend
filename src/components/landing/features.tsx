import {
  FileCode2,
  FolderGit2,
  GitCompare,
  Layers,
  Lightbulb,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card } from "../ui/card";
import { LandingSection } from "./landing-section";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const FEATURES: readonly Feature[] = [
  {
    title: "Linter and AI together",
    description:
      "A linter checks JavaScript and TypeScript against rules, and an AI reviewer looks for bugs, security problems and improvements in every supported language.",
    icon: Layers,
  },
  {
    title: "Explanations and fixes",
    description:
      "Every issue shows the file and line, why it matters and a suggested fix you can copy.",
    icon: Lightbulb,
  },
  {
    title: "Score and history",
    description:
      "Each review gets a quality score from 0 to 100. Run it again as you improve the code and see the history.",
    icon: TrendingUp,
  },
  {
    title: "GitHub import",
    description:
      "Import a public GitHub repository instead of pasting. The default branch is imported, up to 20 supported files.",
    icon: FolderGit2,
  },
  {
    title: "11 languages",
    description:
      "JavaScript, TypeScript, Python, Java, Go, Ruby, PHP, C, C++, C# and Rust.",
    icon: FileCode2,
  },
  {
    title: "Class view for teachers",
    description:
      "Teachers see every student's scores and history, and can compare up to 10 students side by side.",
    icon: GitCompare,
  },
];

export function Features() {
  return (
    <LandingSection
      id="features"
      title="Everything you need to improve your code"
      description="Clear feedback you can act on, not just a list of warnings."
      tinted
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <li key={feature.title}>
              <Card className="h-full space-y-3 p-5 sm:p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ul>
    </LandingSection>
  );
}
