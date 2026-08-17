"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { handleHashLinkClick } from "@/components/HashScrollSync";
import { InstagramIcon, LinkedInIcon } from "@/components/SocialIcons";

export type NavItem = { label: string; href: string };
export type SocialLink = { name: "Instagram" | "LinkedIn"; href: string };

/** O conjunto fechado espelha o de `SocialLink` — uma rede nova entra nos dois lugares. */
const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
} as const;

export function Header({ navItems, social = [] }: { navItems: NavItem[]; social?: SocialLink[] }) {
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

  // Contato tem lugar próprio como CTA à direita, então sai da lista de links.
  const primaryNav = navItems.filter((item) => item.href !== "/contato");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        dark ? "bg-move-offwhite/85 shadow-[0_1px_0_rgba(84,53,93,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      {!dark && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
      )}

      {/* Só no mobile o header ganha calha, para alinhar o logo com a primeira coluna
          do conteúdo — a seção tem `px-4` e o header não tinha nenhum, então o logo
          começava 20px à esquerda do texto. Vai num wrapper por fora do
          `.editorial-container`, como nas seções, e não no <header>, que estreitaria
          junto o fundo do painel mobile. No desktop fica `px-0`, preservando o
          enquadramento que já existia. */}
      <div className="px-4 md:px-0">
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

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {primaryNav.map((item) => (
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
          {social.length > 0 && (
            <>
              {/* Filete separando navegação de redes: sem ele os ícones leem como mais
                  um item do menu, e não como um bloco à parte. Irmão direto do nav, e
                  não interno ao grupo, para receber o mesmo respiro dos dois lados. */}
              <span
                aria-hidden="true"
                className={`h-4 w-px ${dark ? "bg-move-purple/20" : "bg-white/25"}`}
              />
              <div className="-mx-2 flex items-center gap-1">
                {social.map((item) => {
                  const Icon = SOCIAL_ICONS[item.name];
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Move Social no ${item.name}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        dark
                          ? "text-move-black/70 hover:bg-move-purple/[0.07] hover:text-move-purple"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </>
          )}

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
          className="relative z-10 flex h-9 w-9 items-center justify-center lg:hidden"
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
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-move-purple/10 bg-move-offwhite lg:hidden"
          >
            <div className="px-4 md:px-0">
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

              {social.length > 0 && (
                <div className="mt-4 flex items-center gap-2 border-t border-move-purple/10 pt-5">
                  {social.map((item) => {
                    const Icon = SOCIAL_ICONS[item.name];
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Move Social no ${item.name}`}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-move-purple/15 text-move-purple transition-colors hover:bg-move-purple hover:text-white"
                      >
                        <Icon size={19} />
                      </a>
                    );
                  })}
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
