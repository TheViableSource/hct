
import { ContentText } from "@/components/cms/ContentProvider";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/Button";
import type { ButtonConfig } from "@/lib/types";

export default function CTASection({
  heading,
  body,
  actions,
  background = "bg-hct-velvet",
}: {
  heading: string;
  body: string;
  actions: ButtonConfig[];
  background?: string;
}) {
  return (
    <section className={`${background} py-24 md:py-32`}>
      <SectionReveal className="max-w-2xl mx-auto px-6 md:px-10 text-center flex flex-col items-center">
        <h3 className="font-display font-light tracking-tight text-3xl md:text-4xl text-hct-cloud leading-tight mb-6">
          <ContentText>{heading}</ContentText>
        </h3>
        <p className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl mb-10">
          <ContentText>{body}</ContentText>
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {actions.map((a) => (
            <Button key={a.label} href={a.href} variant={a.variant}>
              <ContentText>{a.label}</ContentText>
            </Button>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
