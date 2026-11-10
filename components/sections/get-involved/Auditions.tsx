
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export default function Auditions() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <SectionReveal>
          <SectionLabel><ContentText>Performers &amp; Musicians</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud mb-8"><ContentText>Your stage is being built.
          </ContentText></h2>
          <div className="space-y-6 font-body font-light text-lg text-hct-mist leading-relaxed">
            <p><ContentText>We are bringing our first cast and orchestra together now. Auditions and rehearsals are still ahead.
            </ContentText></p>
            <p><ContentText>Sing, act, dance, or play an instrument? Tell us you want to join our first shows. You&apos;ll be among the first to hear about auditions.
            </ContentText></p>
            <p><ContentText>All roles on stage and in the orchestra are unpaid. Everyone at HCT is a volunteer. We come for the work, the people, and the moment the lights come up.
            </ContentText></p>
            <p className="font-accent italic text-xl text-hct-spotlight"><ContentText>Audition announcements coming soon.
            </ContentText></p>
          </div>
          <div className="mt-10">
            <Button href="#master-form" variant="ghost"><ContentText>Join Our Cast or Orchestra
            </ContentText></Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
