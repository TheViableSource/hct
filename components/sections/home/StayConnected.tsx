
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function StayConnected() {
  return (
    <section className="bg-hct-graphite py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="max-w-3xl">
          <SectionLabel><ContentText>Stay in the Loop</ContentText></SectionLabel>
          <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud leading-tight mb-10"><ContentText>Get the first news about auditions, tickets, and what comes next.
          </ContentText></h3>
          <NewsletterForm />
        </SectionReveal>
      </div>
    </section>
  );
}
