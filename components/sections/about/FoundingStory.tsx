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
                &ldquo;We are not trying to be Broadway. We are trying to be
                something more important — the theater that Hillsboro builds for
                itself.&rdquo;
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
                Hillsboro Civic Theater began with a question: Why doesn&apos;t a
                city like ours have a civic theater institution worthy of our
                community? The performing arts have always been one of the most
                powerful ways that people come together, feel something real, and
                leave changed.
              </p>
              <p>
                We believe large-scale musical theater — with live orchestras,
                ambitious production values, and an all-volunteer company of
                performers and crew — has the power to transform not just
                audiences, but the people who create it. Every rehearsal. Every
                costume fitted. Every note played. Every light cue called. These
                are acts of care, given freely, for something larger than any one
                person.
              </p>
              <p>
                HCT is being built deliberately and carefully. We are establishing
                the foundation — the relationships, the resources, the community —
                before the curtain ever rises. Because when it does, it will rise
                right.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
