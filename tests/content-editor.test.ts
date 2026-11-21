import test from "node:test";
import assert from "node:assert/strict";
import { isValidElement, type ReactNode, type ReactElement } from "react";
import CopyFields from "../components/dashboard/CopyFields";

type Props = { value?: unknown; onChange?: (event: { target: { value: string } }) => void; onClick?: () => void; children?: ReactNode };
function control(node: ReactNode, value: string): ReactElement<Props> | undefined {
  if (Array.isArray(node)) { for (const child of node) { const result = control(child,value); if (result) return result; } return; }
  if (!isValidElement<Props>(node)) return;
  if (typeof node.type === "function") return control((node.type as (p: Props) => ReactNode)(node.props),value);
  if ((node.type === "input" || node.type === "textarea") && node.props.value === value) return node;
  if (node.type === "button" && node.props.children === value) return node;
  return control(node.props.children,value);
}
test("nested copy edits replace only a leaf, never duplicate ancestor paths", () => {
  const original = { brand: { name: "Before", signature: "Unchanged" }, nav: { links: [{ label: "Work", href: "/work" }] } };
  let next: unknown;
  const tree = CopyFields({ value: original, onChange: value => { next = value; } });
  const input = control(tree,"Before"); assert.ok(input);
  input.props.onChange?.({ target: { value: "After" } });
  assert.deepEqual(next,{ ...original, brand: { name: "After", signature: "Unchanged" } });
});
test("empty case-study arrays add the declared item shape", () => {
  const template = { title: "", body: [""] };
  let next: unknown;
  const tree = CopyFields({ value: [], itemTemplate: template, onChange: value => { next = value; } });
  control(tree, "Add")?.props.onClick?.();
  assert.deepEqual(next, [template]);
});
test("copy array edits preserve sibling fields and item types", () => {
  const original = { nav: { links: [{ label: "Work", href: "/work" },{ label: "Contact", href: "/contact" }] } };
  let next: unknown;
  const tree = CopyFields({ value: original, onChange: value => { next = value; } });
  const input = control(tree,"Work"); assert.ok(input);
  input.props.onChange?.({ target: { value: "Projects" } });
  assert.deepEqual(next,{ nav: { links: [{ label: "Projects", href: "/work" }, original.nav.links[1]] } });
});
