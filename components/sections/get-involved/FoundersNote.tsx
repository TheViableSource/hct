import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export default function FoundersNote() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-12 text-center flex flex-col items-center">
          <SectionLabel>A Note From Our Founders</SectionLabel>
          <h2 className="font-display font-light tracking-tight text-3xl md:text-5xl text-hct-cloud leading-tight">
            We&apos;re building this together. Right now. From the ground up.
          </h2>
        </SectionReveal>

        <SectionReveal
          delay={0.1}
          className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed"
        >
          <p>
            Hillsboro Civic Theater is in its earliest chapter. We don&apos;t yet
            have a venue of our own. We haven&apos;t yet cast our first
            production. We haven&apos;t yet raised our curtain.
          </p>
          <p>
            But we have something more important right now: vision, commitment,
            and a growing community of people who believe this is worth building.
          </p>
          <p>
            We are actively seeking founding sponsors at every level — from
            individual supporters to corporate partners — who want to be part of
            this institution from its very first day. We are recruiting the
            performers, musicians, directors, and crew who will populate our stage
            and pit. We are establishing the volunteer network and community
            partnerships that will sustain HCT for decades.
          </p>
          <p className="font-accent italic text-2xl text-hct-spotlight">
            This is the moment when everything is possible. And we&apos;re inviting
            you into it.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
