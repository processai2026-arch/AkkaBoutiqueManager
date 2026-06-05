import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Package,
  PackagePlus,
  AlertTriangle,
  TrendingUp,
  X,
  Pencil,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/features/StatCard";
import { CATEGORIES, PRODUCTS } from "@/lib/mockData";
import { inr, num } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "low" | "out">(
    "all"
  );
  const [openEdit, setOpenEdit] = useState<Product | null>(null);
  const [openAdd, setOpenAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (statusFilter === "low" && p.quantity > p.lowStockThreshold)
        return false;
      if (statusFilter === "out" && p.quantity > 0) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      );
    });
  }, [products, query, activeCat, statusFilter]);

  const stockUnits = products.reduce((s, p) => s + p.quantity, 0);
  const lowCount = products.filter(
    (p) => p.quantity <= p.lowStockThreshold
  ).length;
  const monthlyPurchases = products
    .filter(
      (p) => Date.now() - +new Date(p.addedOn) < 30 * 24 * 60 * 60 * 1000
    )
    .reduce((s, p) => s + p.purchasePrice * p.quantity, 0);

  function saveEdit(p: Product) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    setOpenEdit(null);
  }

  function addProduct(p: Product) {
    setProducts((prev) => [p, ...prev]);
    setOpenAdd(false);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Inventory"
        subtitle="Live stock levels, low stock alerts, and quick edits."
        actions={
          <button
            onClick={() => setOpenAdd(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        }
      />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Total Products"
          value={num(products.length)}
          icon={<Package className="h-5 w-5" />}
          delta="6 categories"
          trend="flat"
        />
        <StatCard
          label="Available Stock"
          value={num(stockUnits)}
          icon={<TrendingUp className="h-5 w-5" />}
          delta="+128 this month"
          trend="up"
        />
        <StatCard
          label="Low Stock Items"
          value={`${lowCount}`}
          icon={<AlertTriangle className="h-5 w-5" />}
          delta="re-order"
          trend="down"
        />
        <StatCard
          label="Monthly Purchases"
          value={inr(monthlyPurchases)}
          icon={<PackagePlus className="h-5 w-5" />}
          delta="+18.6%"
          trend="up"
        />
      </section>

      <section className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-white">
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2 px-3 h-10 rounded-lg bg-[hsl(var(--secondary))]/60 w-full lg:max-w-md">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU or barcode"
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
            <div className="ml-2 hidden lg:flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] border-l border-[hsl(var(--border))] pl-2">
              <Filter className="h-3.5 w-3.5" />
              {(["all", "low", "out"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-2 py-1 rounded-md font-medium",
                    statusFilter === s
                      ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"
                      : "hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {s === "all" ? "All" : s === "low" ? "Low" : "Out"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="text-left bg-[hsl(var(--secondary))]/30">
              <tr className="text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                <th className="py-3 px-4 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Product <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Barcode</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-right">Qty</th>
                <th className="py-3 px-4 font-semibold text-right">
                  Cost
                </th>
                <th className="py-3 px-4 font-semibold text-right">Price</th>
                <th className="py-3 px-4 font-semibold text-right">GST</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status =
                  p.quantity === 0
                    ? "Out of Stock"
                    : p.quantity <= p.lowStockThreshold
                    ? "Low"
                    : "In Stock";
                return (
                  <tr
                    key={p.id}
                    className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]/30"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover bg-[hsl(var(--secondary))]"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold truncate max-w-[260px]">
                            {p.name}
                          </div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">
                            Added {new Date(p.addedOn).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{p.sku}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {p.barcode}
                    </td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {p.quantity}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {inr(p.purchasePrice)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {inr(p.sellingPrice)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {p.gst}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          status === "In Stock" &&
                            "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
                          status === "Low" &&
                            "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
                          status === "Out of Stock" &&
                            "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]"
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setOpenEdit(p)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-12 text-[hsl(var(--muted-foreground))]"
                  >
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {openEdit && (
        <ProductDialog
          mode="edit"
          product={openEdit}
          onClose={() => setOpenEdit(null)}
          onSave={saveEdit}
        />
      )}
      {openAdd && (
        <ProductDialog
          mode="add"
          onClose={() => setOpenAdd(false)}
          onSave={addProduct}
        />
      )}
    </div>
  );
}

interface DialogProps {
  mode: "add" | "edit";
  product?: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}
function ProductDialog({ mode, product, onClose, onSave }: DialogProps) {
  const [form, setForm] = useState<Product>(
    product ?? {
      id: `P${Date.now()}`,
      name: "",
      sku: `NEW-${Math.floor(Math.random() * 9000 + 1000)}`,
      barcode: `${Math.floor(Math.random() * 9 + 1)}${Math.floor(
        Math.random() * 1e12
      )
        .toString()
        .padStart(12, "0")}`.slice(0, 13),
      category: "Sarees",
      quantity: 10,
      purchasePrice: 1000,
      sellingPrice: 1500,
      gst: 5,
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      addedOn: new Date().toISOString(),
      lowStockThreshold: 6,
    }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
              {mode === "edit" ? "Edit Product" : "Add Product"}
            </div>
            <div className="font-display text-lg font-semibold mt-0.5">
              {form.name || "New product"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-[hsl(var(--border))] grid place-items-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          <Field label="Product Name" full>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="SKU">
            <input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Barcode">
            <input
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              className="input font-mono"
            />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="input"
            />
          </Field>
          <Field label="Purchase Price (₹)">
            <input
              type="number"
              value={form.purchasePrice}
              onChange={(e) =>
                setForm({ ...form, purchasePrice: Number(e.target.value) })
              }
              className="input"
            />
          </Field>
          <Field label="Selling Price (₹)">
            <input
              type="number"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: Number(e.target.value) })
              }
              className="input"
            />
          </Field>
          <Field label="GST %">
            <input
              type="number"
              value={form.gst}
              onChange={(e) =>
                setForm({ ...form, gst: Number(e.target.value) })
              }
              className="input"
            />
          </Field>
          <Field label="Image URL" full>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input"
            />
          </Field>
        </div>
        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-[hsl(var(--border))] text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </div>
      <style>{`.input{width:100%;height:40px;padding:0 12px;border-radius:10px;border:1px solid hsl(var(--border));background:white;outline:none;font-size:14px}
        .input:focus{border-color:hsl(var(--ring))}
      `}</style>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1", full && "col-span-2")}>
      <span className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}
