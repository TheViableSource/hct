import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FoundingStory from "@/components/sections/about/FoundingStory";
import MissionVisionValues from "@/components/sections/about/MissionVisionValues";
import Timeline from "@/components/sections/about/Timeline";
import CTASection from "@/components/sections/shared/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hillsboro Civic Theater was founded on a belief: that this community deserves a world-class theatrical experience built by the people who live here.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our Story"
        title={
          <>
            Hillsboro Civic Theater —<br />
            Why We Exist
          </>
        }
        subtitle="HCT was founded on a simple but powerful belief: that this community deserves a world-class theatrical experience built by the people who live here."
        height="short"
      />
      <FoundingStory />
      <MissionVisionValues />
      <Timeline />
      <CTASection
        heading="Ready to help us build this?"
        body="Whether you give, volunteer, perform, or simply spread the word — every act of support makes HCT more real."
        actions={[
          { label: "Get Involved", href: "/get-involved", variant: "primary" },
          { label: "Make a Donation", href: "/donate", variant: "ghost" },
        ]}
      />
    </>
  );
}
