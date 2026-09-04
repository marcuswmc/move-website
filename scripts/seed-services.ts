import config from "@payload-config";
import { getPayload } from "payload";

import { deliverables } from "../data/site";
import type { Service } from "../payload-types";

/**
 * Reescreve título, descrição e ícone dos serviços a partir de `data/site.ts`.
 *
 * Atualiza os documentos existentes pelo campo `order` em vez de recriá-los: os ids
 * ficam de pé, e com eles qualquer vínculo já feito no admin. A ordem não é tocada.
 * `pnpm seed` faria o mesmo, mas apagando o site inteiro antes.
 *
 *   pnpm seed:services
 */

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: "services",
  limit: 100,
  pagination: false,
  draft: true,
});

const byOrder = new Map(existing.docs.map((doc) => [doc.order, doc]));

for (const [index, item] of deliverables.entries()) {
  const current = byOrder.get(index);
  const data = {
    title: item.title,
    body: item.body,
    icon: item.icon as Service["icon"],
    _status: "published" as const,
  };

  if (!current) {
    payload.logger.warn(`Serviço de ordem ${index} não existe no CMS — criando.`);
    await payload.create({
      collection: "services",
      data: { ...data, order: index },
    });
    continue;
  }

  await payload.update({ collection: "services", id: current.id, data });
  payload.logger.info(`${index + 1}. ${item.title}`);
}

payload.logger.info("Serviços atualizados.");

process.exit(0);
