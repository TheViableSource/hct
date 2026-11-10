import { getCmsContent } from "@/lib/cms/content";
import { ExtraSections } from "@/components/cms/ContentProvider";

import { ContentText } from "@/components/cms/ContentProvider";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import RoleCards from "@/components/sections/community/RoleCards";
import EmotionalStatement from "@/components/sections/community/EmotionalStatement";
import CommunityValues from "@/components/sections/community/CommunityValues";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CommunityForm from "@/components/forms/CommunityForm";

export async function generateMetadata(): Promise<Metadata> { const {document,preview}=await getCmsContent(); return {...document.seo["/community"], alternates:{canonical:"/community"}, ...(preview?{robots:{index:false,follow:false}}:{})}; }

export default function CommunityPage() {
  return (
    <>
      <PageHero
        label="Community"
        title={
          <><ContentText>This Theater
            </ContentText><br /><ContentText>Belongs to You
          </ContentText></>
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
            <SectionLabel><ContentText>Get Involved</ContentText></SectionLabel>
            <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud mb-4"><ContentText>Tell us about yourself.
            </ContentText></h3>
            <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl"><ContentText>We&apos;re bringing our first team together. Fill out the form
              below. We&apos;ll be in touch as our plans take shape.
            </ContentText></p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <CommunityForm />
          </SectionReveal>
        </div>
      </section>
      <ExtraSections page="/community" />
    </>
  );
}
