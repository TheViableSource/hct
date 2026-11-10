
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import PillarIcon from "@/components/ui/PillarIcons";
import { PILLARS } from "@/lib/constants";

export default function Pillars() {
  return (
    <section className="relative bg-hct-navy py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-atmosphere opacity-60" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="text-center mb-16 flex flex-col items-center">
          <SectionLabel><ContentText>What We Stand For</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud"><ContentText>Built on Three Promises
          </ContentText></h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <SectionReveal key={pillar.title} delay={i * 0.1}>
              <div className="h-full bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm hover:border-hct-silver/30 transition-colors duration-300">
                <div className="mb-6">
                  <PillarIcon icon={pillar.icon} />
                </div>
                <h3 className="font-display font-normal text-2xl text-hct-cloud mb-4">
                  <ContentText>{pillar.title}</ContentText>
                </h3>
                <p className="font-body font-light text-base text-hct-mist leading-relaxed">
                  <ContentText>{pillar.body}</ContentText>
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
