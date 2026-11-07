import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Vision() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Prose */}
          <SectionReveal>
            <SectionLabel>Our Vision</SectionLabel>
            <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud leading-tight mb-8">
              Big dreams on stage.
              <br />
              Built by volunteers.
            </h2>
            <div className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl">
              <p>
                Local volunteers are building Hillsboro Civic Theater from the ground up. We love live shows and want to bring something special to our city. Our musicals have a full live orchestra. We want every show to stay with you long after the lights go down.
              </p>
              <p>
                Every performer, musician, and crew member gives their time for free. We bring our skills, care, and love of theater to each show.
              </p>
            </div>
          </SectionReveal>

          {/* Atmospheric pull-quote card */}
          <SectionReveal delay={0.1}>
            <div className="relative bg-hct-ink/60 border border-hct-silver/20 rounded-sm p-10 md:p-12 bg-atmosphere">
              <div className="absolute inset-0 glow-spotlight rounded-sm" />
              <div className="relative">
                <p className="font-accent italic text-2xl md:text-3xl text-hct-spotlight leading-relaxed">
                  &ldquo;The kind of theater that stops time and reminds you what it feels like to be alive.&rdquo;
                </p>
                <div className="w-12 h-px bg-hct-silver/40 my-8" />
                <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver/60">
                  Founding Vision · 2025
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
