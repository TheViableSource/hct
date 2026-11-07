import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export default function WhyItMatters() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 md:gap-20 items-center">
          <SectionReveal>
            <SectionLabel>Your Impact</SectionLabel>
            <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud leading-tight mb-8">
              Every dollar builds
              <br />
              something real.
            </h2>
            <div className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl">
              <p>
                HCT is just getting started. We are planning how it will run, building local ties, and bringing volunteers together. Your help brings great theater closer to our stage.
              </p>
              <p>
                Volunteers run HCT. Your gift supports the orchestra, costumes, sets, and lights. It never pays salaries. When you give now, you help build the theater before our first show or ticket sale.
              </p>
              <p>
                Our community will help bring every show to life. From the first note to the final bow, your support makes it possible.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="relative bg-hct-ink/60 border border-hct-silver/20 rounded-sm p-10 md:p-12 bg-atmosphere text-center">
              <div className="absolute inset-0 glow-spotlight rounded-sm" />
              <div className="relative">
                <p className="font-display font-light text-7xl md:text-8xl text-hct-cloud leading-none">
                  100%
                </p>
                <p className="font-body text-sm tracking-[0.3em] uppercase text-hct-silver mt-4 mb-8">
                  Community Funded
                </p>
                <div className="w-12 h-px bg-hct-silver/40 mx-auto mb-8" />
                <p className="font-accent italic text-xl text-hct-spotlight leading-relaxed">
                  &ldquo;The people who believe in this are the reason it will
                  happen.&rdquo;
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
