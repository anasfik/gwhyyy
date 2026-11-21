"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCallback = searchParams.get("callbackUrl");
  const callbackUrl = requestedCallback && /^\/dashboard(?:[/?]|$)/.test(requestedCallback) ? requestedCallback : "/dashboard";
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const result = await signIn("credentials", { password, redirect: false });
      if (result?.ok) { router.push(callbackUrl); return; }
      setError(true);
    } catch { setError(true); }
    setLoading(false);
  };

  return (
    <main id="main" className="ws-login">
      <div className="w-full max-w-sm">
        <div className="mb-8"><p className="ws-login-brand">gwhyyy</p><h1>Your workspace</h1><p className="ws-muted mt-3">Sign in to manage inquiries, email and your website.</p></div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-password" className="font-sans text-[12px] uppercase tracking-[0.05em] text-secondary">
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               required
               autoComplete="current-password"
               disabled={loading}
              autoFocus
              className="border border-outline-variant bg-transparent p-4 focus:border-signal font-sans text-[16px] transition-colors"
              placeholder="Enter password"
            />
          </div>
          {error && (
            <p role="alert" className="font-mono text-[12px] text-error uppercase tracking-[0.05em]">
               Sign in failed. Check your password and try again.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
             className="ws-button ws-primary"
          >
             {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="mt-8 border-t border-outline-variant pt-6">
          <Link href="/" className="font-sans text-[12px] uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">
             Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <LoginForm />
    </Suspense>
  );
}
