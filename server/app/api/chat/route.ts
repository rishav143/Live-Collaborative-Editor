import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { corsPreflight, withCorsJson } from "../_lib/cors";

export const runtime = "nodejs";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const client = getClient();
  if (!client) {
    const last = messages?.[messages.length - 1]?.content ?? "";
    return withCorsJson({ output: `Echo: ${last}` });
  }
  const prompt = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
  const resp = await client.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt,
  });
  const output = (resp as any)?.text ?? "";
  return withCorsJson({ output });
}

export async function OPTIONS() {
  return corsPreflight();
}


