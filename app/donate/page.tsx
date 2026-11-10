import { getCmsContent } from "@/lib/cms/content";
import { ExtraSections } from "@/components/cms/ContentProvider";

import { ContentText } from "@/components/cms/ContentProvider";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import WhyItMatters from "@/components/sections/donate/WhyItMatters";
import DonationTiers from "@/components/sections/donate/DonationTiers";
import OtherWays from "@/components/sections/donate/OtherWays";
import SectionReveal from "@/components/ui/SectionReveal";
import DonateForm from "@/components/forms/DonateForm";

export async function generateMetadata(): Promise<Metadata> { const {document,preview}=await getCmsContent(); return {...document.seo["/donate"], alternates:{canonical:"/donate"}, ...(preview?{robots:{index:false,follow:false}}:{})}; }

export default function DonatePage() {
  return (
    <>
      <PageHero
        label="Support HCT"
        title={
          <><ContentText>Make This Theater
            </ContentText><br /><ContentText>Possible
          </ContentText></>
        }
        subtitle="Help build a theater for Hillsboro. Your gift supports the people and work that bring each show to life. Together, we can make something special."
        actions={[{ label: "Online Giving Updates", href: "#donate-form", variant: "primary" }]}
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
            <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud mb-4"><ContentText>Online Giving Coming Soon
            </ContentText></h3>
            <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl"><ContentText>We are setting up a safe way to give. Online gifts are not available yet.
            </ContentText></p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <DonateForm />
          </SectionReveal>
        </div>
      </section>
      <ExtraSections page="/donate" />
    </>
  );
}
