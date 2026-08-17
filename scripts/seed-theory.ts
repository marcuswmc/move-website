import config from "@payload-config";
import { getPayload } from "payload";

import { theoryOfChange, theoryPdf } from "../data/site";

/**
 * Carrega apenas o global da Teoria da Mudança.
 *
 * `pnpm seed` apaga e recarrega o conteúdo inteiro, então rodá-lo só para preencher
 * esta página custaria tudo o que a Move já editou no admin. Este script escreve um
 * global só — os demais documentos ficam intactos.
 *
 *   pnpm seed:theory
 */

const payload = await getPayload({ config });

await payload.updateGlobal({
  slug: "theory-of-change",
  data: {
    hero: theoryOfChange.hero,
    frontsIntro: theoryOfChange.fronts.intro,
    fronts: theoryOfChange.fronts.items,
    activitiesIntro: theoryOfChange.activitiesIntro,
    audiencesIntro: theoryOfChange.audiences.intro,
    audiences: theoryOfChange.audiences.items,
    deliverablesIntro: theoryOfChange.deliverables.intro,
    deliverables: theoryOfChange.deliverables.items.map((label) => ({ label })),
    outcomesIntro: theoryOfChange.outcomes.intro,
    outcomes: theoryOfChange.outcomes.items.map((label) => ({ label })),
    impact: theoryOfChange.impact,
    pdf: {
      label: theoryPdf.label,
      href: theoryPdf.href,
    },
  },
});

payload.logger.info("Teoria da Mudança carregada.");

process.exit(0);
