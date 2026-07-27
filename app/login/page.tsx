"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard/messages";
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const result = await signIn("credentials", { password, redirect: false });
    if (result?.ok) {
      router.push(callbackUrl);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12">
          <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.03em] text-primary mb-2">
            GWHYYY
          </div>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.15em] text-secondary">
            ADMIN_ACCESS
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="border border-outline-variant bg-transparent p-4 focus:outline-none focus:border-primary font-[family-name:var(--font-inter)] text-[16px] transition-colors"
              placeholder="Enter password"
            />
          </div>
          {error && (
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-error uppercase tracking-[0.05em]">
              ACCESS_DENIED: Invalid credentials.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] py-5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        <div className="mt-8 border-t border-outline-variant pt-6">
          <a href="/" className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <LoginForm />
    </Suspense>
  );
}
