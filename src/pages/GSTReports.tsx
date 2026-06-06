import { useMemo, useState } from "react";
import {
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Calendar,
  Search,
  ReceiptText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/features/StatCard";
import { GST_MONTHS, INVOICES } from "@/lib/mockData";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

type RangeId = "today" | "7d" | "30d" | "this" | "last" | "custom";

const PRESETS: { id: RangeId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "this", label: "This Month" },
  { id: "last", label: "Last Month" },
  { id: "custom", label: "Custom Range" },
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function getRangeBounds(range: RangeId, customFrom: string, customTo: string) {
  const now = new Date();
  let from: Date;
  let to: Date;
  switch (range) {
    case "today":
      from = startOfDay(now);
      to = endOfDay(now);
      break;
    case "7d":
      from = startOfDay(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
      );
      to = endOfDay(now);
      break;
    case "30d":
      from = startOfDay(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
      );
      to = endOfDay(now);
      break;
    case "this":
      from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      to = endOfDay(now);
      break;
    case "last":
      from = startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      to = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
      break;
    case "custom":
      from = customFrom ? startOfDay(new Date(customFrom)) : startOfDay(now);
      to = customTo ? endOfDay(new Date(customTo)) : endOfDay(now);
      break;
  }
  return { from, to };
}
function fmtRange(from: Date, to: Date) {
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return `${from.toLocaleDateString("en-IN", opts)} → ${to.toLocaleDateString("en-IN", opts)}`;
}

export default function GSTReports() {
  const today = new Date();
  const [range, setRange] = useState<RangeId>("this");
  const [customFrom, setCustomFrom] = useState(
    isoDate(new Date(today.getFullYear(), today.getMonth(), 1))
  );
  const [customTo, setCustomTo] = useState(isoDate(today));
  const [search, setSearch] = useState("");

  const { from, to } = useMemo(
    () => getRangeBounds(range, customFrom, customTo),
    [range, customFrom, customTo]
  );

  const filtered = useMemo(
    () =>
      INVOICES.filter((i) => {
        const d = new Date(i.date);
        return d >= from && d <= to;
      }),
    [from, to]
  );

  const tableRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter(
      (i) =>
        i.number.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q)
    );
  }, [filtered, search]);

  const totalSales = filtered.reduce((s, i) => s + i.subtotal, 0);
  const totalGST = filtered.reduce((s, i) => s + i.gstAmount, 0);
  const interStateRatio = 0.18;
  const igst = Math.round(totalGST * interStateRatio);
  const cgst = Math.round((totalGST - igst) / 2);
  const sgst = totalGST - igst - cgst;
  const inputGST = Math.round(totalGST * 0.62);
  const netPayable = Math.max(0, totalGST - inputGST);
  const totalPurchases = Math.round(totalSales * 0.62);

  const presetLabel = useMemo(() => {
    if (range === "custom") return fmtRange(from, to);
    if (range === "this" || range === "last") {
      return from.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
    }
    return PRESETS.find((p) => p.id === range)?.label ?? "";
  }, [range, from, to]);

  function exportCSV() {
    const headers = [
      "Invoice Number",
      "Customer",
      "Date",
      "Product Count",
      "Taxable Value",
      "GST %",
      "GST Amount",
      "Total",
    ];
    const rows = tableRows.map((i) => {
      const avgGst =
        i.subtotal > 0
          ? Math.round((i.gstAmount / i.subtotal) * 1000) / 10
          : 0;
      return [
        i.number,
        i.customerName,
        new Date(i.date).toLocaleDateString("en-IN"),
        i.items.length,
        i.subtotal,
        `${avgGst}%`,
        i.gstAmount,
        i.total,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gst-report-${range}-${isoDate(from)}-to-${isoDate(to)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-7 pb-6">
      <TopBar
        title="GST Reports"
        subtitle="Filing-ready summaries with date-range filters and exports."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-white text-sm font-semibold hover:border-[hsl(var(--primary))]/30 transition"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-white text-sm font-semibold hover:border-[hsl(var(--primary))]/30 transition"
            >
              <Download className="h-4 w-4" /> PDF
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-95"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
          </div>
        }
      />

      {/* Date Range Filter */}
      <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-white p-4">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[hsl(var(--muted-foreground))]">
              Date Range
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setRange(p.id)}
                className={cn(
                  "px-3 h-8 rounded-full text-xs font-semibold border transition whitespace-nowrap",
                  range === p.id
                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                    : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] tabular-nums whitespace-nowrap">
            {fmtRange(from, to)}
          </div>
        </div>

        {range === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[hsl(var(--border))]">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                From
              </span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-white text-sm outline-none focus:border-[hsl(var(--ring))]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
                To
              </span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-white text-sm outline-none focus:border-[hsl(var(--ring))]"
              />
            </label>
          </div>
        )}
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
        <StatCard
          label="Total Sales"
          value={inr(totalSales)}
          icon={<TrendingUp className="h-5 w-5" />}
          delta={`${filtered.length} invoices`}
          trend="up"
        />
        <StatCard
          label="GST Collected"
          value={inr(totalGST)}
          icon={<ReceiptText className="h-5 w-5" />}
          delta="output tax"
          trend="up"
        />
        <StatCard
          label="Input Tax Credit"
          value={inr(inputGST)}
          icon={<TrendingDown className="h-5 w-5" />}
          delta="from purchases"
          trend="down"
        />
        <StatCard
          label="Net GST Payable"
          value={inr(netPayable)}
          icon={<IndianRupee className="h-5 w-5" />}
          delta="ready to file"
          trend="flat"
        />
      </section>

      {/* Monthly Summary + Trend */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-4 mt-4">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5 print-area">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[hsl(var(--muted-foreground))]">
                GST Filing Summary
              </div>
              <h2 className="font-display text-xl font-semibold mt-0.5">
                {presetLabel}
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                {fmtRange(from, to)} · GSTR-3B style
              </p>
            </div>
            <div className="text-right text-xs text-[hsl(var(--muted-foreground))]">
              <div className="font-semibold text-[hsl(var(--foreground))]">
                BoutiqueOS · Chennai
              </div>
              GSTIN 33AABCU9603R1ZM
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[hsl(var(--border))] rounded-xl overflow-hidden mt-4">
            <Cell label="Total Sales" value={inr(totalSales)} />
            <Cell label="Total Purchases" value={inr(totalPurchases)} />
            <Cell label="Taxable Amount" value={inr(totalSales)} />
            <Cell label="CGST (Output)" value={inr(cgst)} />
            <Cell label="SGST (Output)" value={inr(sgst)} />
            <Cell label="IGST (Output)" value={inr(igst)} />
            <Cell label="Total GST Collected" value={inr(totalGST)} />
            <Cell label="GST Paid (ITC)" value={inr(inputGST)} />
            <Cell label="Net Payable" value={inr(netPayable)} accent />
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Purchase vs Sales Tax
            </h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Last 6 months · auto-generated monthly
            </p>
          </div>
          <div className="h-[260px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={GST_MONTHS}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E7E2DA"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6E665B" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6E665B" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E7E2DA",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => inr(v)}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#6E665B" }}
                />
                <Bar
                  dataKey="outputGst"
                  name="Output GST"
                  fill="#0F0E0C"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="inputGst"
                  name="Input GST"
                  fill="#C2873A"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Invoice table */}
      <section className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-white print-area overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-[hsl(var(--border))] flex-wrap">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Invoice details
            </h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {filtered.length} invoice{filtered.length !== 1 ? "s" : ""} ·{" "}
              {presetLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-[hsl(var(--secondary))]/60 max-w-xs flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice or customer"
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
            />
          </div>
          <button
            onClick={exportCSV}
            className="h-9 px-3 inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-white text-xs font-semibold hover:border-[hsl(var(--primary))]/30"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="text-left bg-[hsl(var(--secondary))]/30">
              <tr className="text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                <th className="py-3 px-4 font-semibold">Invoice Number</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold text-center">
                  Products
                </th>
                <th className="py-3 px-4 font-semibold text-right">
                  Taxable Value
                </th>
                <th className="py-3 px-4 font-semibold text-right">GST %</th>
                <th className="py-3 px-4 font-semibold text-right">
                  GST Amount
                </th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((i) => {
                const gstPct =
                  i.subtotal > 0
                    ? Math.round((i.gstAmount / i.subtotal) * 1000) / 10
                    : 0;
                return (
                  <tr
                    key={i.id}
                    className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]/30"
                  >
                    <td className="py-2.5 px-4 font-mono text-xs whitespace-nowrap">
                      {i.number}
                    </td>
                    <td className="py-2.5 px-4">{i.customerName}</td>
                    <td className="py-2.5 px-4 text-center tabular-nums">
                      {i.items.length}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {inr(i.subtotal)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {gstPct}%
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {inr(i.gstAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                      {new Date(i.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold">
                      {inr(i.total)}
                    </td>
                  </tr>
                );
              })}
              {tableRows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-[hsl(var(--muted-foreground))]"
                  >
                    No invoices match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
            {tableRows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/20">
                  <td
                    colSpan={3}
                    className="py-3 px-4 text-[11px] uppercase tracking-[0.14em] font-semibold text-[hsl(var(--muted-foreground))]"
                  >
                    Totals
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold">
                    {inr(tableRows.reduce((s, i) => s + i.subtotal, 0))}
                  </td>
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4 text-right tabular-nums font-semibold">
                    {inr(tableRows.reduce((s, i) => s + i.gstAmount, 0))}
                  </td>
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4 text-right tabular-nums font-semibold">
                    {inr(tableRows.reduce((s, i) => s + i.total, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] flex items-center justify-between flex-wrap gap-2">
          <span>
            Filing reference: GSTR-3B · {presetLabel} · auto-generated
          </span>
          <span>
            Generated {new Date().toLocaleDateString("en-IN")} · BoutiqueOS
          </span>
        </div>
      </section>
    </div>
  );
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-4 bg-white",
        accent && "bg-[hsl(var(--primary))] text-white"
      )}
    >
      <div
        className={cn(
          "text-[10px] uppercase tracking-[0.16em] font-semibold",
          accent ? "text-white/70" : "text-[hsl(var(--muted-foreground))]"
        )}
      >
        {label}
      </div>
      <div className="font-display text-xl font-semibold mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}
