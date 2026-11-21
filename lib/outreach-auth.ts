import crypto from "crypto";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export function mcpEnabled() {
  return Boolean(process.env.OUTREACH_API_TOKEN);
}

export async function isOutreachAuthorized(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (session) return true;

  const tokens = [process.env.OUTREACH_API_TOKEN, process.env.DASHBOARD_API_TOKEN].filter(Boolean) as string[];
  if (tokens.length === 0) return false;
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  const supplied = header.slice(7).trim();
  if (!supplied) return false;

  // Hash first so timingSafeEqual gets equal-length buffers.
  const suppliedHash = crypto.createHash("sha256").update(supplied).digest();
  return tokens.some((token) => crypto.timingSafeEqual(suppliedHash, crypto.createHash("sha256").update(token).digest()));
}
