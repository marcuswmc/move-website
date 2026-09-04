import config from "@payload-config";
import { getPayload } from "payload";

import { contactAvailabilityDays, contactAvailabilityPeriods, contactServiceOptions } from "../data/site";

/**
 * Reescreve as listas do formulário de contato a partir de `data/site.ts`.
 *
 * Toca só os três campos do formulário — serviços de interesse, dias e períodos de
 * disponibilidade. Etapas, princípios, imagem e as listas de contratação ficam como
 * estão no admin. `pnpm seed` faria o mesmo, mas apagando o site inteiro antes.
 *
 *   pnpm seed:contact
 */

const payload = await getPayload({ config });

await payload.updateGlobal({
  slug: "contact-page",
  data: {
    serviceOptions: contactServiceOptions.map((label) => ({ label })),
    availabilityDays: contactAvailabilityDays.map((label) => ({ label })),
    availabilityPeriods: contactAvailabilityPeriods.map((label) => ({ label })),
  },
});

payload.logger.info(`Serviços de interesse: ${contactServiceOptions.join(", ")}`);
payload.logger.info(`Dias: ${contactAvailabilityDays.join(", ")}`);
payload.logger.info(`Períodos: ${contactAvailabilityPeriods.join(", ")}`);
payload.logger.info("Formulário de contato atualizado.");

process.exit(0);
