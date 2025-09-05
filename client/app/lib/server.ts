declare const process: any;
export function getServerUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.replace(/\/$/, "");
  // Fallback for production demo
  return "https://live-collaborative-editor-hrt4.onrender.com";
}

export async function postJson<T>(endpoint: string, body: unknown, options?: { timeoutMs?: number }): Promise<T> {
  const baseUrl = getServerUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 12000);
  try {
    const res = await fetch(baseUrl + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await safeText(res);
      throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err?.name === "AbortError") throw new Error("Request timed out. Please try again.");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}


