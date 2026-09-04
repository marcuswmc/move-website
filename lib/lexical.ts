import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/** Bitmask de formatação do Lexical: negrito e itálico são os dois primeiros bits. */
const BOLD = 1;
const ITALIC = 2;

/**
 * O texto de apoio foi escrito num `textarea` e a Move marcou os destaques à mão,
 * com `<b>`/`<i>` — que saíam escapados na tela. Ao converter para rich text esses
 * marcadores viram formatação de verdade, então o conteúdo já existente aparece
 * como sempre se pretendeu, sem ninguém reeditar.
 */
const INLINE_TAG = /<(b|strong|i|em)>([\s\S]*?)<\/\1>/gi;

type TextNode = {
  type: "text";
  detail: number;
  format: number;
  mode: "normal";
  style: string;
  text: string;
  version: number;
};

function textNode(text: string, format = 0): TextNode {
  return { type: "text", detail: 0, format, mode: "normal", style: "", text, version: 1 };
}

function textNodes(paragraph: string): TextNode[] {
  const nodes: TextNode[] = [];
  let cursor = 0;

  for (const match of paragraph.matchAll(INLINE_TAG)) {
    const [full, tag, inner] = match;
    const start = match.index ?? 0;

    if (start > cursor) nodes.push(textNode(paragraph.slice(cursor, start)));
    nodes.push(textNode(inner, tag.toLowerCase() === "b" || tag.toLowerCase() === "strong" ? BOLD : ITALIC));
    cursor = start + full.length;
  }

  if (cursor < paragraph.length) nodes.push(textNode(paragraph.slice(cursor)));

  return nodes.length > 0 ? nodes : [textNode(paragraph)];
}

/**
 * Converte texto simples no estado de editor que um campo `richText` espera.
 *
 * Serve a dois casos: o seed, que parte das strings de `data/site.ts`, e a
 * compatibilidade com o que foi gravado antes de um campo virar rich text — sem
 * isso o admin tentaria abrir uma string no Lexical e quebraria. Linhas em branco
 * separam parágrafos.
 */
export function lexicalFromPlainText(text: string): SerializedEditorState {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: (paragraphs.length > 0 ? paragraphs : [""]).map((paragraph) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        textStyle: "",
        children: textNodes(paragraph),
      })),
    },
  } as unknown as SerializedEditorState;
}

/**
 * Aceita o que estiver gravado no campo e devolve sempre um estado de editor
 * válido. Um documento salvo quando o campo ainda era `textarea` continua abrindo
 * no admin e renderizando no site; no primeiro save ele já é gravado como rich
 * text de verdade e esta conversão deixa de acontecer.
 */
export function ensureLexical(value: unknown): SerializedEditorState {
  if (typeof value === "string") return lexicalFromPlainText(value);
  if (value && typeof value === "object" && "root" in value) return value as SerializedEditorState;
  return lexicalFromPlainText("");
}
