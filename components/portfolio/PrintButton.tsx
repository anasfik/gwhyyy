"use client";
export default function PrintButton() { return <button type="button" onClick={() => window.print()} className="border border-line px-4 py-3 text-sm hover:border-paper">Print / Save PDF</button>; }
