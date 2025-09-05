import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { corsPreflight, withCorsJson } from "../../_lib/cors";
import { globalCache } from "../../_lib/cache";

export const runtime = "nodejs";

async function ddg(query: string, signal: AbortSignal) {
  const cacheKey = `ddg:${query.toLowerCase()}`;
  const cached = globalCache.get(cacheKey);
  if (cached) return cached as string;
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "demo-agent" }, signal: controller.signal });
    const html = await res.text();
    const snippet = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 900);
    globalCache.set(cacheKey, snippet, 1000 * 60 * 5);
    return snippet;
  } finally {
    clearTimeout(timer);
  }
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const context = await ddg(query, req.signal);
  const client = getClient();
  if (!client) {
    return withCorsJson({ answer: context.slice(0, 500) });
  }
  const prompt = `Use the provided web snippets to write a concise, up-to-date answer. Include key facts and dates if present.\n\nQuery: ${query}\n\nSnippets: ${context}`;
  const resp = await client.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt,
  });
  const answer = (resp as any)?.text ?? context.slice(0, 500);
  return withCorsJson({ answer });
}

export async function OPTIONS() {
  return corsPreflight();
}


