import { useState } from "react";
import {
  Building2,
  Receipt,
  Printer,
  Users,
  Bell,
  Save,
  CheckCircle2,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

const sections = [
  { id: "boutique", label: "Boutique", icon: Building2 },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "printing", label: "Printing", icon: Printer },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

export default function Settings() {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>(
    "boutique"
  );
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Settings"
        subtitle="Configure boutique details, billing rules and team access."
        actions={
          <button
            onClick={save}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save changes
              </>
            )}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 mt-6">
        <nav className="rounded-2xl border border-[hsl(var(--border))] bg-white p-2 h-fit">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition",
                active === s.id
                  ? "bg-[hsl(var(--secondary))] font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <s.icon className="h-4 w-4" /> {s.label}
            </button>
          ))}
        </nav>

        <section className="rounded-2xl border border-[hsl(var(--border))] bg-white p-6">
          {active === "boutique" && <BoutiquePanel />}
          {active === "billing" && <BillingPanel />}
          {active === "printing" && <PrintingPanel />}
          {active === "team" && <TeamPanel />}
          {active === "notifications" && <NotificationsPanel />}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", full && "col-span-2")}>
      <span className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-11 px-3 rounded-lg border border-[hsl(var(--border))] bg-white outline-none focus:border-[hsl(var(--ring))] text-sm";

function BoutiquePanel() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">
        Boutique Information
      </h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Appears on invoices, GST filings and barcode labels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Field label="Boutique Name">
          <input defaultValue="Akka Boutique" className={inputCls} />
        </Field>
        <Field label="GSTIN">
          <input defaultValue="33AABCU9603R1ZM" className={inputCls} />
        </Field>
        <Field label="Phone">
          <input defaultValue="+91 98414 00000" className={inputCls} />
        </Field>
        <Field label="Email">
          <input
            defaultValue="hello@boutiqueakka.com"
            className={inputCls}
          />
        </Field>
        <Field label="Address" full>
          <input
            defaultValue="45, Pondy Bazaar, T. Nagar, Chennai 600017"
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

function BillingPanel() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Billing</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Default invoice rules.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Field label="Default GST %">
          <input defaultValue="5" className={inputCls} />
        </Field>
        <Field label="Invoice Prefix">
          <input defaultValue="AKB-" className={inputCls} />
        </Field>
        <Field label="Default Payment Mode">
          <select className={inputCls} defaultValue="UPI">
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </Field>
        <Field label="Round-off totals">
          <select className={inputCls} defaultValue="Yes">
            <option>Yes</option>
            <option>No</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function PrintingPanel() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Printing</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Format defaults for invoices and labels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Field label="Invoice paper size">
          <select className={inputCls} defaultValue="A4">
            <option>A4</option>
            <option>A5</option>
            <option>Thermal 80mm</option>
          </select>
        </Field>
        <Field label="Default label size">
          <select className={inputCls} defaultValue="MD">
            <option>SM</option>
            <option>MD</option>
            <option>LG</option>
          </select>
        </Field>
        <Field label="Logo URL" full>
          <input
            defaultValue="https://images.unsplash.com/photo-1556909114-44e3e70034e2"
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

function TeamPanel() {
  const team = [
    {
      name: "Lakshmi (Owner)",
      email: "admin@boutiqueakka.com",
      role: "Administrator",
    },
    { name: "Priya R.", email: "staff@boutiqueakka.com", role: "Sales Staff" },
    { name: "Anitha M.", email: "anitha@boutiqueakka.com", role: "Sales Staff" },
  ];
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Team</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Members with access to the dashboard.
      </p>
      <ul className="mt-6 divide-y divide-[hsl(var(--border))] border border-[hsl(var(--border))] rounded-xl">
        {team.map((m) => (
          <li key={m.email} className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-full bg-[hsl(var(--secondary))] grid place-items-center text-sm font-bold">
              {m.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                {m.email}
              </div>
            </div>
            <span className="text-xs font-semibold bg-[hsl(var(--secondary))] px-2 py-1 rounded-full">
              {m.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotificationsPanel() {
  const items = [
    { k: "Low stock alerts", d: "Email me when items drop below threshold" },
    { k: "Daily sales summary", d: "End-of-day report at 9:30 PM" },
    { k: "GST filing reminder", d: "Notify me 3 days before due date" },
  ];
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Notifications</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Choose what to be notified about.
      </p>
      <ul className="mt-6 space-y-2">
        {items.map((it, i) => (
          <li
            key={it.k}
            className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))]"
          >
            <div>
              <div className="font-semibold">{it.k}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                {it.d}
              </div>
            </div>
            <Toggle defaultOn={i !== 1} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={cn(
        "h-6 w-11 rounded-full relative transition",
        on ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--border))]"
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition",
          on && "translate-x-5"
        )}
      />
    </button>
  );
}
