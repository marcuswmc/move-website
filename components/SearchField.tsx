"use client";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Rótulo acessível — o campo não mostra label visível. */
  label: string;
  className?: string;
};

/** Busca das listagens: lupa à esquerda, botão de limpar quando há texto. */
export function SearchField({ value, onChange, placeholder, label, className = "" }: SearchFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-move-purple/50"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>

      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-move-purple/20 bg-white py-2.5 pl-11 pr-10 text-sm font-semibold text-move-purple outline-none transition-[border-color,box-shadow] placeholder:font-medium placeholder:text-move-black/35 focus-visible:border-move-purple focus-visible:ring-2 focus-visible:ring-move-purple/25 [&::-webkit-search-cancel-button]:hidden"
      />

      {value !== "" && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-move-purple/60 transition-[background-color,color,scale] hover:bg-move-purple/10 hover:text-move-purple active:scale-[0.96]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-3.5 w-3.5"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
