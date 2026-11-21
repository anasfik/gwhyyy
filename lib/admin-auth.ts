import crypto from "crypto";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (session) return true;

  const token = process.env.DASHBOARD_API_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  const supplied = header.slice(7).trim();
  if (!supplied) return false;
  return crypto.timingSafeEqual(
    crypto.createHash("sha256").update(supplied).digest(),
    crypto.createHash("sha256").update(token).digest()
  );
}
