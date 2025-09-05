import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { corsPreflight, withCorsJson } from "../_lib/cors";

export const runtime = "nodejs";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

export async function POST(req: NextRequest) {
  const { prompt, input } = await req.json();
  const client = getClient();
  if (!client) {
    // Fallback: simple deterministic rules as demo
    const out = `${input}`.replace(/\s+/g, " ").trim();
    return withCorsJson({ output: out });
  }
  const instruction = `You are a helpful writing assistant. Edit the user's selection according to the instruction. Output only the edited text.`;
  const content = `Instruction: ${prompt}\n\nSelection:\n${input}`;
  const resp = await client.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: `${instruction}\n\n${content}`,
  });
  const output = (resp as any)?.text ?? input;
  return withCorsJson({ output });
}

export async function OPTIONS() {
  return corsPreflight();
}


