import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <div className="font-display text-7xl font-semibold tracking-tight">
          404
        </div>
        <p className="text-[hsl(var(--muted-foreground))] mt-2">
          We couldn't find the page you were looking for.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center mt-6 h-10 px-5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
