import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function StayConnected() {
  return (
    <section className="bg-hct-graphite py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="max-w-3xl">
          <SectionLabel>Stay in the Loop</SectionLabel>
          <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud leading-tight mb-10">
            Be first to know when auditions open, tickets go on sale, and
            history gets made.
          </h3>
          <NewsletterForm />
        </SectionReveal>
      </div>
    </section>
  );
}
