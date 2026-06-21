import { timingSafeEqual } from "node:crypto";
import { syncAllInvestors } from "@/lib/sec/sync";

export const runtime = "nodejs";
export const maxDuration = 300;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || !authorization.startsWith("Bearer ")) return false;
  const supplied = authorization.slice(7);
  const left = Buffer.from(secret); const right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function handler(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try { const results = await syncAllInvestors(); return Response.json({ ok: true, source: "SEC EDGAR Form 13F", results }); }
  catch (error) { return Response.json({ ok: false, error: getErrorMessage(error) }, { status: 500 }); }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Unknown sync error";
}

export async function GET(request: Request) { return handler(request); }
export async function POST(request: Request) { return handler(request); }
