import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import RoleCards from "@/components/sections/community/RoleCards";
import EmotionalStatement from "@/components/sections/community/EmotionalStatement";
import CommunityValues from "@/components/sections/community/CommunityValues";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CommunityForm from "@/components/forms/CommunityForm";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The people of Hillsboro are building HCT. Find your place on stage, in the orchestra, behind the scenes, or in the audience.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHero
        label="Community"
        title={
          <>
            This Theater
            <br />
            Belongs to You
          </>
        }
        subtitle="The people of Hillsboro are building HCT for everyone to enjoy. On stage, in the orchestra, behind the scenes, or in the audience, you help bring it to life."
        height="short"
      />
      <RoleCards />
      <EmotionalStatement />
      <CommunityValues />

      <section className="bg-hct-velvet py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionReveal className="mb-12">
            <SectionLabel>Get Involved</SectionLabel>
            <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud mb-4">
              Tell us about yourself.
            </h3>
            <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl">
              We&apos;re bringing our first team together. Fill out the form
              below. We&apos;ll be in touch as our plans take shape.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <CommunityForm />
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
