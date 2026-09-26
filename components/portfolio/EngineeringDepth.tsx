import { getSiteContent } from "@/lib/site-content";

export default function EngineeringDepth() {
  const { aiReliability, stackGroups, copy } = getSiteContent();
  return (
    <section className="border-b border-line" id="stack" aria-labelledby="depth-title">
      <div className="shell grid lg:grid-cols-2">
        <div className="section border-line lg:border-r lg:pr-14">
          <p className="label mb-5 text-signal">{copy.stack.eyebrow}</p>
          <h2 id="depth-title" className="text-balance text-4xl font-semibold tracking-[-.055em] md:text-5xl">{copy.stack.heading}</h2>
          <p className="mt-6 max-w-xl leading-7 text-muted">{copy.stack.body}</p>
          <div className="mt-10 grid grid-cols-2 gap-px bg-line">
            {aiReliability.map((item, index) => <div key={item} className="bg-ink p-4"><span className="label text-muted">R{index + 1}</span><p className="mt-3 text-sm leading-5">{item}</p></div>)}
          </div>
        </div>
        <div className="section lg:pl-14">
          <h2 className="text-3xl font-semibold tracking-[-.045em]">{copy.stack.toolsHeading}</h2>
          <div className="mt-10 space-y-8">
            {stackGroups.map((group) => <div key={group.label} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[140px_1fr]"><h3 className="label text-signal">{group.label}</h3><p className="text-sm leading-7 text-muted">{group.items.join(" · ")}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
