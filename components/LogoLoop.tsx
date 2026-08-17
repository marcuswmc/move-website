import Image from "next/image";
import Link from "next/link";

type Logo = {
  name: string;
  src: string;
  href?: string;
};

type LogoLoopProps = {
  logos: readonly Logo[];
};

export function LogoLoop({ logos }: LogoLoopProps) {
  const loopedLogos = [...logos, ...logos];

  return (
    <div className="logo-loop overflow-hidden" aria-label="Organizações parceiras">
      <ul className="logo-loop-track flex w-max items-center" role="list">
        {loopedLogos.map((logo, index) => {
          const image = (
            <Image src={logo.src} alt={logo.name} width={220} height={110} className="max-h-16 w-auto max-w-full object-contain mix-blend-multiply" />
          );
          return (
            <li key={`${logo.name}-${index}`} className="flex h-24 w-48 shrink-0 items-center justify-center px-7 sm:h-28 sm:w-60" aria-hidden={index >= logos.length}>
              {logo.href ? (
                <Link href={logo.href} aria-label={logo.name} className="transition-opacity hover:opacity-70">
                  {image}
                </Link>
              ) : (
                image
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
