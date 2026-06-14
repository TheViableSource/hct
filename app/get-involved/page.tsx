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
  title: "Get Involved",
  description:
    "HCT is in its founding phase. The people who step forward now are the ones who will shape what this theater becomes. We're looking for sponsors, volunteers, performers, musicians, and partners of every kind.",
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
        subtitle="HCT is in its founding phase — and that means right now, at this moment, the people who step forward are the ones who will shape what this theater becomes. We are looking for sponsors, volunteers, performers, musicians, and partners of every kind."
        actions={[
          {
            label: "Express Your Interest",
            href: "#master-form",
            variant: "primary",
          },
          {
            label: "View Sponsorship Tiers",
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
