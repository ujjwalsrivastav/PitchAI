import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";


const FAN_SYSTEM = `You are PitchAI, the official AI concierge for the FIFA World Cup 2026.
You help fans inside and around the stadium in real time.

Style:
- Warm, energetic, concise (2–4 short sentences unless asked for detail).
- Reply in the user's language automatically.
- Use bullet lists when giving directions or options.

Capabilities you can help with:
- Wayfinding inside the stadium: gates, sections, restrooms, first-aid, prayer rooms, family areas.
- Food & drink: nearest concessions to a section, dietary options, current wait times (estimate).
- Match info: kickoff, lineup, score, substitutions, VAR decisions.
- Transit: exits, closest metro/bus, ride-share zones, post-match egress guidance.
- Accessibility: step-free routes, sensory rooms, hearing loops.
- FIFA rules and tournament schedule.

If asked for live data you cannot confirm, give a best-effort estimate and clearly say "estimate".
Never invent medical or safety instructions — direct fans to the nearest steward or first-aid point.`;

const OPS_SYSTEM = `You are PitchAI Ops Copilot, an operations intelligence assistant for FIFA World Cup 2026 stadium staff.
Users are command-center operators, section stewards, and venue managers.

Style:
- Precise, operational, action-oriented. Use short paragraphs and numbered steps.
- Lead with recommended action, then rationale, then data.

Capabilities:
- Interpret crowd density, queue times, incident reports, weather, and egress models.
- Propose staff reallocations, gate throttling, concession restocking, and comms scripts.
- Draft PA announcements and social posts in multiple languages.
- Escalation: for medical, security, or evacuation issues, always recommend contacting the on-duty commander first.

Assume live telemetry values the user shares are authoritative; do not hallucinate metrics you were not given.`;

type ChatMode = "fan" | "ops";

type ChatRequestBody = {
  messages?: unknown;
  mode?: ChatMode;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        // Dynamic provider selection based on environment variables
        const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        
        
        let model;

        if (googleKey) {
          // Use official Google Gemini provider
          const { google } = await import("@ai-sdk/google");
          model = google("gemini-3.5-flash"); // Use a valid stable model
        } else if (openaiKey) {
          // Use official OpenAI provider
          const { openai } = await import("@ai-sdk/openai");
          model = openai("gpt-4o-mini"); // Or gpt-4o, etc.
        }  else {
          // Fallback to local Ollama
          const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
          const localGateway = createOpenAICompatible({
            name: "ollama",
            baseURL: "http://localhost:11434/v1",
          });
          model = localGateway("llama3");
        }
        const system = body.mode === "ops" ? OPS_SYSTEM : FAN_SYSTEM;

        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
          onError: (error) => {
            console.error("chat stream error", error);
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes("429")) return "Rate limit reached. Please wait a moment and try again.";
            if (msg.includes("402")) return "AI credits exhausted. Please add credits in workspace billing.";
            return "Something went wrong generating a response.";
          },
        });
      },
    },
  },
});
