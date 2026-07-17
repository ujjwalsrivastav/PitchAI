import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, Activity, Languages, Radio, ShieldCheck, Sparkles } from "lucide-react";
import heroImg from "@/assets/stadium-hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground w-fit">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" />
            FIFA World Cup 2026 · Prototype
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold tracking-tight md:text-7xl">
            One AI for <span className="text-gradient-primary">every seat</span>,
            <br />
            and <span className="text-gradient-accent">every command post</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            PitchAI is a real-time generative-AI layer that helps fans navigate the venue in
            their language — and gives stadium operations a copilot for decisions that used
            to take five radios and a whiteboard.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/fan"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow neon-ring transition hover:brightness-110"
            >
              <MessageSquare className="h-4 w-4" />
              Open Fan Concierge
            </Link>
            <Link
              to="/ops"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-card"
            >
              <Activity className="h-4 w-4 text-accent" />
              Enter Ops Console
            </Link>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="glass-panel rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-2 font-display text-3xl font-semibold text-gradient-primary">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">Capabilities</div>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              Built for match day
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition hover:border-primary/50"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition group-hover:bg-primary/40" />
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const stats = [
  { label: "Languages", value: "40+", sub: "Real-time, in-chat translation" },
  { label: "Median reply", value: "1.4s", sub: "Streaming responses" },
  { label: "Decision loop", value: "−60%", sub: "Ops response vs. radio-only" },
];

const features = [
  {
    icon: MessageSquare,
    title: "AI Fan Concierge",
    body: "Wayfinding, food, restrooms, accessibility, match info — one chat, any language.",
  },
  {
    icon: Activity,
    title: "Ops Copilot",
    body: "Interprets crowd, weather, and incident telemetry into ranked next actions.",
  },
  {
    icon: Radio,
    title: "Instant PA & alerts",
    body: "Draft PA scripts and social posts in 40+ languages, tone-tuned per audience.",
  },
  {
    icon: Languages,
    title: "Multilingual by default",
    body: "Detects the fan's language and responds natively — no toggle, no menu.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-first guardrails",
    body: "Escalates medical, security, and evacuation situations to the on-duty commander.",
  },
  {
    icon: Sparkles,
    title: "Grounded in venue data",
    body: "Uses live sensor and schedule context — never invents metrics you did not provide.",
  },
];
