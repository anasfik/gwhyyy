export default function Monogram({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex aspect-square flex-col justify-between border border-line bg-white ${compact ? "w-28 p-2.5" : "w-40 p-3 md:w-52 md:p-4"}`}
      aria-label="Mohamed Anas Fikhi monogram"
    >
      <span className="label text-muted">{compact ? "GWHYYY" : "GWHYYY / MAF"}</span>
      <span className={`font-semibold tracking-[-.07em] ${compact ? "text-3xl" : "text-5xl"}`}>MAF</span>
      <span className="label text-muted">{compact ? "2026" : "Casablanca"}</span>
    </div>
  );
}
