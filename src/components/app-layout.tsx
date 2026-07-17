import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/pitchai-logo.png";

export function AppLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: "Home" },
    { to: "/fan", label: "Fan Concierge" },
    { to: "/ops", label: "Ops Console" },
  ] as const;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="" width={36} height={36} className="rounded-lg" />
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold tracking-tight">
                Pitch<span className="text-gradient-primary">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                FIFA World Cup 2026 · Stadium OS
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1 md:flex">
            {nav.map((n) => {
              const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Live · Estadio Azteca</span>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        PitchAI · Prototype for FIFA World Cup 2026 stadium operations
      </footer>
    </div>
  );
}
