import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FoundersNote from "@/components/sections/get-involved/FoundersNote";
import Sponsorship from "@/components/sections/get-involved/Sponsorship";
import Volunteer from "@/components/sections/get-involved/Volunteer";
import Auditions from "@/components/sections/get-involved/Auditions";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MasterForm from "@/components/forms/MasterForm";

export const metadata: Metadata = {
  alternates: { canonical: "/get-involved" },
  title: "Get Involved",
  description:
    "Help shape HCT from the start. Join us as a sponsor, volunteer, performer, musician, or partner.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        label="Get Involved"
        title={
          <>
            The curtain hasn&apos;t risen yet.
            <br />
            Be here before it does.
          </>
        }
        subtitle="HCT is just getting started. Help shape what comes next. We need sponsors, volunteers, performers, musicians, and partners of all kinds."
        actions={[
          {
            label: "Tell Us You’re Interested",
            href: "#master-form",
            variant: "primary",
          },
          {
            label: "See Sponsor Levels",
            href: "#sponsorship",
            variant: "ghost",
          },
        ]}
        height="tall"
        glow
      />
      <FoundersNote />
      <div id="sponsorship" className="scroll-mt-20">
        <Sponsorship />
      </div>
      <Volunteer />
      <Auditions />

      <section
        id="master-form"
        className="relative bg-hct-ink py-24 md:py-32 scroll-mt-20 overflow-hidden"
      >
        <div className="absolute inset-0 glow-spotlight" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10">
          <SectionReveal className="mb-12">
            <SectionLabel>Take the First Step</SectionLabel>
            <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud">
              Tell us how you want to be part of this.
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <MasterForm />
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
