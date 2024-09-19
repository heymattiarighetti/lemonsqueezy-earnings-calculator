import PaymentsCalculator from "@/components/PaymentsCalculator";
import { landingPageDescription } from "@/config";
import Hero from "@/sections/hero";

export default function Home() {
  return (
    <>
      <Hero headline={landingPageDescription} description="Stop guessing." />
      <PaymentsCalculator />
    </>
  );
}
