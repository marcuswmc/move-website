import { createHash } from "node:crypto";

/** O Blob monta ETags com nome de arquivo + data. O Next codifica esse valor no
 * nome do arquivo de cache; nomes editoriais longos podem exceder 255 bytes. */
export function compactMediaETag({ headers }: { headers: Headers }): Headers {
  const etag = headers.get("etag");
  if (etag && etag.length > 80) {
    headers.set("etag", `"${createHash("sha256").update(etag).digest("hex")}"`);
  }
  return headers;
}
