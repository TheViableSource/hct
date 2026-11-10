
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { MISSION_VALUES } from "@/lib/constants";

export default function MissionVisionValues() {
  return (
    <section className="relative bg-hct-navy py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-atmosphere opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16">
          <SectionLabel><ContentText>What Drives Us</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud"><ContentText>Mission. Vision. Values.
          </ContentText></h2>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SectionReveal>
            <div className="h-full bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver mb-5"><ContentText>Mission
              </ContentText></p>
              <p className="font-body font-light text-lg text-hct-mist leading-relaxed"><ContentText>To bring big musicals to life with local volunteers. To create shows that move people and welcome all of Hillsboro.
              </ContentText></p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="h-full bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver mb-5"><ContentText>Vision
              </ContentText></p>
              <p className="font-body font-light text-lg text-hct-mist leading-relaxed"><ContentText>A city where live theater is part of life. A place where people from all walks of life belong, create, and share the joy of a show.
              </ContentText></p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="h-full bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver mb-5"><ContentText>Values
              </ContentText></p>
              <ul className="space-y-3">
                {MISSION_VALUES.map((value) => (
                  <li
                    key={value}
                    className="font-body font-light text-base text-hct-mist leading-relaxed flex items-start gap-3"
                  >
                    <span className="text-hct-silver/50 mt-2 w-1.5 h-1.5 rounded-full bg-hct-silver/50 shrink-0" />
                    <ContentText>{value}</ContentText>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
