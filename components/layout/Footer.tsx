import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-hct-ink border-t border-hct-silver/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {/* Mark + tagline */}
          <div>
            <p className="font-display text-3xl font-light tracking-[0.15em] text-hct-cloud mb-4">
              HCT
            </p>
            <p className="font-accent italic text-lg text-hct-silver mb-3">
              {BRAND.tagline}
            </p>
            <p className="font-body font-light text-sm text-hct-mist/70 leading-relaxed max-w-xs">
              {BRAND.mission}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver/60 mb-5">
              Explore
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body font-light text-sm text-hct-mist hover:text-hct-cloud transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + social */}
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-hct-silver/60 mb-5">
              Connect
            </p>
            <a
              href={`mailto:${BRAND.email}`}
              className="font-body font-light text-sm text-hct-mist hover:text-hct-cloud transition-colors block mb-5"
            >
              {BRAND.email}
            </a>
            <div className="flex items-center gap-4">
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-hct-silver hover:text-hct-cloud transition-colors"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-hct-silver hover:text-hct-cloud transition-colors"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hct-silver/10">
          <p className="text-xs text-hct-silver/40 font-body tracking-wide">
            © 2025 Hillsboro Civic Theater. A community nonprofit theater.
          </p>
        </div>
      </div>
    </footer>
  );
}
