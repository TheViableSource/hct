import SectionReveal from "@/components/ui/SectionReveal";

export default function FoundingStory() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 md:gap-20">
          {/* Pull quote */}
          <SectionReveal>
            <div className="border-l border-hct-silver/20 pl-8">
              <p className="font-accent italic text-2xl md:text-3xl text-hct-spotlight leading-relaxed">
                &ldquo;We are not trying to be Broadway. We are trying to be something more important: the theater that Hillsboro builds for itself.&rdquo;
              </p>
            </div>
          </SectionReveal>

          {/* Prose */}
          <SectionReveal delay={0.1}>
            <h2 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud mb-8">
              Where This Began
            </h2>
            <div className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed max-w-prose">
              <p>
                Hillsboro Civic Theater began with a question: Why not build a theater that reflects our city? Live shows bring people together. They help us feel, connect, and see the world in new ways.
              </p>
              <p>
                We believe big musicals can change lives, both in the audience and on stage. Our shows bring together live orchestras, great sets, and a volunteer cast and crew. Each costume, note, and light takes care. We give that care freely to make something together.
              </p>
              <p>
                We are taking the time to build HCT with care. Before our first show, we are finding the people, funds, and tools we need. We want to be ready when the curtain rises.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
