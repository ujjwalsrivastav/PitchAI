import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Users, Utensils, Wind } from "lucide-react";
import { ChatWindow } from "@/components/chat-window";

export const Route = createFileRoute("/ops")({
  head: () => ({
    meta: [
      { title: "Ops Console — PitchAI" },
      {
        name: "description",
        content:
          "Real-time stadium operations copilot. Live telemetry, incidents, and AI-suggested actions.",
      },
    ],
  }),
  component: OpsPage,
});

type Metric = { label: string; value: string; sub: string; tone: "ok" | "warn" | "crit"; icon: typeof Users };

function OpsPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const metrics = useMetrics(tick);
  const incidents = useIncidents(tick);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent">Ops Console</div>
          <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
            Match Command · MEX vs. ARG
          </h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Kickoff in 00:47:22 · Attendance 82,140 / 87,000
          </div>
        </div>
        <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-xs">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-primary" />
          Live telemetry · updated {tick}s ago
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {m.label}
                  </div>
                  <m.icon
                    className={
                      m.tone === "crit"
                        ? "h-4 w-4 text-destructive"
                        : m.tone === "warn"
                          ? "h-4 w-4 text-accent"
                          : "h-4 w-4 text-primary"
                    }
                  />
                </div>
                <div className="mt-2 font-display text-2xl font-semibold">{m.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{m.sub}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Active incidents</div>
              <span className="text-xs text-muted-foreground">{incidents.length} open</span>
            </div>
            <ul className="space-y-2">
              {incidents.map((i) => (
                <li
                  key={i.id}
                  className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3"
                >
                  <AlertTriangle
                    className={
                      i.severity === "high"
                        ? "mt-0.5 h-4 w-4 shrink-0 text-destructive"
                        : "mt-0.5 h-4 w-4 shrink-0 text-accent"
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{i.title}</div>
                    <div className="text-xs text-muted-foreground">{i.detail}</div>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {i.severity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ChatWindow
          mode="ops"
          greeting="Ops Copilot ready."
          placeholder="Ask for a reallocation, draft a PA, or query telemetry…"
          suggestions={[
            "Gate C queue is 14 minutes — recommend a mitigation plan.",
            "Draft a bilingual PA for a 5-minute concession delay in Sector 3.",
            "Predict egress bottlenecks if we open Ramp B early.",
            "Weather cell in 30 min — what should I brief the safety officer?",
          ]}
        />
      </div>
    </div>
  );
}

function useMetrics(tick: number): Metric[] {
  const jitter = (base: number, spread: number) =>
    Math.round(base + Math.sin(tick / 2 + base) * spread);
  return [
    {
      label: "Crowd density",
      value: `${jitter(78, 6)}%`,
      sub: "Concourse avg",
      tone: "warn",
      icon: Users,
    },
    {
      label: "Gate C queue",
      value: `${jitter(12, 3)} min`,
      sub: "Above 10 min threshold",
      tone: "warn",
      icon: Activity,
    },
    {
      label: "Concessions",
      value: `${jitter(92, 4)}%`,
      sub: "Stock across venue",
      tone: "ok",
      icon: Utensils,
    },
    {
      label: "Wind",
      value: `${jitter(18, 4)} km/h`,
      sub: "Gusts 32 · N-NE",
      tone: "ok",
      icon: Wind,
    },
  ];
}

function useIncidents(tick: number) {
  const base = [
    {
      id: "INC-1042",
      title: "Medical assist · Sector 108, Row 22",
      detail: "First-aid on scene · ETA paramedics 2 min",
      severity: "high" as const,
    },
    {
      id: "INC-1043",
      title: "Queue overflow · Gate C",
      detail: "Estimated wait 14 min — consider opening Gate D-2",
      severity: "medium" as const,
    },
    {
      id: "INC-1044",
      title: "Lost child reunited · Guest Services",
      detail: "Case closed at 19:42",
      severity: "medium" as const,
    },
  ];
  return tick % 5 < 3 ? base : base.slice(0, 2);
}
