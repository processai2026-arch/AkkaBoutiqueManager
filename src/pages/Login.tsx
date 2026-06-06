import { FormEvent, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
  Receipt,
  QrCode,
} from "lucide-react";
import { login } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("admin@boutiqueos.com");
  const [password, setPassword] = useState("demo123");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const u = login(email, password);
      if (!u) {
        setError("Invalid credentials. Use the demo login above.");
        setLoading(false);
        return;
      }
      setUser(u);
      navigate("/dashboard", { replace: true });
    }, 380);
  }

  function fillDemo() {
    setEmail("admin@boutiqueos.com");
    setPassword("demo123");
    setError("");
  }

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:flex-1 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-12 py-12 flex-col justify-between relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-[hsl(var(--accent))]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] grid place-items-center font-display font-bold text-xl">
              B
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">
                BoutiqueOS
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                Operations Suite
              </div>
            </div>
          </Link>
        </div>

        <div className="relative max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">
            <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
            Premium boutique POS
          </div>
          <h2 className="font-display text-[42px] leading-[1.1] font-semibold tracking-tight mt-5">
            Run your boutique like a flagship brand.
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed text-[15px]">
            Generate bills in 30 seconds, manage 1,200+ SKUs, print barcode
            labels, and file GST — all from one elegant dashboard.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Zap, label: "30s billing" },
              { icon: Receipt, label: "GST ready" },
              { icon: QrCode, label: "Barcode print" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-xl bg-white/[0.04] border border-white/10 p-3"
              >
                <Icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                <div className="mt-3 text-[13px] font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/50">
          © {new Date().getFullYear()} BoutiqueOS · Crafted for India.
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 lg:max-w-[520px] flex flex-col px-6 sm:px-10 lg:px-12 py-10">
        <Link to="/" className="lg:hidden flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-[hsl(var(--primary))] text-white grid place-items-center font-display font-bold">
            B
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold">BoutiqueOS</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Operations
            </div>
          </div>
        </Link>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
              <span className="font-medium">Demo Build</span>
              <span className="text-[hsl(var(--muted-foreground))]">v1.0</span>
            </div>

            <h1 className="font-display text-[34px] sm:text-[40px] font-semibold tracking-tight mt-5 leading-tight">
              Welcome back.
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mt-2">
              Sign in to your boutique dashboard.
            </p>

            <button
              type="button"
              onClick={fillDemo}
              className="mt-6 w-full text-left rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/40 hover:bg-[hsl(var(--secondary))]/70 px-4 py-3 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[hsl(var(--accent))]">
                  Demo Login
                </span>
                <span className="text-[11px] text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]">
                  Click to autofill →
                </span>
              </div>
              <div className="font-mono text-sm mt-1 font-semibold">
                admin@boutiqueos.com
              </div>
              <div className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
                Password: demo123
              </div>
            </button>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5">
                  Email
                </label>
                <div className="flex items-center gap-2 px-3 h-12 rounded-xl bg-white border border-[hsl(var(--border))] focus-within:ring-2 focus-within:ring-[hsl(var(--ring))]/15 focus-within:border-[hsl(var(--ring))] transition">
                  <Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none min-w-0"
                    placeholder="you@boutiqueos.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5">
                  Password
                </label>
                <div className="flex items-center gap-2 px-3 h-12 rounded-xl bg-white border border-[hsl(var(--border))] focus-within:ring-2 focus-within:ring-[hsl(var(--ring))]/15 focus-within:border-[hsl(var(--ring))] transition">
                  <Lock className="h-4 w-4 text-[hsl(var(--muted-foreground))] shrink-0" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none min-w-0"
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] shrink-0"
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="text-sm text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in to dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] justify-center pt-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure demo session · No real data stored
              </div>
            </form>
          </div>
        </div>

        <div className="text-xs text-[hsl(var(--muted-foreground))] pt-6 text-center lg:text-left">
          © {new Date().getFullYear()} BoutiqueOS
        </div>
      </div>
    </div>
  );
}
