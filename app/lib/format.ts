export function formatDate(
  iso?: string,
  month: "long" | "short" = "long",
): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}

type LexicalNode = { text?: string; children?: LexicalNode[] };

function collectText(node: LexicalNode): string {
  if (node.text) return node.text;
  return (node.children ?? []).map(collectText).join(" ");
}

export function readingMinutes(data: unknown): number {
  const root = (data as { root?: LexicalNode })?.root;
  if (!root) return 1;
  const words = collectText(root).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
