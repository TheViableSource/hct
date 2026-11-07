import { Plus } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { VOLUNTEER_NEEDS } from "@/lib/constants";

export default function Volunteer() {
  return (
    <section className="bg-hct-ink py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16">
          <SectionLabel>Volunteer</SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud">
            Lend your time and talent.
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 md:gap-20">
          <SectionReveal>
            <p className="font-body font-light text-lg text-hct-mist leading-relaxed">
              HCT needs help on stage and behind the scenes. Plan events, spread the word, or help in the office. You can design, take photos, or raise funds. Bring your skills or just a wish to help. We want to hear from you.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver/60 mb-2">
              Current Needs
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {VOLUNTEER_NEEDS.map((need) => (
                <li
                  key={need}
                  className="group flex items-center gap-3 py-4 border-b border-hct-silver/10 hover:border-hct-silver/40 transition-colors"
                >
                  <Plus
                    size={15}
                    strokeWidth={1.5}
                    className="text-hct-silver/50 group-hover:text-hct-silver transition-colors shrink-0"
                  />
                  <span className="font-body font-light text-base text-hct-mist group-hover:text-hct-cloud transition-colors">
                    {need}
                  </span>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
