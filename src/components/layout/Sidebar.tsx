import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  QrCode,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/barcode", label: "Barcode Printing", icon: QrCode },
  { to: "/gst", label: "GST Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <aside className="hidden md:flex md:w-[228px] xl:w-[252px] shrink-0 flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))]">
      <div className="px-4 xl:px-5 pt-5 pb-4 border-b border-[hsl(var(--sidebar-border))] shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] grid place-items-center font-display font-bold text-base">
            B
          </div>
          <div className="leading-tight min-w-0 whitespace-nowrap">
            <div className="font-display text-[15px] font-semibold text-white">
              BoutiqueOS
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--sidebar-foreground))]/60">
              Operations
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5 scrollbar-thin">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors whitespace-nowrap",
                isActive
                  ? "bg-[hsl(var(--sidebar-accent))] text-white"
                  : "text-[hsl(var(--sidebar-foreground))]/80 hover:bg-[hsl(var(--sidebar-accent))]/60 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <it.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive
                      ? "text-[hsl(var(--accent))]"
                      : "text-[hsl(var(--sidebar-foreground))]/60"
                  )}
                />
                <span className="font-medium truncate">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2.5 pb-4 pt-3 border-t border-[hsl(var(--sidebar-border))] shrink-0">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-[hsl(var(--sidebar-accent))] text-white grid place-items-center text-sm font-semibold">
            {user?.name?.[0] ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-white truncate">
              {user?.name}
            </div>
            <div className="text-[11px] text-[hsl(var(--sidebar-foreground))]/60 truncate">
              {user?.role === "admin" ? "Administrator" : "Sales Staff"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 grid place-items-center h-8 w-8 rounded-md text-[hsl(var(--sidebar-foreground))]/60 hover:text-white hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
