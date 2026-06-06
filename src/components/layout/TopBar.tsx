import { Bell, Search, HelpCircle, Maximize2, Minimize2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFullscreen } from "@/hooks/useFullscreen";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user } = useAuth();
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <header className="sticky top-0 z-20 bg-[hsl(var(--background))]/85 backdrop-blur border-b border-[hsl(var(--border))]">
      <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-7 py-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl lg:text-[24px] font-semibold tracking-tight truncate">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 truncate">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
          <div className="hidden xl:flex items-center gap-2 px-3 h-10 rounded-lg bg-white border border-[hsl(var(--border))] w-[260px] shrink-0">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" />
            <input
              placeholder="Search products, invoices…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))] min-w-0"
            />
            <kbd className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] rounded px-1.5 py-0.5 shrink-0">
              ⌘K
            </kbd>
          </div>
          {actions}
          <button
            onClick={toggle}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="grid place-items-center h-10 w-10 rounded-lg bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]/30 transition shrink-0"
          >
            {isFullscreen ? (
              <Minimize2 className="h-[18px] w-[18px]" />
            ) : (
              <Maximize2 className="h-[18px] w-[18px]" />
            )}
          </button>
          <button className="hidden sm:grid place-items-center h-10 w-10 rounded-lg bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] shrink-0">
            <HelpCircle className="h-[18px] w-[18px]" />
          </button>
          <button className="relative grid place-items-center h-10 w-10 rounded-lg bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] shrink-0">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
          </button>
          <div className="hidden md:flex items-center gap-2 pl-1 shrink-0">
            <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary))] text-white grid place-items-center text-sm font-semibold">
              {user?.name?.[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
