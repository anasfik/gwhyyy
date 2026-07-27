import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
          console.error("ADMIN_PASSWORD env variable is not set");
          return null;
        }
        if (credentials?.password === adminPassword) {
          return { id: "admin", name: "Admin", email: "admin@gwhyyy.com" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
