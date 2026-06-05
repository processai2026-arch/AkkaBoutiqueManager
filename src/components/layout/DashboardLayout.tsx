import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import DemoBanner from "./DemoBanner";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[hsl(var(--background))]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DemoBanner />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scrollbar-thin">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
