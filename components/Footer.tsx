"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contact, navItems } from "@/data/site";
import { FlowerGraphic } from "@/components/FlowerGraphic";
import { handleHashLinkClick } from "@/components/HashScrollSync";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="relative overflow-hidden bg-move-black px-5 py-14 text-white md:px-14">
      <FlowerGraphic className="pointer-events-none absolute -bottom-16 -right-16 w-64 opacity-[0.06] md:w-80" />

      <div className="relative mx-auto grid max-w-[1340px] gap-10 border-t border-white/15 pt-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="relative mb-7 h-9 w-28">
            <Image src="/brand/move-logo-negativo.svg" alt="Move Social" fill className="object-contain object-left" />
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-white/65">
            A Move existe para ampliar o que o impacto pode ser. De dentro do campo, com rigor analítico,
            escuta qualificada e presença.
          </p>
        </div>

        <div>
          <p className="mb-5 text-eyebrow font-bold uppercase text-move-mint">Navegação</p>
          <div className="flex flex-col gap-3 text-white/65">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                scroll={!item.href.includes("#")}
                onClick={(e) => handleHashLinkClick(e, item.href, pathname)}
                className="w-fit transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-5 text-eyebrow font-bold uppercase text-move-mint">Contato</p>
          <div className="flex flex-col gap-3 text-white/65">
            <a href={`mailto:${contact.email}`} className="w-fit transition hover:text-white">
              {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="w-fit transition hover:text-white">
              {contact.phone}
            </a>
            <span className="max-w-xs leading-relaxed">{contact.address}</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-[1340px] border-t border-white/10 pt-6 text-sm text-white/40">
        © {new Date().getFullYear()} Move Social. Gestão de impacto socioambiental.
      </div>
    </footer>
  );
}
