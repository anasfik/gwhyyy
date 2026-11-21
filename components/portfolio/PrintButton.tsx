"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="border border-line bg-white px-4 py-3 text-sm hover:border-ink">
      Print / Save PDF
    </button>
  );
}
