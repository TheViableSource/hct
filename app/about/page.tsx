import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FoundingStory from "@/components/sections/about/FoundingStory";
import MissionVisionValues from "@/components/sections/about/MissionVisionValues";
import Timeline from "@/components/sections/about/Timeline";
import CTASection from "@/components/sections/shared/CTASection";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Hillsboro deserves great live theater. Meet the local volunteers building HCT and learn what we hope to bring to the stage.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our Story"
        title={
          <>
            Hillsboro Civic Theater<br />
            Why We Exist
          </>
        }
        subtitle="We believe Hillsboro deserves great live theater. HCT is built and run by the volunteers who call this place home."
        height="short"
      />
      <FoundingStory />
      <MissionVisionValues />
      <Timeline />
      <CTASection
        heading="Ready to help us build this?"
        body="Give, volunteer, perform, or spread the word. Every bit of help brings HCT closer to the stage."
        actions={[
          { label: "Get Involved", href: "/get-involved", variant: "primary" },
          { label: "Make a Donation", href: "/donate", variant: "ghost" },
        ]}
      />
    </>
  );
}
