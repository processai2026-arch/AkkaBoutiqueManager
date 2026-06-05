import { useMemo, useState } from "react";
import { Search, Printer, Plus, Minus, X, Tag, Filter } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { CATEGORIES, PRODUCTS } from "@/lib/mockData";
import { inr } from "@/lib/format";
import BarcodeSVG from "@/components/features/BarcodeSVG";
import { cn } from "@/lib/utils";

export default function BarcodePrint() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [batch, setBatch] = useState<Record<string, number>>({});
  const [labelSize, setLabelSize] = useState<"sm" | "md" | "lg">("md");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      );
    }).slice(0, 36);
  }, [query, activeCat]);

  const totalLabels = Object.values(batch).reduce((a, b) => a + b, 0);
  const selectedProducts = Object.keys(batch)
    .filter((id) => batch[id] > 0)
    .map((id) => PRODUCTS.find((p) => p.id === id)!)
    .filter(Boolean);

  function bump(id: string, delta: number) {
    setBatch((b) => ({ ...b, [id]: Math.max(0, (b[id] ?? 0) + delta) }));
  }

  function clearBatch() {
    setBatch({});
  }
  function handlePrint() {
    if (totalLabels === 0) return;
    window.print();
  }

  const pageBg = "bg-white";

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10 no-print">
      <TopBar
        title="Barcode Printing"
        subtitle="Generate, preview and batch-print product labels."
        actions={
          <button
            onClick={handlePrint}
            disabled={totalLabels === 0}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold disabled:opacity-50"
          >
            <Printer className="h-4 w-4" /> Print {totalLabels || ""} Labels
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-6 mt-6">
        <section className="space-y-4">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2 px-3 h-10 rounded-lg bg-[hsl(var(--secondary))]/60 w-full lg:max-w-md">
              <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a product or scan a barcode"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={cn(
                    "px-3 h-8 rounded-full text-xs whitespace-nowrap border transition",
                    activeCat === c
                      ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                      : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
            {filtered.map((p) => {
              const qty = batch[p.id] ?? 0;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4 flex gap-4"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-20 w-20 rounded-lg object-cover bg-[hsl(var(--secondary))] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                      {p.category} · {p.sku}
                    </div>
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] font-mono mt-0.5">
                      {p.barcode}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-display font-semibold">
                        {inr(p.sellingPrice)}
                      </div>
                      <div className="inline-flex items-center rounded-lg border border-[hsl(var(--border))] overflow-hidden">
                        <button
                          onClick={() => bump(p.id, -1)}
                          className="h-8 w-8 grid place-items-center hover:bg-[hsl(var(--secondary))]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-semibold tabular-nums min-w-[2rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => bump(p.id, +1)}
                          className="h-8 w-8 grid place-items-center hover:bg-[hsl(var(--secondary))]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-[88px] h-fit">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                  Print Batch
                </div>
                <div className="font-display text-xl font-semibold">
                  {totalLabels} label{totalLabels !== 1 ? "s" : ""}
                </div>
              </div>
              <button
                onClick={clearBatch}
                disabled={!totalLabels}
                className="text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              <span className="text-[hsl(var(--muted-foreground))]">
                Label size
              </span>
              {(["sm", "md", "lg"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setLabelSize(s)}
                  className={cn(
                    "px-2.5 h-7 rounded-full font-semibold border",
                    labelSize === s
                      ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                      : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
            <div className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
              <Tag className="h-4 w-4" /> Sticker preview
            </div>
            {selectedProducts.length === 0 ? (
              <div className="text-center text-sm text-[hsl(var(--muted-foreground))] py-10">
                Add products to the batch to preview labels.
              </div>
            ) : (
              <PreviewSheet
                items={selectedProducts.map((p) => ({
                  product: p,
                  qty: batch[p.id] ?? 0,
                }))}
                size={labelSize}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Print sheet */}
      <div className="hidden print:block">
        <PreviewSheet
          items={selectedProducts.map((p) => ({
            product: p,
            qty: batch[p.id] ?? 0,
          }))}
          size={labelSize}
          fullPrint
        />
      </div>

      <div aria-hidden className={cn("hidden", pageBg)} />
    </div>
  );
}

function PreviewSheet({
  items,
  size,
  fullPrint,
}: {
  items: { product: (typeof PRODUCTS)[number]; qty: number }[];
  size: "sm" | "md" | "lg";
  fullPrint?: boolean;
}) {
  const flat = items.flatMap((it) => Array.from({ length: it.qty }, () => it.product));
  const sizeMap = {
    sm: "w-[150px]",
    md: "w-[180px]",
    lg: "w-[220px]",
  } as const;
  const heightMap = { sm: 40, md: 50, lg: 60 } as const;

  return (
    <div
      className={cn(
        "grid gap-3",
        fullPrint
          ? "grid-cols-3 p-6 print-area"
          : "grid-cols-2 max-h-[60vh] overflow-y-auto scrollbar-thin"
      )}
    >
      {flat.map((p, idx) => (
        <div
          key={`${p.id}-${idx}`}
          className={cn(
            "rounded-lg border border-[hsl(var(--border))] bg-white p-3 shrink-0",
            sizeMap[size]
          )}
        >
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold">
            Akka Boutique
          </div>
          <div className="text-[11px] mt-0.5 line-clamp-1 font-semibold">
            {p.name}
          </div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))]">
            {p.sku} · GST {p.gst}%
          </div>
          <div className="mt-1.5">
            <BarcodeSVG value={p.barcode} height={heightMap[size]} />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-[10px] text-[hsl(var(--muted-foreground))]">
              MRP
            </div>
            <div className="text-sm font-bold tabular-nums">
              {inr(p.sellingPrice)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
