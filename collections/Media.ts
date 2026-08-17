import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Mídia", plural: "Mídias" },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "updatedAt"],
    group: "Configurações",
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: "media",
    // Imagens + os formatos em que uma publicação costuma circular. O sharp só gera
    // as variações de tamanho para imagens; os demais são servidos como estão.
    mimeTypes: [
      "image/*",
      "application/pdf",
      // Word
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Excel
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // PowerPoint
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      // Texto e planilhas simples
      "text/csv",
      "text/plain",
      // Pacotes
      "application/zip",
      "application/x-zip-compressed",
    ],
    imageSizes: [
      { name: "thumbnail", width: 480, height: 640, position: "centre" },
      { name: "card", width: 900 },
      { name: "hero", width: 1800 },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
    crop: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required: true,
      admin: {
        description: "Descreve a imagem para leitores de tela e para quando ela não carrega.",
      },
    },
  ],
};
