import { ChevronDown } from "lucide-react";
import { LandingSection } from "./landing-section";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Which languages are supported?",
    answer:
      "JavaScript, TypeScript, Python, Java, Go, Ruby, PHP, C, C++, C# and Rust. Only JavaScript and TypeScript are also checked by a linter. Other languages are reviewed by the AI only.",
  },
  {
    question: "Can I import a private GitHub repository?",
    answer:
      "No. Only public github.com repositories can be imported, from the default branch. For private code, paste it into a project instead.",
  },
  {
    question: "How long does a review take?",
    answer: "Usually between 5 and 40 seconds.",
  },
  {
    question: "Is there a limit on how much code is reviewed?",
    answer:
      "Only about the first 40,000 characters of code are reviewed. If some files do not fit, the review lists the skipped files.",
  },
  {
    question: "What happens if the AI reviewer is not available?",
    answer:
      "JavaScript and TypeScript code still gets a linter-only review, and the review says so.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. Sign up with your email and password, then add your first project.",
  },
  {
    question: "How many reviews can I run?",
    answer:
      "Up to 30 reviews and 15 GitHub imports per hour. If you reach a limit, the app tells you how long to wait.",
  },
];

export function Faq() {
  return (
    <LandingSection
      id="faq"
      title="Frequently asked questions"
      description="Short answers to the things people ask first."
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group rounded-lg border border-border bg-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-3 text-left font-medium text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p className="px-4 pb-4 text-sm text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </LandingSection>
  );
}
