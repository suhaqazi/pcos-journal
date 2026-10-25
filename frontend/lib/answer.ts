// Shape of Orchid's answers and a safe parser, shared by the ask page and history.

export interface AnswerData {
  summary: string;
  points: { heading: string; body: string }[];
  closing: string;
}

export function parseAnswer(raw: string): AnswerData | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// "  Why are my cycles SO irregular?? " -> "why are my cycles so irregular"
// Same rule as normalize() in the backend's suggested.py
export function normalizeQuestion(question: string): string {
    return question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
}