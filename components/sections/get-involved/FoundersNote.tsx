
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export default function FoundersNote() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-12 text-center flex flex-col items-center">
          <SectionLabel><ContentText>A Note From Our Founders</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-3xl md:text-5xl text-hct-cloud leading-tight"><ContentText>We&apos;re building this together. Right now. From the ground up.
          </ContentText></h2>
        </SectionReveal>

        <SectionReveal
          delay={0.1}
          className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed"
        >
          <p><ContentText>Hillsboro Civic Theater is just getting started. We don&apos;t have a venue of our own yet. We haven&apos;t cast our first show or raised our first curtain.
          </ContentText></p>
          <p><ContentText>We have a clear goal and people who care. More people are joining us because they believe this is worth building.
          </ContentText></p>
          <p><ContentText>We need founding sponsors at every level, from neighbors to local businesses. We need performers, musicians, directors, and crew for our first shows. We are building a team of volunteers and local partners to help HCT thrive for years to come.
          </ContentText></p>
          <p className="font-accent italic text-2xl text-hct-spotlight"><ContentText>There is so much ahead of us. Come help shape it.
          </ContentText></p>
        </SectionReveal>
      </div>
    </section>
  );
}
