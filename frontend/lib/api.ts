import { AnswerData, parseAnswer } from "@/lib/answer";
import { supabase } from "@/lib/supabase";

// Where the backend lives. Set NEXT_PUBLIC_API_URL in .env.local
// (and in Vercel when deployed); falls back to the local backend.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AskResult {
  ok: boolean; // false = a friendly notice, not a real answer (don't save it)
  answer: AnswerData;
  sources: string[];
  remaining?: number | null; // questions left today, when the backend knows
}

// Builds an answer-shaped message, so errors show on the answer paper
function notice(summary: string, body: string): AskResult {
  return {
    ok: false,
    answer: {
      summary,
      points: [{ heading: "What you can do", body }],
      closing: "Thank you for your patience.",
    },
    sources: [],
  };
}

export async function askOrchid(question: string): Promise<AskResult> {
  // Signed-in users send their login token, so the backend can give them
  // the bigger daily allowance. Guests send nothing.
  const { data: auth } = await supabase.auth.getSession();
  const token = auth.session?.access_token;

  let res: Response;
  try {
    res = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ question }),
    });
  } catch {
    // The request never reached the server (offline, server down)
    return notice(
      "We couldn't reach Orchid.",
      "Please check your internet connection and try again."
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // The backend sends a friendly message in `detail` for 400, 429 and 503
    const message = typeof data?.detail === "string" ? data.detail : null;

    if (res.status === 429) {
      return notice(message ?? "You've reached your question limit.", "Come back a little later and ask again.");
    }
    if (res.status === 503) {
      return notice(message ?? "Orchid is resting right now.", "Please try again in a little while.");
    }
    return notice(message ?? "Something went wrong.", "Please try again in a moment.");
  }

  const answer = data ? parseAnswer(data.answer) : null;
  if (!answer) {
    return notice("Something went wrong.", "Please try asking your question again.");
  }

  return { ok: true, answer, sources: data.sources ?? [], remaining: data.remaining };
}