import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat-window";

export const Route = createFileRoute("/fan")({
  head: () => ({
    meta: [
      { title: "Fan Concierge — PitchAI" },
      {
        name: "description",
        content:
          "Ask anything about the venue, your seat, food, transit or the match. Multilingual, real-time.",
      },
    ],
  }),
  component: FanPage,
});

const suggestions = [
  "Where's the nearest restroom to Section 214?",
  "Halal food options close to Gate C?",
  "¿A qué hora empieza el partido y quién es el árbitro?",
  "Best exit after the match if I'm in the upper bowl?",
];

function FanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary">Fan Concierge</div>
        <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
          Your stadium, in your language.
        </h1>
      </div>
      <ChatWindow
        mode="fan"
        greeting="¡Bienvenido! Welcome to Estadio Azteca."
        placeholder="Ask about your seat, food, restrooms, the match…"
        suggestions={suggestions}
      />
    </div>
  );
}
