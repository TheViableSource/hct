"use client";
import { ContentText, CmsLink } from "@/components/cms/ContentProvider";


import { useEffect, useRef, useState } from "react";
import { CmsLink as Link } from "@/components/cms/ContentProvider";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/constants";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <CmsLink href="#main-content" className="skip-link"><ContentText>Skip to content</ContentText></CmsLink>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled || menuOpen
            ? "bg-hct-ink/95 backdrop-blur-md border-b border-hct-silver/20"
            : "bg-hct-ink/80"
        }`}
      >
        <nav aria-label="Main navigation" className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10 h-20 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Hillsboro Civic Theater home" className="font-display font-light tracking-[0.15em] sm:tracking-[0.25em] text-sm text-hct-cloud hover:text-white transition-colors py-3 max-w-[15rem] lg:max-w-none">
            <ContentText>{BRAND.wordmark}</ContentText>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.filter((link) => link.href !== "/get-involved").map((link) => (
              <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
                className={`font-body text-xs tracking-widest uppercase py-3 transition-colors ${pathname === link.href ? "text-hct-cloud underline underline-offset-8 decoration-hct-silver" : "text-hct-silver hover:text-hct-cloud"}`}>
                <ContentText>{link.label}</ContentText>
              </Link>
            ))}
            <Link href="/get-involved" aria-current={pathname === "/get-involved" ? "page" : undefined} className="font-body text-xs tracking-widest uppercase border border-hct-silver/50 text-hct-cloud hover:border-hct-silver px-5 py-3 rounded-sm transition-colors whitespace-nowrap"><ContentText>Get Involved
            </ContentText></Link>
          </div>
          <button type="button" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-haspopup="dialog" onClick={() => setMenuOpen(true)} className="lg:hidden text-hct-cloud min-h-11 min-w-11 flex items-center justify-center shrink-0">
            <Menu size={24} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* A native modal keeps keyboard focus in the menu and supports Escape. */}
      <dialog ref={dialogRef} id="mobile-menu" aria-label="Site menu" onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} className="hct-mobile-menu fixed inset-0 m-0 w-full h-full max-w-none max-h-none border-0 bg-hct-ink text-hct-cloud p-0">
        <div className="min-h-full flex flex-col">
          <div className="h-20 shrink-0 flex items-center justify-between gap-4 px-5 sm:px-6 md:px-10 border-b border-hct-silver/20">
            <p className="font-display text-lg tracking-widest"><ContentText>HCT</ContentText></p>
            <button type="button" autoFocus aria-label="Close menu" onClick={() => setMenuOpen(false)} className="min-h-11 min-w-11 flex items-center justify-center">
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={pathname === link.href ? "page" : undefined}
                className={`font-display text-3xl sm:text-4xl text-center px-4 py-3 transition-colors ${pathname === link.href ? "text-hct-cloud underline underline-offset-8 decoration-hct-silver/60" : "text-hct-silver hover:text-hct-cloud"}`}>
                <ContentText>{link.label}</ContentText>
              </Link>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  );
}
