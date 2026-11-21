"use client";
export default function WorkspaceError({ reset }: { reset: () => void }) {
  return <div className="ws-page"><div className="ws-empty"><h1>This page could not load</h1><p>Try loading it again. No action was automatically retried.</p><div className="ws-actions"><button className="ws-button ws-primary" onClick={reset}>Try again</button><a className="ws-button" href="/dashboard">Back to Today</a></div></div></div>;
}
