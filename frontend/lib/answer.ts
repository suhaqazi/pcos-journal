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