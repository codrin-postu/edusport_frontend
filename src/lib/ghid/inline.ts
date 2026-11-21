// `**bold**` to <b>; anything else is literal text. Only React is imported.
import { createElement, type ReactNode } from "react";

export function renderInline(text: string): ReactNode[] {
  return text.split("**").map((part, i) => (i % 2 === 1 ? createElement("b", { key: i }, part) : part)).filter((p) => p !== "");
}
