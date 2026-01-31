export function render(template: string, ctx: Record<string, string | number>) {
  return template.replace(/{{(\w+)}}/g, (_, k) => String(ctx[k] ?? ""));
}

export function plane(cmd: string): "attacker" | "target" {
  return cmd === "agent" ? "target" : "attacker";
}