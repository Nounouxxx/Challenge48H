const BASE = "/api";

export interface ApiResult {
  success?: string;
  error?: string;
}

/** Vérifie la réponse d'une énigme individuelle (id: 1-4) */
export async function checkEnigmaAnswer(
  id: number,
  input: string
): Promise<ApiResult> {
  const res = await fetch(`${BASE}/enigma/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, input }),
  });
  return res.json();
}

/** Vérifie la réponse finale (le mot DIJKSTRA) */
export async function checkFinalAnswer(input: string): Promise<ApiResult> {
  const res = await fetch(`${BASE}/enigma/resolveFinal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  return res.json();
}
