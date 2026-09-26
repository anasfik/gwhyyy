"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main" className="flex min-h-dvh items-center bg-ink px-4"><div className="mx-auto w-full max-w-3xl border border-line bg-panel p-8 md:p-12"><p className="label text-error">SYSTEM / ERROR</p><h1 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">Request failed safely.</h1><p className="mt-5 max-w-xl leading-7 text-muted">No data was lost. Retry the request, or return to the homepage if the problem continues.</p><div className="mt-9 flex flex-wrap gap-3"><button type="button" onClick={reset} className="bg-signal px-6 py-4 text-sm font-semibold uppercase tracking-wider text-ink">Try again</button><Link href="/" className="border border-line px-6 py-4 text-sm uppercase tracking-wider">Return home</Link></div></div></main>;
}
