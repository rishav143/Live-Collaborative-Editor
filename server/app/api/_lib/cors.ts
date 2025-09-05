import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ALLOWED_ORIGIN = "*";

export function corsHeaders() {
  const origin = process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function withCorsJson(body: any, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  const headers = corsHeaders();
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function corsPreflight() {
  const res = new NextResponse(null, { status: 204 });
  const headers = corsHeaders();
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}


