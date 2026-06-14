"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/constants";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Solid dark + blur once we've scrolled past the top of the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled || menuOpen
            ? "bg-hct-ink/90 backdrop-blur-md border-b border-hct-silver/10"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-light tracking-[0.3em] text-sm text-hct-cloud hover:text-white transition-colors"
          >
            {BRAND.wordmark}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body text-sm tracking-widest uppercase transition-colors ${
                    active
                      ? "text-hct-cloud"
                      : "text-hct-silver hover:text-hct-cloud"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/get-involved"
              className="font-body text-sm tracking-widest uppercase border border-hct-silver/40 text-hct-silver hover:border-hct-silver hover:text-hct-cloud px-6 py-2.5 rounded-sm transition-colors duration-300"
            >
              Get Involved
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-hct-cloud p-2 -mr-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-hct-ink/98 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={`font-display font-light text-4xl tracking-tight transition-colors ${
                    pathname === link.href
                      ? "text-hct-cloud"
                      : "text-hct-silver hover:text-hct-cloud"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
