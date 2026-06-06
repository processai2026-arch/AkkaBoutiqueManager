import { useMemo, useRef, useState, forwardRef } from "react";
import {
  Plus,
  Minus,
  Search,
  Trash2,
  Printer,
  Download,
  Tag,
  IndianRupee,
  Sparkles,
  Receipt,
  X,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { CATEGORIES, PRODUCTS } from "@/lib/mockData";
import { inr, inr2 } from "@/lib/format";
import type { CartLine, Product } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function Billing() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [customer, setCustomer] = useState({
    name: "Walk-in Customer",
    phone: "",
  });
  const [payment, setPayment] = useState<"Cash" | "UPI" | "Card">("UPI");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }).slice(0, 60);
  }, [query, activeCat]);

  function addToCart(p: Product) {
    setCart((prev) => {
      const found = prev.find((c) => c.productId === p.id);
      if (found) {
        return prev.map((c) =>
          c.productId === p.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          sku: p.sku,
          price: p.sellingPrice,
          gst: p.gst,
          quantity: 1,
        },
      ];
    });
  }
  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === id
            ? { ...c, quantity: Math.max(0, c.quantity + delta) }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  }
  function removeLine(id: string) {
    setCart((prev) => prev.filter((c) => c.productId !== id));
  }
  function clearCart() {
    setCart([]);
    setDiscount(0);
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const gstAmount = cart.reduce(
    (s, c) => s + (c.price * c.quantity * c.gst) / 100,
    0
  );
  const total = Math.max(0, subtotal + gstAmount - discount);
  const itemCount = cart.reduce((s, c) => s + c.quantity, 0);

  const invoiceNo = useMemo(
    () =>
      `BOS-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    []
  );

  function handlePrint() {
    setShowPreview(true);
    setTimeout(() => window.print(), 200);
  }
  function handleDownloadPdf() {
    setShowPreview(true);
    setTimeout(() => window.print(), 200);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-7 pb-6">
      <TopBar
        title="Billing"
        subtitle="Generate a customer invoice in under 30 seconds."
        actions={
          <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-lg bg-white border border-[hsl(var(--border))]">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Cashier
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">
              {user?.name}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* LEFT: Catalog (50%) */}
        <section className="space-y-3 min-w-0">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-3.5">
            <div className="flex items-center gap-2 px-3 h-11 rounded-lg bg-[hsl(var(--secondary))]/60">
              <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, SKU or barcode…"
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[hsl(var(--muted-foreground))] min-w-0"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] shrink-0"
                >
                  <X className="h-4 w-4" />
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
                      : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="group text-left rounded-2xl bg-white border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/40 hover:shadow-md transition overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[hsl(var(--secondary))]">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] truncate">
                    {p.category}
                  </div>
                  <div className="text-sm font-semibold mt-0.5 line-clamp-1">
                    {p.name}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-display font-semibold tabular-nums">
                      {inr(p.sellingPrice)}
                    </div>
                    <div className="h-7 w-7 rounded-full bg-[hsl(var(--primary))] text-white grid place-items-center group-hover:bg-[hsl(var(--accent))] transition shrink-0">
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-sm text-[hsl(var(--muted-foreground))] py-12">
                No products match “{query}”
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: Cart (50%) - sticky POS panel */}
        <aside className="lg:sticky lg:top-[78px] lg:self-start lg:max-h-[calc(100vh-100px)] rounded-2xl border border-[hsl(var(--border))] bg-white flex flex-col min-w-0">
          <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between shrink-0">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                Current Bill
              </div>
              <div className="font-display text-base font-semibold mt-0.5 truncate">
                {invoiceNo}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] font-semibold">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <button
                onClick={clearCart}
                disabled={!cart.length}
                className="text-xs inline-flex items-center gap-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>

          <div className="px-4 py-3 grid grid-cols-2 gap-3 border-b border-[hsl(var(--border))] shrink-0">
            <div>
              <label className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                Customer
              </label>
              <input
                value={customer.name}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, name: e.target.value }))
                }
                className="mt-1 w-full h-10 rounded-lg border border-[hsl(var(--border))] bg-white px-3 text-sm outline-none focus:border-[hsl(var(--ring))]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                Phone
              </label>
              <input
                value={customer.phone}
                placeholder="+91"
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, phone: e.target.value }))
                }
                className="mt-1 w-full h-10 rounded-lg border border-[hsl(var(--border))] bg-white px-3 text-sm outline-none focus:border-[hsl(var(--ring))]"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-4">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--secondary))] grid place-items-center mx-auto mb-3">
                  <Receipt className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                </div>
                <div className="text-sm font-medium">Your cart is empty</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Tap a product on the left to add it instantly.
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-[hsl(var(--border))]">
                {cart.map((c) => (
                  <li key={c.productId} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-[hsl(var(--muted-foreground))]">
                          {c.sku} · GST {c.gst}% · {inr(c.price)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeLine(c.productId)}
                        className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center rounded-lg border border-[hsl(var(--border))] overflow-hidden">
                        <button
                          onClick={() => changeQty(c.productId, -1)}
                          className="h-9 w-9 grid place-items-center hover:bg-[hsl(var(--secondary))]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold tabular-nums min-w-[2.2rem] text-center">
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => changeQty(c.productId, +1)}
                          className="h-9 w-9 grid place-items-center hover:bg-[hsl(var(--secondary))]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="font-semibold tabular-nums">
                        {inr(c.price * c.quantity)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-4 py-3 border-t border-[hsl(var(--border))] space-y-1.5 text-sm shrink-0 bg-[hsl(var(--secondary))]/20">
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">
                Subtotal
              </span>
              <span className="tabular-nums font-medium">
                {inr2(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">
                GST (auto)
              </span>
              <span className="tabular-nums font-medium">
                {inr2(gstAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[hsl(var(--muted-foreground))] inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> Discount
              </span>
              <div className="flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-white px-2 h-8">
                <IndianRupee className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="number"
                  min={0}
                  value={discount || ""}
                  onChange={(e) =>
                    setDiscount(Math.max(0, Number(e.target.value || 0)))
                  }
                  placeholder="0"
                  className="w-20 bg-transparent text-sm outline-none tabular-nums"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-[hsl(var(--border))]">
              <span className="font-display text-base font-semibold">
                Grand Total
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums">
                {inr(total)}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {(["Cash", "UPI", "Card"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPayment(m)}
                  className={cn(
                    "flex-1 h-9 rounded-lg text-xs font-semibold border transition",
                    payment === m
                      ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                      : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 border-t border-[hsl(var(--border))] grid grid-cols-2 gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={!cart.length}
              className="h-12 rounded-xl bg-white border border-[hsl(var(--border))] inline-flex items-center justify-center gap-2 text-sm font-semibold hover:border-[hsl(var(--primary))]/40 disabled:opacity-50 transition"
            >
              <Download className="h-4 w-4" /> PDF
            </button>
            <button
              onClick={handlePrint}
              disabled={!cart.length}
              className="h-12 rounded-xl bg-[hsl(var(--primary))] text-white inline-flex items-center justify-center gap-2 text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition"
            >
              <Printer className="h-4 w-4" /> Print Bill
            </button>
          </div>
        </aside>
      </div>

      {/* Invoice preview modal / print area */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="font-semibold">Invoice Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="h-9 px-3 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold inline-flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" /> Print / PDF
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="h-9 w-9 rounded-lg border border-[hsl(var(--border))] grid place-items-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <InvoicePreview
              ref={previewRef}
              invoiceNo={invoiceNo}
              customer={customer}
              cart={cart}
              subtotal={subtotal}
              gstAmount={gstAmount}
              discount={discount}
              total={total}
              payment={payment}
              cashier={user?.name || "Staff"}
            />
          </div>
        </div>
      )}

      {/* Hidden print-only block when no modal */}
      <div className="hidden print:block">
        <InvoicePreview
          invoiceNo={invoiceNo}
          customer={customer}
          cart={cart}
          subtotal={subtotal}
          gstAmount={gstAmount}
          discount={discount}
          total={total}
          payment={payment}
          cashier={user?.name || "Staff"}
        />
      </div>
    </div>
  );
}

interface InvoicePreviewProps {
  invoiceNo: string;
  customer: { name: string; phone: string };
  cart: CartLine[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  payment: "Cash" | "UPI" | "Card";
  cashier: string;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  function InvoicePreview(
    {
      invoiceNo,
      customer,
      cart,
      subtotal,
      gstAmount,
      discount,
      total,
      payment,
      cashier,
    },
    ref
  ) {
    return (
      <div ref={ref} className="p-8 print-area">
        <div className="flex items-start justify-between border-b pb-4 border-[hsl(var(--border))]">
          <div>
            <div className="font-display text-2xl font-semibold">
              BoutiqueOS
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              45, Pondy Bazaar, T. Nagar, Chennai 600017
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              GSTIN 33AABCU9603R1ZM · +91 98414 00000
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
              Tax Invoice
            </div>
            <div className="font-display text-lg font-semibold">
              {invoiceNo}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              {new Date().toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
              Billed to
            </div>
            <div className="font-semibold mt-1">{customer.name}</div>
            <div className="text-[hsl(var(--muted-foreground))]">
              {customer.phone || "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
              Payment
            </div>
            <div className="font-semibold mt-1">{payment}</div>
            <div className="text-[hsl(var(--muted-foreground))]">
              Cashier · {cashier}
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-y border-[hsl(var(--border))]">
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 font-semibold text-center">Qty</th>
              <th className="py-2 font-semibold text-right">Rate</th>
              <th className="py-2 font-semibold text-right">GST</th>
              <th className="py-2 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((c) => (
              <tr
                key={c.productId}
                className="border-b border-[hsl(var(--border))]"
              >
                <td className="py-2">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {c.sku}
                  </div>
                </td>
                <td className="py-2 text-center tabular-nums">{c.quantity}</td>
                <td className="py-2 text-right tabular-nums">
                  {inr2(c.price)}
                </td>
                <td className="py-2 text-right tabular-nums">{c.gst}%</td>
                <td className="py-2 text-right tabular-nums font-medium">
                  {inr2(c.price * c.quantity)}
                </td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-[hsl(var(--muted-foreground))]"
                >
                  Add items to preview an invoice.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end pt-4">
          <div className="w-72 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">
                Subtotal
              </span>
              <span className="tabular-nums">{inr2(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">GST</span>
              <span className="tabular-nums">{inr2(gstAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">
                Discount
              </span>
              <span className="tabular-nums">- {inr2(discount)}</span>
            </div>
            <div className="flex justify-between border-t border-[hsl(var(--border))] pt-2 mt-2">
              <span className="font-display text-base font-semibold">
                Total
              </span>
              <span className="font-display text-base font-semibold tabular-nums">
                {inr(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--border))] mt-6 pt-4 text-[11px] text-[hsl(var(--muted-foreground))] flex justify-between">
          <span>Thank you for shopping with BoutiqueOS.</span>
          <span>This is a computer-generated invoice.</span>
        </div>
      </div>
    );
  }
);
