
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export default function CommunityCall() {
  return (
    <section className="relative bg-hct-ink py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 texture-celestial opacity-[0.04]" />
      <div className="absolute inset-0 glow-spotlight" />
      <SectionReveal className="relative max-w-2xl mx-auto px-6 md:px-10 text-center flex flex-col items-center">
        <SectionLabel><ContentText>We&apos;re Just Getting Started</ContentText></SectionLabel>
        <h2 className="font-display font-light tracking-tight text-4xl md:text-6xl text-hct-cloud leading-tight max-w-2xl"><ContentText>Be part of something
          </ContentText><br /><ContentText>Hillsboro will remember.
        </ContentText></h2>
        <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-lg mt-8"><ContentText>We need performers, musicians, designers, builders, donors, and dreamers to help us get started. Our first curtain is still ahead. We want you here when it rises.
        </ContentText></p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <Button href="/get-involved" variant="primary"><ContentText>Get Involved
          </ContentText></Button>
          <Button href="/donate" variant="ghost"><ContentText>Support HCT
          </ContentText></Button>
        </div>
      </SectionReveal>
    </section>
  );
}
