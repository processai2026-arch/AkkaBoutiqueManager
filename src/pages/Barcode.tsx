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
    }).slice(0, 60);
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

  return (
    <div className="px-4 sm:px-6 lg:px-7 pb-6 no-print">
      <TopBar
        title="Barcode Printing"
        subtitle="Generate, preview and batch-print product labels."
        actions={
          <button
            onClick={handlePrint}
            disabled={totalLabels === 0}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold disabled:opacity-50 transition hover:opacity-95"
          >
            <Printer className="h-4 w-4" />
            <span className="whitespace-nowrap">
              Print {totalLabels || ""} Labels
            </span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* LEFT: Products (50%) */}
        <section className="space-y-3 min-w-0">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-3.5">
            <div className="flex items-center gap-2 px-3 h-11 rounded-lg bg-[hsl(var(--secondary))]/60">
              <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a product or scan a barcode"
                className="flex-1 bg-transparent text-[15px] outline-none min-w-0"
              />
              {query && (
                <button onClick={() => setQuery("")} className="shrink-0">
                  <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin mt-3 -mx-1 px-1 pb-0.5">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={cn(
                    "px-3 h-8 rounded-full text-xs whitespace-nowrap border transition shrink-0",
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

          <div className="space-y-2.5">
            {filtered.map((p) => {
              const qty = batch[p.id] ?? 0;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-[hsl(var(--border))] bg-white p-3 flex items-center gap-3 hover:border-[hsl(var(--primary))]/30 transition"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-14 w-14 rounded-lg object-cover bg-[hsl(var(--secondary))] shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold truncate">
                      {p.category} · {p.sku}
                    </div>
                    <div className="font-semibold text-sm truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono mt-0.5 truncate">
                      {p.barcode}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="font-display font-semibold text-sm tabular-nums">
                      {inr(p.sellingPrice)}
                    </div>
                    <div className="inline-flex items-center rounded-lg border border-[hsl(var(--border))] overflow-hidden">
                      <button
                        onClick={() => bump(p.id, -1)}
                        className="h-7 w-7 grid place-items-center hover:bg-[hsl(var(--secondary))]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums min-w-[1.7rem] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => bump(p.id, +1)}
                        className="h-7 w-7 grid place-items-center hover:bg-[hsl(var(--secondary))]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center text-sm text-[hsl(var(--muted-foreground))] py-12 rounded-xl border border-dashed border-[hsl(var(--border))]">
                No products match “{query}”
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: Preview + batch (50%) - sticky */}
        <aside className="lg:sticky lg:top-[78px] lg:self-start lg:max-h-[calc(100vh-100px)] flex flex-col gap-3 min-w-0">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                  Print Batch
                </div>
                <div className="font-display text-xl font-semibold tabular-nums">
                  {totalLabels} label{totalLabels !== 1 ? "s" : ""}
                </div>
              </div>
              <button
                onClick={clearBatch}
                disabled={!totalLabels}
                className="text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] disabled:opacity-50 shrink-0"
              >
                Clear batch
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
              <Filter className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))] shrink-0" />
              <span className="text-[hsl(var(--muted-foreground))]">
                Label size
              </span>
              {(["sm", "md", "lg"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setLabelSize(s)}
                  className={cn(
                    "px-3 h-7 rounded-full font-semibold border transition",
                    labelSize === s
                      ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                      : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              disabled={totalLabels === 0}
              className="mt-3 w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition"
            >
              <Printer className="h-4 w-4" /> Print Labels
            </button>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))] shrink-0">
              <div className="text-sm font-semibold inline-flex items-center gap-2">
                <Tag className="h-4 w-4" /> Live Sticker Preview
              </div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {selectedProducts.length} SKU
                {selectedProducts.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="flex-1 min-h-[280px] overflow-y-auto scrollbar-thin p-4 bg-[hsl(var(--secondary))]/20">
              {selectedProducts.length === 0 ? (
                <div className="h-full grid place-items-center">
                  <div className="text-center max-w-xs">
                    <div className="h-12 w-12 rounded-full bg-white border border-[hsl(var(--border))] grid place-items-center mx-auto mb-3">
                      <Tag className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div className="text-sm font-medium">
                      Add products to preview
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      Select labels on the left and labels will render here
                      instantly.
                    </div>
                  </div>
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
  const flat = items.flatMap((it) =>
    Array.from({ length: it.qty }, () => it.product)
  );
  const heightMap = { sm: 38, md: 48, lg: 58 } as const;
  const padMap = { sm: "p-2", md: "p-2.5", lg: "p-3" } as const;
  const cols = size === "sm" ? "grid-cols-3" : "grid-cols-2";

  return (
    <div
      className={cn(
        "grid gap-2.5",
        fullPrint ? "grid-cols-3 p-6 print-area" : cols
      )}
    >
      {flat.map((p, idx) => (
        <div
          key={`${p.id}-${idx}`}
          className={cn(
            "rounded-lg border border-[hsl(var(--border))] bg-white",
            padMap[size]
          )}
        >
          <div className="text-[9px] uppercase tracking-[0.18em] font-bold">
            BoutiqueOS
          </div>
          <div className="text-[11px] mt-0.5 line-clamp-1 font-semibold">
            {p.name}
          </div>
          <div className="text-[9px] text-[hsl(var(--muted-foreground))]">
            {p.sku} · GST {p.gst}%
          </div>
          <div className="mt-1.5">
            <BarcodeSVG value={p.barcode} height={heightMap[size]} />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-[9px] text-[hsl(var(--muted-foreground))]">
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
