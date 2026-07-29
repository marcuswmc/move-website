type FlowerGraphicProps = {
  className?: string;
};

export function FlowerGraphic({ className = "" }: FlowerGraphicProps) {
  const petals = Array.from({ length: 12 });

  return (
    <svg className={className} viewBox="0 0 220 220" aria-hidden="true">
      <g className="flower-spin" style={{ transformOrigin: "110px 110px" }}>
        {petals.map((_, index) => {
          const color = index % 3 === 0 ? "#004A3D" : index % 3 === 1 ? "#A2DAA8" : "#6268D9";
          return (
            <ellipse
              key={index}
              cx="110"
              cy="57"
              rx="26"
              ry="56"
              fill={color}
              opacity={index % 2 === 0 ? 0.86 : 0.68}
              transform={`rotate(${index * 30} 110 110)`}
            />
          );
        })}
      </g>
      <circle cx="110" cy="110" r="34" fill="#F8E44B" />
    </svg>
  );
}
