import SectionReveal from "@/components/ui/SectionReveal";

export default function EmotionalStatement() {
  return (
    <section className="relative bg-hct-navy py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 glow-spotlight" />
      <div className="absolute inset-0 texture-celestial opacity-[0.04]" />
      <SectionReveal className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">
        <h2 className="font-display font-light tracking-tight text-3xl md:text-5xl text-hct-cloud leading-tight">
          &ldquo;We&apos;ve all felt it — that moment when the lights go down and
          the music begins.&rdquo;
        </h2>
        <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl mx-auto mt-8">
          HCT exists for that moment. And for every person who has ever wanted to
          be part of creating it.
        </p>
      </SectionReveal>
    </section>
  );
}
