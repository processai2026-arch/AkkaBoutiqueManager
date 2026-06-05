interface BarcodeSVGProps {
  value: string;
  height?: number;
  className?: string;
  showText?: boolean;
}

// Lightweight visual barcode (Code 128-styled aesthetic, deterministic from value)
export default function BarcodeSVG({
  value,
  height = 60,
  className,
  showText = true,
}: BarcodeSVGProps) {
  const bars: { x: number; w: number }[] = [];
  let x = 6;
  // quiet zone
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // 4 bars per character, varying widths
    for (let b = 0; b < 4; b++) {
      const seed = (code * 31 + b * 7 + i * 13) % 9;
      const w = 1 + (seed % 4);
      const isBar = (seed + b) % 2 === 0;
      if (isBar) bars.push({ x, w });
      x += w + 1;
    }
  }
  const width = x + 6;
  const barH = showText ? height - 14 : height;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height }}
      aria-label={`Barcode ${value}`}
    >
      <rect width={width} height={height} fill="white" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={2} width={b.w} height={barH} fill="black" />
      ))}
      {showText ? (
        <text
          x={width / 2}
          y={height - 2}
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fill="black"
          letterSpacing="2"
        >
          {value}
        </text>
      ) : null}
    </svg>
  );
}
