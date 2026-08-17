import Link from "next/link";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import type { Metadata } from "next";
import { getContactPage, getServices, getSiteSettings } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

/* O checkbox real fica em sr-only — segue focável pelo teclado — e o estado marcado é
   pintado no chip visível através das variantes `peer-*`. Por isso o input precisa vir
   antes do <span> dentro do <label>. O foco é desenhado aqui porque o outline global de
   globals.css cairia sobre o input invisível. */
const availabilityChip =
  "block cursor-pointer rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/75 transition peer-hover:border-white/45 peer-hover:text-white peer-checked:border-move-yellow peer-checked:bg-move-yellow peer-checked:text-move-purple peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-move-yellow";

function AvailabilityGroup({ legend, name, options }: { legend: string; name: string; options: string[] }) {
  if (options.length === 0) return null;

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-white">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option}>
            <input type="checkbox" name={name} value={option} className="peer sr-only" />
            <span className={availabilityChip}>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContactPage();

  return metadataFromSeo(meta, {
    title: "Contato | Move Social",
    description:
      "Conte onde sua organização está no ciclo de impacto. A conversa começa pela escuta.",
  });
}

export default async function ContactPage() {
  const [page, settings, deliverables] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
    getServices(),
  ]);

  const {
    steps: contactSteps,
    areas: contactAreas,
    availabilityDays,
    availabilityPeriods,
    principles,
    contracted,
    received,
  } = page;
  const { contact, metrics } = settings;

  return (
    <main className="bg-move-offwhite">
      <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-16 pt-32 text-white md:px-14 md:pb-20 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full border-[4rem] border-move-yellow/[0.14] md:-right-24 md:-top-48 md:h-[38rem] md:w-[38rem] md:border-[5.5rem]" />
          <div
            className="float-slow absolute -bottom-10 left-[8%] h-14 w-14 rounded-full bg-move-yellow/25 md:h-20 md:w-20"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        <div className="editorial-container relative z-10">
          <Reveal>
            <SectionLabel dot="yellow" light>
              Contato
            </SectionLabel>
            <h1 className="max-w-3xl font-sans text-display-1 font-medium text-white text-balance">
              Vamos conversar.
            </h1>
            <p className="mt-7 max-w-xl text-body-lg leading-relaxed text-white/75">
              Conte onde sua organização está no ciclo de impacto. A conversa começa pela escuta.
            </p>
          </Reveal>

          <Reveal
            delay={0.15}
            className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-4"
          >
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-sans text-3xl font-medium tabular-nums text-white md:text-4xl">
                  {metric.value}
                </div>
                <p className="mt-1 text-sm font-medium text-white/70">{metric.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
          <Reveal className="space-y-10">
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-eyebrow font-bold uppercase text-move-purple">E-mail</p>
                <a href={`mailto:${contact.email}`} className="text-2xl font-bold text-move-purple">
                  {contact.email}
                </a>
              </div>
              <div>
                <p className="mb-3 text-eyebrow font-bold uppercase text-move-purple">Telefone</p>
                <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="text-xl font-bold text-move-purple">
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="mb-3 text-eyebrow font-bold uppercase text-move-purple">Endereço</p>
                <p className="max-w-sm leading-relaxed text-move-black/70">{contact.address}</p>
              </div>
            </div>

            <div className="border-t border-move-line pt-8">
              <p className="mb-6 text-eyebrow font-bold uppercase text-move-purple">Como funciona o primeiro contato</p>
              <ol className="space-y-6">
                {contactSteps.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <span className="text-eyebrow font-bold text-move-purple">{step.number}</span>
                    <div>
                      <p className="font-bold text-move-purple">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-move-black/60">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="rounded-soft bg-move-purple p-6 text-white md:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-eyebrow font-bold uppercase text-move-yellow">Nome</span>
                  <input
                    className="rounded-soft border border-white/15 bg-white/10 px-4 py-3.5 text-base outline-none transition placeholder:text-white/35 focus:border-move-yellow"
                    placeholder="Seu nome"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-eyebrow font-bold uppercase text-move-yellow">E-mail</span>
                  <input
                    type="email"
                    className="rounded-soft border border-white/15 bg-white/10 px-4 py-3.5 text-base outline-none transition placeholder:text-white/35 focus:border-move-yellow"
                    placeholder="voce@organizacao.org"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-eyebrow font-bold uppercase text-move-yellow">Organização</span>
                  <input
                    className="rounded-soft border border-white/15 bg-white/10 px-4 py-3.5 text-base outline-none transition placeholder:text-white/35 focus:border-move-yellow"
                    placeholder="Nome da organização"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-eyebrow font-bold uppercase text-move-yellow">Área de atuação</span>
                  <select
                    defaultValue=""
                    className="rounded-soft border border-white/15 bg-white/10 px-4 py-3.5 text-base text-white outline-none transition focus:border-move-yellow [&>option]:text-move-black"
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {contactAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-eyebrow font-bold uppercase text-move-yellow">Serviço de interesse</span>
                  <select
                    defaultValue=""
                    className="rounded-soft border border-white/15 bg-white/10 px-4 py-3.5 text-base text-white outline-none transition focus:border-move-yellow [&>option]:text-move-black"
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {deliverables.map((service) => (
                      <option key={service.number} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>
                {(availabilityDays.length > 0 || availabilityPeriods.length > 0) && (
                  <div className="rounded-soft border border-white/15 bg-white/5 p-5 sm:col-span-2 md:p-6">
                    <p className="text-eyebrow font-bold uppercase text-move-yellow">
                      Disponibilidade para contato
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                      Opcional — marque quantas opções quiser. Sem preferência informada, respondemos no primeiro
                      horário útil.
                    </p>
                    <div className="mt-6 space-y-6">
                      <AvailabilityGroup
                        legend="Dias da semana"
                        name="disponibilidade-dias"
                        options={availabilityDays}
                      />
                      <AvailabilityGroup
                        legend="Período do dia"
                        name="disponibilidade-periodo"
                        options={availabilityPeriods}
                      />
                    </div>
                  </div>
                )}
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-eyebrow font-bold uppercase text-move-yellow">Mensagem</span>
                  <textarea
                    rows={5}
                    className="resize-none rounded-soft border border-white/15 bg-white/10 px-4 py-3.5 text-base outline-none transition placeholder:text-white/35 focus:border-move-yellow"
                    placeholder="Como podemos ampliar seu impacto?"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-7 w-fit rounded-full bg-move-yellow px-7 py-3.5 font-bold text-move-purple transition hover:bg-white"
              >
                Enviar mensagem
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-14 md:py-28">
        <div className="editorial-container">
          <Reveal>
            <SectionLabel dot="purple">Como trabalhamos</SectionLabel>
            <h2 className="max-w-2xl font-sans text-display-3 font-medium text-move-purple">
              Princípios que guiam cada conversa.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.05}>
                <article className="h-full rounded-soft border border-move-line bg-move-offwhite p-6">
                  <h3 className="text-lg font-bold text-move-purple">{principle.title}</h3>
                  <p className="mt-2 leading-relaxed text-move-black/60">{principle.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-move-offwhite px-5 py-20 md:px-14 md:py-28">
        <div className="editorial-container">
          <Reveal>
            <SectionLabel dot="purple">O que esperar da parceria</SectionLabel>
            <h2 className="max-w-2xl font-sans text-display-3 font-medium text-move-purple">
              Além do escopo contratado.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal className="h-full rounded-soft border border-move-line bg-white p-8">
              <p className="text-eyebrow font-bold uppercase text-move-purple">O que você contrata</p>
              <ul className="mt-6 space-y-4">
                {contracted.map((item) => (
                  <li key={item} className="flex items-start gap-3 leading-relaxed text-move-black/75">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-move-purple/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="h-full rounded-soft bg-move-purple p-8 text-white">
              <p className="text-eyebrow font-bold uppercase text-move-yellow">O que você recebe</p>
              <ul className="mt-6 space-y-4">
                {received.map((item) => (
                  <li key={item} className="flex items-start gap-3 leading-relaxed text-white/85">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-move-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-14 md:py-28">
        <div className="editorial-container grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <SectionLabel dot="purple">Onde estamos</SectionLabel>
            <h2 className="font-sans text-display-3 font-medium leading-[1.1] text-move-purple">
              Estamos em Pinheiros, São Paulo.
            </h2>
            <p className="mt-5 leading-relaxed text-move-black/65">
              E trabalhamos com organizações em diferentes territórios, formatos e momentos do ciclo de impacto.
            </p>
            <Link
              href="https://www.google.com/maps/search/?api=1&query=Rua+Fidalga+154+Pinheiros+Sao+Paulo"
              className="mt-6 inline-block rounded-full bg-move-purple px-6 py-3 text-sm font-bold text-white transition hover:bg-move-purple/90"
            >
              Abrir no Google Maps
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="overflow-hidden rounded-soft border border-move-line">
            <iframe
              title="Localização da Move Social — Rua Fidalga, 154, Pinheiros, São Paulo"
              src="https://www.google.com/maps?q=Rua+Fidalga+154+Pinheiros+Sao+Paulo&output=embed"
              className="aspect-[4/3] w-full grayscale-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-move-offwhite px-5 py-20 md:px-14 md:py-28">
        <div className="editorial-container">
          <MediaFrame
            src={page.heroImage.src}
            alt={page.heroImage.alt}
            aspect="aspect-[21/9]"
            caption="São Paulo — de onde a Move atua para todo o Brasil"
          />
        </div>
      </section>
    </main>
  );
}
