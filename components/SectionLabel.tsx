type SectionLabelProps = {
  children: React.ReactNode;
  dot?: "yellow" | "purple";
  light?: boolean;
};

const dots = {
  yellow: "bg-move-yellow",
  purple: "bg-move-purple"
};

export function SectionLabel({ children, dot = "purple", light = false }: SectionLabelProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className={`h-2 w-2 rounded-full ${dots[dot]}`} />
      <span className={`text-eyebrow font-bold uppercase ${light ? "text-white/80" : "text-move-purple"}`}>
        {children}
      </span>
    </div>
  );
}
