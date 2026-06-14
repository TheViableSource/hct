import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import WhyItMatters from "@/components/sections/donate/WhyItMatters";
import DonationTiers from "@/components/sections/donate/DonationTiers";
import OtherWays from "@/components/sections/donate/OtherWays";
import SectionReveal from "@/components/ui/SectionReveal";
import DonateForm from "@/components/forms/DonateForm";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Hillsboro Civic Theater. Founding donors are investing in the institution itself — before the first curtain rises. Your support makes every production possible.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        label="Support HCT"
        title={
          <>
            Make This Theater
            <br />
            Possible
          </>
        }
        subtitle="Hillsboro Civic Theater is a community institution being built from love, vision, and the generosity of people who believe this city deserves something extraordinary. Your support makes every production possible."
        actions={[{ label: "Donate Now", href: "#donate-form", variant: "primary" }]}
        height="tall"
        glow
        caption="Hillsboro Civic Theater is a 501(c)(3) nonprofit organization. All donations are tax-deductible."
      />
      <WhyItMatters />
      <DonationTiers />
      <OtherWays />

      <section id="donate-form" className="bg-hct-velvet py-24 md:py-32 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionReveal className="mb-12">
            <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud mb-4">
              Ready to give?
            </h3>
            <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl">
              Your donation goes directly to building HCT&apos;s founding
              capacity.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <DonateForm />
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
