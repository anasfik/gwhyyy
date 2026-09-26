"use client";


type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function label(path: string[]) {
  return path[path.length - 1] ?? "";
}

function blankLike(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blankLike(v)]));
  return "";
}

export function setAtPath<T>(source: T, path: (string | number)[], value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (typeof head === "number") {
    const list = (source as unknown[]).slice();
    list[head] = setAtPath(list[head], rest, value);
    return list as unknown as T;
  }
  const next: Json = { ...(source as Json) };
  next[head] = setAtPath(next[head], rest, value);
  return next as unknown as T;
}

/**
 * Renders any JSON-shaped content object as labelled inputs. New copy fields added to
 * config/site.ts become editable here automatically — no per-field UI to maintain.
 */
export default function CopyFields({ value, path = [], onChange, depth = 0 }: { value: unknown; path?: (string | number)[]; onChange: (next: unknown) => void; depth?: number }) {
  const emit = (next: unknown) => onChange(setAtPath(value, path, next));

  if (typeof value === "string") {
    const long = value.length > 70;
    return (
      <Field label={label(path.map(String))} hint={path.map(String).join(" › ")}>
        {long ? (
          <textarea rows={3} value={value} onChange={(e) => emit(e.target.value)} />
        ) : (
          <input value={value} onChange={(e) => emit(e.target.value)} />
        )}
      </Field>
    );
  }

  if (typeof value === "number") {
    return <Field label={label(path.map(String))} hint={path.map(String).join(" › ")}><input type="number" value={value} onChange={(e) => emit(Number(e.target.value) || 0)} /></Field>;
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5" checked={value} onChange={(e) => emit(e.target.checked)} />
        <span>{label(path.map(String))}</span>
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.1em] text-secondary">{label(path.map(String))} ({value.length})</span>
          <button type="button" onClick={() => emit([...value, blankLike(value[0] ?? "")])} className="border border-outline-variant px-3 py-1 text-[11px] uppercase tracking-widest">Add</button>
        </div>
        {value.length === 0 && <p className="text-xs text-secondary">Empty list.</p>}
        {value.map((item, index) => (
          <div key={index} className="border-l-2 border-outline-variant pl-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-secondary">#{index + 1}</span>
              <button type="button" onClick={() => emit(value.filter((_, i) => i !== index))} className="text-[11px] uppercase tracking-widest text-error">Remove</button>
            </div>
            <CopyFields value={item} path={[...path, index]} onChange={(next) => emit(value.map((v, i) => (i === index ? next : v)))} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className="grid gap-3">
        {Object.entries(value).map(([key, child]) => (
          <CopyFields key={key} value={child} path={[...path, key]} onChange={(next) => onChange(setAtPath(value, path, { ...value, [key]: next }))} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return <p className="text-xs text-secondary">Unsupported value at {path.join(" › ") || "root"}</p>;
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactElement }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-[11px] uppercase tracking-[0.1em] text-secondary">
        {label}
        {hint.includes("›") && <span className="ml-2 font-mono normal-case text-[10px] opacity-70">{hint}</span>}
      </span>
      <span className="[&_input]:min-h-11 [&_input]:w-full [&_input]:border [&_input]:border-outline-variant [&_input]:bg-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-outline-variant [&_textarea]:bg-surface [&_textarea]:p-3 [&_textarea]:text-sm">{children}</span>
    </label>
  );
}
