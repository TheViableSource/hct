export default function DecorativeRule({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`w-12 h-px bg-hct-silver/40 mb-6 ${className}`} />;
}
