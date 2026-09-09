/** Supports the old scalar fields while the multiple-value fields are rolled out. */
export function taxonomyValues(values: string[] | null | undefined, legacy?: string | null): string[] {
  if (Array.isArray(values)) return [...new Set(values.filter(Boolean))];
  return legacy ? [legacy] : [];
}
