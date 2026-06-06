import { Sparkles } from "lucide-react";

export default function DemoBanner() {
  return (
    <div className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs sm:text-sm no-print">
      <div className="flex items-center justify-center gap-2 px-4 py-2 tracking-wide">
        <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
        <span className="font-semibold">Demo Version</span>
        <span className="opacity-50">·</span>
        <span className="opacity-80">
          Sample boutique data — for client preview only
        </span>
      </div>
    </div>
  );
}
