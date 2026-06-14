import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { DONATION_TIERS } from "@/lib/constants";

export default function DonationTiers() {
  const standard = DONATION_TIERS.filter((t) => !t.featured);
  const featured = DONATION_TIERS.find((t) => t.featured);

  return (
    <section className="relative bg-hct-navy py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-atmosphere opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16">
          <SectionLabel>Ways to Give</SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud">
            Find the level that&apos;s right for you.
          </h2>
        </SectionReveal>

        {/* Four standard tiers — balanced row of 4 on desktop, 2×2 on tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standard.map((tier, i) => (
            <SectionReveal key={tier.name} delay={(i % 4) * 0.08}>
              <div className="h-full flex flex-col bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm hover:border-hct-silver/30 transition-all duration-300">
                <h3 className="font-display text-2xl text-hct-cloud">
                  {tier.name}
                </h3>
                <p className="font-body text-sm tracking-wider text-hct-silver mt-1 mb-5">
                  {tier.amount}
                </p>
                <p className="font-body font-light text-base text-hct-mist leading-relaxed flex-1">
                  {tier.body}
                </p>
                <div className="mt-8">
                  <Button
                    href="/get-involved"
                    variant="ghost"
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Featured tier — full-width banner with a horizontal internal layout */}
        {featured && (
          <SectionReveal delay={0.1} className="mt-6">
            <div className="relative bg-hct-ink border-2 border-hct-silver/40 rounded-sm p-8 md:p-12">
              <div className="absolute inset-0 glow-spotlight rounded-sm pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                {/* Left: label, name, amount */}
                <div className="md:w-1/3 md:shrink-0">
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver mb-4">
                    {featured.featuredLabel}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl text-hct-cloud leading-tight">
                    {featured.name}
                  </h3>
                  <p className="font-body text-sm tracking-wider text-hct-silver mt-2">
                    {featured.amount}
                  </p>
                </div>

                {/* Right: body + CTA, divided from the left on desktop */}
                <div className="md:flex-1 md:border-l md:border-hct-silver/15 md:pl-12">
                  <p className="font-body font-light text-base text-hct-mist leading-relaxed mb-8">
                    {featured.body}
                  </p>
                  <Button
                    href="/get-involved"
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    {featured.cta}
                  </Button>
                </div>
              </div>
            </div>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
