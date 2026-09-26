import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
          console.error("ADMIN_PASSWORD env variable is not set");
          return null;
        }
        const forwarded = request.headers?.["x-real-ip"] ?? request.headers?.["x-forwarded-for"] ?? "unknown";
        const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        const key = crypto.createHash("sha256").update(ip).digest("hex");
        if (isRateLimited(getDb(), `login:${key}`, 8, 15 * 60 * 1000)) return null;
        const supplied = crypto.createHash("sha256").update(credentials?.password ?? "").digest();
        const expected = crypto.createHash("sha256").update(adminPassword).digest();
        if (crypto.timingSafeEqual(supplied, expected)) {
          return { id: "admin", name: "Admin", email: "admin@gwhyyy.com" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.isAdmin = true;
      return token;
    },
    async session({ session, token }) {
      if (token.isAdmin) (session as unknown as Record<string, unknown>).isAdmin = true;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
