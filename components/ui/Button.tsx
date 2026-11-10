
import { ContentText } from "@/components/cms/ContentProvider";
import { CmsLink as Link } from "@/components/cms/ContentProvider";
import { ReactNode } from "react";
import type { ButtonVariant } from "@/lib/types";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-hct-silver text-hct-velvet hover:bg-hct-cloud px-8 py-3 transition-colors duration-300",
  ghost:
    "border border-hct-silver/40 text-hct-silver hover:border-hct-silver hover:text-hct-cloud px-8 py-3 transition-colors duration-300",
  donate:
    "bg-hct-garnet text-hct-cloud hover:bg-opacity-90 px-10 py-4 transition-all duration-300",
};

const BASE =
  "inline-flex min-h-11 max-w-full items-center justify-center text-center font-body text-sm tracking-wider uppercase leading-snug rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
};

type ActionButtonProps = CommonProps & {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
}: LinkButtonProps) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      <ContentText>{children}</ContentText>
    </Link>
  );
}

export function ActionButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      <ContentText>{children}</ContentText>
    </button>
  );
}

export default Button;
