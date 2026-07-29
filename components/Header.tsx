"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/data/site";
import { handleHashLinkClick } from "@/components/HashScrollSync";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const dark = scrolled || mobileOpen || pathname === "/portfolio";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        dark ? "bg-move-offwhite/85 shadow-[0_1px_0_rgba(35,3,67,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      {!dark && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
      )}

      <div className="editorial-container relative flex items-center justify-between py-4 md:py-5">
        <Link href="/" aria-label="Move Social — início" className="relative z-10 block h-8 w-24 md:h-9 md:w-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dark ? "/brand/move-logo-positivo.svg" : "/brand/move-logo-negativo.svg"}
            alt="Move Social"
            className="h-full w-full object-contain object-left"
            draggable={false}
          />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              scroll={!item.href.includes("#")}
              onClick={(e) => handleHashLinkClick(e, item.href, pathname)}
              className={`text-sm font-semibold transition-colors ${
                dark ? "text-move-black/70 hover:text-move-purple" : "text-white/85 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              dark ? "bg-move-purple text-white hover:bg-move-purple/90" : "bg-white text-move-purple hover:bg-move-yellow"
            }`}
          >
            Fale com a gente
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          className="relative z-10 flex h-9 w-9 items-center justify-center md:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-full transition-transform duration-300 ${
                dark ? "bg-move-purple" : "bg-white"
              } ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[1.5px] w-full transition-transform duration-300 ${
                dark ? "bg-move-purple" : "bg-white"
              } ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-move-purple/10 bg-move-offwhite md:hidden"
          >
            <div className="editorial-container flex flex-col gap-1 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={!item.href.includes("#")}
                  onClick={(e) => {
                    handleHashLinkClick(e, item.href, pathname);
                    setMobileOpen(false);
                  }}
                  className="py-3 text-2xl font-semibold text-move-purple"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
