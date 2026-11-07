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
              We are bringing our first cast and orchestra together now. Auditions and rehearsals are still ahead.
            </p>
            <p>
              Sing, act, dance, or play an instrument? Tell us you want to join our first shows. You&apos;ll be among the first to hear about auditions.
            </p>
            <p>
              All roles on stage and in the orchestra are unpaid. Everyone at HCT is a volunteer. We come for the work, the people, and the moment the lights come up.
            </p>
            <p className="font-accent italic text-xl text-hct-spotlight">
              Audition announcements coming soon.
            </p>
          </div>
          <div className="mt-10">
            <Button href="#master-form" variant="ghost">
              Join Our Cast or Orchestra
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
