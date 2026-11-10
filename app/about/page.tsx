import { getCmsContent } from "@/lib/cms/content";
import { ExtraSections } from "@/components/cms/ContentProvider";

import { ContentText } from "@/components/cms/ContentProvider";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FoundingStory from "@/components/sections/about/FoundingStory";
import MissionVisionValues from "@/components/sections/about/MissionVisionValues";
import Timeline from "@/components/sections/about/Timeline";
import CTASection from "@/components/sections/shared/CTASection";

export async function generateMetadata(): Promise<Metadata> { const {document,preview}=await getCmsContent(); return {...document.seo["/about"], alternates:{canonical:"/about"}, ...(preview?{robots:{index:false,follow:false}}:{})}; }

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our Story"
        title={
          <><ContentText>Hillsboro Civic Theater</ContentText><br /><ContentText>Why We Exist
          </ContentText></>
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
      <ExtraSections page="/about" />
    </>
  );
}
