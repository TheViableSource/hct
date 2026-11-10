
import { ContentText } from "@/components/cms/ContentProvider";
import { CmsLink as Link } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { COMMUNITY_ROLES } from "@/lib/constants";

export default function RoleCards() {
  return (
    <section className="bg-hct-velvet py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionReveal className="mb-16 max-w-2xl">
          <SectionLabel><ContentText>Find Your Place</ContentText></SectionLabel>
          <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-hct-cloud mb-6"><ContentText>There&apos;s a role for everyone.
          </ContentText></h2>
          <p className="font-body font-light text-lg text-hct-mist leading-relaxed"><ContentText>Volunteers fill every role at HCT. Give your time and help build a theater for Hillsboro.
          </ContentText></p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMUNITY_ROLES.map((role, i) => (
            <SectionReveal key={role.title} delay={(i % 3) * 0.08}>
              <div className="h-full flex flex-col bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm hover:border-hct-silver/30 transition-all duration-300">
                <h3 className="font-display text-2xl text-hct-cloud mb-4">
                  <ContentText>{role.title}</ContentText>
                </h3>
                <p className="font-body font-light text-base text-hct-mist leading-relaxed flex-1">
                  <ContentText>{role.body}</ContentText>
                </p>
                <Link
                  href="/get-involved"
                  className="font-body text-sm tracking-wider uppercase text-hct-silver hover:text-hct-cloud transition-colors mt-6 inline-block"
                ><ContentText>Get Involved →
                </ContentText></Link>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
