import config from "@payload-config";
import { getPayload } from "payload";

import { affiliations, metrics } from "../data/site";

/**
 * Atualiza só os números do hero e os selos de afiliação.
 *
 * `pnpm seed` apaga e recarrega tudo — rodá-lo para trocar quatro linhas custaria
 * o que a Move já editou no admin. `updateGlobal` faz merge: os demais campos dos
 * dois globais (hero, destaques, contato, navegação) ficam como estão.
 *
 *   pnpm seed:stats
 */

const payload = await getPayload({ config });

await payload.updateGlobal({
  slug: "site-settings",
  data: {
    metrics: metrics.map((metric) => ({ value: metric.value, label: metric.label })),
  },
});

await payload.updateGlobal({
  slug: "home",
  data: {
    affiliations: affiliations.map((item) => ({ label: item.label })),
  },
});

payload.logger.info("Números e selos atualizados.");

process.exit(0);
