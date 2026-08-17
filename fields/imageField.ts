import type { GroupField } from "payload";

type ImageFieldArgs = {
  name?: string;
  label?: string;
  /** Exige que exista upload OU URL externa, e que o alt esteja preenchido. */
  required?: boolean;
  description?: string;
};

/**
 * Campo de imagem em duas vias: upload para a collection `media` ou URL externa.
 *
 * O redesign ainda usa fotografia do Unsplash como placeholder (ver comentário no
 * topo de data/images.ts). Em vez de baixar dezenas de placeholders para dentro do
 * repositório, o campo aceita a URL enquanto for provisória — e o dia em que a Move
 * enviar a fotografia própria, basta subir o arquivo no admin, que o upload passa a
 * ter prioridade sobre a URL. O resolver em lib/resolveImage.ts aplica essa regra.
 */
export const imageField = ({
  name = "image",
  label,
  required = false,
  description,
}: ImageFieldArgs = {}): GroupField => ({
  name,
  type: "group",
  label,
  admin: description ? { description } : undefined,
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      label: "Imagem",
      admin: {
        description: "Tem prioridade sobre a URL externa.",
      },
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) => {
        if (!required) return true;
        const sibling = siblingData as { externalUrl?: string } | undefined;
        if (!value && !sibling?.externalUrl) {
          return "Envie uma imagem ou informe uma URL externa.";
        }
        return true;
      },
    },
    {
      name: "externalUrl",
      type: "text",
      label: "URL externa (placeholder)",
      admin: {
        description: "Usada apenas enquanto não houver upload — ex.: placeholders do Unsplash.",
        condition: (_data, siblingData) => !siblingData?.media,
      },
    },
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required,
      admin: {
        description: "Descreve a imagem para leitores de tela. Deixe vazio se for decorativa.",
      },
    },
  ],
});
