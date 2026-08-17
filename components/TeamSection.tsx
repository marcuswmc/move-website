import AccordionGallery from "@/components/AccordionGallery";
import { Grafismo } from "@/components/Grafismo";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { TeamCarousel } from "@/components/TeamCarousel";

export type Member = { name: string; specialty: string; bio: string; image: string; imageAlt: string };

export function TeamSection({ teamMembers, boardMembers }: { teamMembers: Member[]; boardMembers: Member[] }) {
  return (
    <section id="equipe" className="relative overflow-hidden bg-white py-20 md:py-28">
      <Grafismo
        src="/brand/icons/Group 4.svg"
        animate="float"
        className="pointer-events-none absolute -bottom-16 -right-14 w-48 opacity-[0.06] md:w-64"
      />

      {/* ------------------------------------------------------------- Conselho */}
      <div className="relative px-4 md:px-14">
        <div className="editorial-container">
          <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-12">
            <Reveal className="flex flex-col justify-center">
              <SectionLabel>Conselho da Move</SectionLabel>
              <h2 className="font-sans text-display-3 font-bold leading-[1.02] text-move-purple text-balance">
                Quem orienta a trajetória da Move.
              </h2>
              <p className="mt-5 leading-relaxed text-move-black/65">
                Conselheiras e conselheiros que sustentam as decisões de longo prazo da consultoria. Cada retrato abre
                ao passar o cursor — ou ao toque, no celular.
              </p>
            </Reveal>

            {boardMembers.length > 0 ? (
              <Reveal delay={0.1}>
                <AccordionGallery
                  items={boardMembers.map((member) => ({
                    image: member.image,
                    alt: member.imageAlt,
                    label: member.name,
                    sublabel: member.specialty,
                  }))}
                  // Ipê no acento e Açaí no overlay: os defaults do react-bits estão fora
                  // da paleta (ver docs/brand-guide-cores.md).
                  accentColor="#FACA77"
                  overlayColor="#54355D"
                  textColor="#FFFFFF"
                  // Numa coluna mais estreita que a largura total, um expandRatio maior
                  // mantém o painel aberto legível ao lado dos fechados.
                  expandRatio={0.6}
                  height={520}
                  radius={20}
                  defaultIndex={0}
                  // Sobe o enquadramento: os retratos são 3:4 e, nos painéis fechados, o
                  // corte pelo centro deixaria o rosto de fora. O breakpoint é o do
                  // próprio componente (521px), onde ele deixa de empilhar: nas faixas
                  // de 84px do mobile o corte precisa ser ainda mais alto.
                  className="[--ag-focus:8%] [@media(min-width:521px)]:[--ag-focus:24%]"
                />
              </Reveal>
            ) : (
              <p className="max-w-md leading-relaxed text-move-black/55">
                Composição do conselho a ser publicada em breve.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- Equipe */}
      <div className="relative mt-20 px-4 md:mt-28 md:px-14">
        <div className="editorial-container">
          <TeamCarousel
            members={teamMembers}
            eyebrow="Equipe"
            title="Quem move a Move."
            body="Consultoras e consultores que combinam rigor metodológico e escuta para atravessar o ciclo de impacto junto com cada organização."
          />
        </div>
      </div>
    </section>
  );
}
