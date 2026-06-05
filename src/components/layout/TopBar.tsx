import { Bell, Search, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-[hsl(var(--background))]/85 backdrop-blur border-b border-[hsl(var(--border))]">
      <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-8 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl lg:text-[26px] font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-lg bg-white border border-[hsl(var(--border))] w-[300px]">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              placeholder="Search products, invoices, customers…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
            />
            <kbd className="hidden lg:inline text-[10px] font-medium text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
          {actions}
          <button className="grid place-items-center h-10 w-10 rounded-lg bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <HelpCircle className="h-[18px] w-[18px]" />
          </button>
          <button className="relative grid place-items-center h-10 w-10 rounded-lg bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
          </button>
          <div className="hidden md:flex items-center gap-2 pl-2">
            <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary))] text-white grid place-items-center text-sm font-semibold">
              {user?.name?.[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
