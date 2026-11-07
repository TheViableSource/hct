import Link from "next/link";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";

const ITEMS = [
  {
    title: "Give Goods or Services",
    body: "You can give supplies, tools, services, or skills. These gifts matter as much as money. Have something to offer? Let’s talk.",
  },
  {
    title: "Business Sponsors",
    body: "Your business can help HCT get started. Become a sponsor and be part of our story.",
  },
  {
    title: "Planned Giving",
    body: "You can leave a gift to HCT in your will or estate plan. Help keep the arts alive in Hillsboro for years to come.",
  },
];

export default function OtherWays() {
  return (
    <section className="bg-hct-ink py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16">
          <SectionLabel>Beyond Dollars</SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud">
            There are many ways to help HCT.
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ITEMS.map((item, i) => (
            <SectionReveal key={item.title} delay={i * 0.08}>
              <div className="h-full border-t border-hct-silver/20 pt-8">
                <h3 className="font-display text-2xl text-hct-cloud mb-4">
                  {item.title}
                </h3>
                <p className="font-body font-light text-base text-hct-mist leading-relaxed mb-6">
                  {item.body}
                </p>
                <Link
                  href="/get-involved"
                  className="font-body text-sm tracking-wider uppercase text-hct-silver hover:text-hct-cloud transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
