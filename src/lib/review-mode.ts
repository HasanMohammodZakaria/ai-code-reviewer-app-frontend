import { Bot, ListChecks, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ReviewMode } from "../types/review";

export type ReviewModeInfo = {
  mode: ReviewMode;
  /** Shown next to the icon, so color is never the only signal */
  label: string;
  /** Longer text for a tooltip, and for the explanation on the review page */
  description: string;
  icon: LucideIcon;
  textClass: string;
  softBgClass: string;
  borderClass: string;
};

export const REVIEW_MODES: Record<ReviewMode, ReviewModeInfo> = {
  "ai+lint": {
    mode: "ai+lint",
    label: "AI + Linter",
    description:
      "Full review: the linter and the AI reviewer both checked the code",
    icon: ShieldCheck,
    textClass: "text-primary",
    softBgClass: "bg-primary/10",
    borderClass: "border-primary/40",
  },
  "ai-only": {
    mode: "ai-only",
    label: "AI only",
    description:
      "No linter exists for these languages, so only the AI reviewer looked at them",
    icon: Bot,
    textClass: "text-muted-foreground",
    softBgClass: "bg-muted",
    borderClass: "border-border",
  },
  "lint-only": {
    mode: "lint-only",
    label: "Linter only",
    description:
      "The AI reviewer was unavailable, so only linter findings are shown",
    icon: ListChecks,
    textClass: "text-warning",
    softBgClass: "bg-warning/10",
    borderClass: "border-warning/40",
  },
};

export function getReviewModeInfo(mode: ReviewMode): ReviewModeInfo {
  return REVIEW_MODES[mode];
}
