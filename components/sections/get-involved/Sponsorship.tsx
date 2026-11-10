
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { SPONSOR_TIERS } from "@/lib/constants";

export default function Sponsorship() {
  return (
    <section className="relative bg-hct-navy py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-atmosphere opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-12 max-w-3xl">
          <SectionLabel><ContentText>Founding Sponsors</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud mb-6"><ContentText>Be part of the beginning.
          </ContentText></h2>
          <p className="font-body font-light text-lg text-hct-mist leading-relaxed"><ContentText>Help build a future for live theater in Hillsboro. We welcome sponsors at every level. We will thank our sponsors in founding materials, our first season program, at shows, and in HCT&apos;s history.
          </ContentText></p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          {/* Desktop table */}
          <div className="hidden md:block border border-hct-silver/10 rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-hct-ink/60">
                  <th className="font-body text-xs tracking-[0.2em] uppercase text-hct-silver/70 p-5"><ContentText>Tier
                  </ContentText></th>
                  <th className="font-body text-xs tracking-[0.2em] uppercase text-hct-silver/70 p-5"><ContentText>Gift Amount
                  </ContentText></th>
                  <th className="font-body text-xs tracking-[0.2em] uppercase text-hct-silver/70 p-5"><ContentText>How We Thank You
                  </ContentText></th>
                </tr>
              </thead>
              <tbody>
                {SPONSOR_TIERS.map((tier, i) => (
                  <tr
                    key={tier.tier}
                    className={`border-t border-hct-silver/10 ${
                      i % 2 === 1 ? "bg-hct-ink/40" : "bg-hct-ink/20"
                    }`}
                  >
                    <td className="font-display text-xl text-hct-cloud p-5 align-top whitespace-nowrap">
                      <ContentText>{tier.tier}</ContentText>
                    </td>
                    <td className="font-body font-light text-hct-silver p-5 align-top whitespace-nowrap">
                      <ContentText>{tier.investment}</ContentText>
                    </td>
                    <td className="font-body font-light text-hct-mist p-5 align-top leading-relaxed">
                      <ContentText>{tier.recognition}</ContentText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden space-y-4">
            {SPONSOR_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className="bg-hct-ink/40 border border-hct-silver/10 rounded-sm p-6"
              >
                <h3 className="font-display text-xl text-hct-cloud">
                  <ContentText>{tier.tier}</ContentText>
                </h3>
                <p className="font-body font-light text-sm text-hct-silver mt-1 mb-3">
                  <ContentText>{tier.investment}</ContentText>
                </p>
                <p className="font-body font-light text-sm text-hct-mist leading-relaxed">
                  <ContentText>{tier.recognition}</ContentText>
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-12 max-w-3xl">
          <p className="font-body font-light text-lg text-hct-mist leading-relaxed mb-8"><ContentText>Businesses can give funds, goods, or services. We can build a sponsor package to fit your goals and budget.
          </ContentText></p>
          <Button href="#master-form" variant="ghost"><ContentText>Discuss a Sponsorship
          </ContentText></Button>
        </SectionReveal>
      </div>
    </section>
  );
}
