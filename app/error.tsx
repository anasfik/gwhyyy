"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-dvh items-center bg-paper px-5">
      <div className="mx-auto w-full max-w-3xl border border-line bg-raised p-8 md:p-12">
        <p className="label text-danger">Error</p>
        <h1 className="display mt-5 text-4xl font-semibold md:text-5xl">The request failed safely.</h1>
        <p className="mt-4 max-w-xl leading-7 text-muted">No inquiry data was discarded. Retry the request, or return to the homepage if the problem continues.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">Try again</button>
          <Link href="/" className="inline-flex min-h-12 items-center border border-line px-6 text-sm font-medium hover:border-ink">Return home</Link>
        </div>
      </div>
    </main>
  );
}
