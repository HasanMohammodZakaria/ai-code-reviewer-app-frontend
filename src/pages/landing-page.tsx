import { Audiences } from "../components/landing/audiences";
import { CtaBand } from "../components/landing/cta-band";
import { Faq } from "../components/landing/faq";
import { Features } from "../components/landing/features";
import { Hero } from "../components/landing/hero";
import { HowItWorks } from "../components/landing/how-it-works";
import { ScoreExplainer } from "../components/landing/score-explainer";

export function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Audiences />
      <ScoreExplainer />
      <Faq />
      <CtaBand />
    </>
  );
}
