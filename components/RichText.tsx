import { RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * Corpo de texto longo vindo do editor do Payload.
 *
 * A tipografia é aplicada aqui, no contêiner, e não por conversor customizado: o
 * editor entrega parágrafos, títulos e listas normais, e o `prose-*` do arquivo de
 * estilos os alcança por seletor de descendente. Assim o que a Move escreve no admin
 * sai com a mesma medida de leitura e a mesma escala do resto do site.
 */
export function RichText({ data, className = "" }: { data: SerializedEditorState; className?: string }) {
  return (
    <div className={`editorial-prose ${className}`}>
      <LexicalRichText data={data} />
    </div>
  );
}
