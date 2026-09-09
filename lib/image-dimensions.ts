/** Dimensões finais explícitas impedem que logos encolham depois da decodificação.
 * Mantém a proporção e não amplia imagens que já são menores que a caixa. */
export function containImage(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}
