
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { COMMUNITY_VALUES } from "@/lib/constants";

export default function CommunityValues() {
  return (
    <section className="bg-hct-ink py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16">
          <SectionLabel><ContentText>Our Commitment to You</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud"><ContentText>A theater that takes care of its people.
          </ContentText></h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hct-silver/10 border border-hct-silver/10 rounded-sm overflow-hidden">
          {COMMUNITY_VALUES.map((value, i) => (
            <SectionReveal as="div" key={value.title} delay={(i % 2) * 0.08}>
              <div className="h-full bg-hct-ink p-8 md:p-10">
                <h3 className="font-display text-2xl text-hct-cloud mb-3">
                  <ContentText>{value.title}</ContentText>
                </h3>
                <p className="font-body font-light text-base text-hct-mist leading-relaxed">
                  <ContentText>{value.body}</ContentText>
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
