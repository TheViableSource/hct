import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export default function Auditions() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <SectionReveal>
          <SectionLabel>Performers &amp; Musicians</SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud mb-8">
            Your stage is being built.
          </h2>
          <div className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed">
            <p>
              We are building our artistic community now — before auditions open,
              before rehearsals begin, before the first note is played.
            </p>
            <p>
              If you&apos;re a singer, actor, dancer, or instrumentalist who wants
              to be part of HCT&apos;s inaugural productions, register your
              interest today. You&apos;ll be among the first to hear when auditions
              are announced.
            </p>
            <p className="font-accent italic text-xl text-hct-spotlight">
              Audition announcements coming soon.
            </p>
          </div>
          <div className="mt-10">
            <Button href="#master-form" variant="ghost">
              Register Your Artistic Interest
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
