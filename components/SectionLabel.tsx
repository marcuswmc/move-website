type SectionLabelProps = {
  children: React.ReactNode;
  dot?: "mint" | "yellow" | "green" | "purple";
  light?: boolean;
};

const dots = {
  mint: "bg-move-mint",
  yellow: "bg-move-yellow",
  green: "bg-move-green",
  purple: "bg-move-purple"
};

export function SectionLabel({ children, dot = "green", light = false }: SectionLabelProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className={`h-2 w-2 rounded-full ${dots[dot]}`} />
      <span className={`text-eyebrow font-bold uppercase ${light ? "text-white/80" : "text-move-purple"}`}>
        {children}
      </span>
    </div>
  );
}
