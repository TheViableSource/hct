
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { MILESTONES } from "@/lib/constants";

export default function Timeline() {
  return (
    <section className="bg-hct-ink py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16">
          <SectionLabel><ContentText>The Road Ahead</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud"><ContentText>Building Something That Lasts
          </ContentText></h2>
        </SectionReveal>

        <div className="max-w-3xl">
          <ol className="relative border-l-2 border-hct-silver/20 ml-2">
            {MILESTONES.map((m, i) => (
              <SectionReveal as="div" key={m.phase} delay={i * 0.08}>
                <li className="relative pl-10 pb-12 last:pb-0">
                  <span
                    className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${
                      m.active
                        ? "bg-hct-silver ring-4 ring-hct-silver/20"
                        : "bg-hct-silver/40"
                    }`}
                  />
                  <h3
                    className={`font-display text-2xl mb-3 ${
                      m.active ? "text-hct-cloud" : "text-hct-mist"
                    }`}
                  >
                    <ContentText>{m.phase}</ContentText>
                  </h3>
                  <p className="font-body font-light text-base text-hct-mist/80 leading-relaxed">
                    <ContentText>{m.body}</ContentText>
                  </p>
                </li>
              </SectionReveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
