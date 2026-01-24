// ligolo-ng/CommandResolver.ts
import { LigoloPivot } from "@/app/hooks/usePivotChain";
import { PivotCommands } from "./Types";

/* ---------------- Command Templates ---------------- */

const commandTemplates: Record<string, string> = {
  tun: "ip tuntap add user $(whoami) mode tun {{tun_name}}",
  route: "ip route add {{network}}/{{cidr}} dev {{tun_name}}",
  proxy: "./ligolo-proxy -selfcert -laddr {{attackerBindIP}}:{{attackerPort}}",
  agent: "./ligolo-agent -connect {{targetIP}}:{{targetPort}} -ignore-cert",
  session: "ligolo-ng session",
  startTun: "start --tun {{tun_name}}",
  listener:
    "listener_add --addr 0.0.0.0:{{listener_port}} --to 127.0.0.1:{{prev_port}} --tcp",
};

/* ---------------- Execution Sequences ---------------- */

const BASE_SEQUENCE = [
  "tun",
  "route",
  "proxy",
  "agent",
  "session",
  "startTun",
] as const;

const sequences: Record<"entry" | "relay", readonly string[]> = {
  entry: BASE_SEQUENCE,
  relay: ["listener", ...BASE_SEQUENCE],
};

/* ---------------- Helpers ---------------- */

function render(template: string, ctx: Record<string, string | number>) {
  return template.replace(/{{(\w+)}}/g, (_, k) =>
    ctx[k] !== undefined ? String(ctx[k]) : ""
  );
}

function commandPlane(cmd: string): "attacker" | "proxy" | "target" {
  switch (cmd) {
    case "agent":
      return "target";
    case "listener":
    case "session":
    case "startTun":
      return "proxy";
    default:
      return "attacker";
  }
}

/* ---------------- Resolver ---------------- */

export function resolvePivotCommands(
  pivots: LigoloPivot[]
): PivotCommands[] {
  let globalStep = 1;

  return pivots.map((pivot, idx) => {
    const tun_name = `ligolo${idx + 1}`;
    const prev = idx > 0 ? pivots[idx - 1] : undefined;

    const ctx: Record<string, string | number> = {
      tun_name,
      network: pivot.network,
      cidr: pivot.cidr,
      attackerBindIP: pivot.attackerBindIP,
      attackerPort: pivot.attackerPort,
      targetIP: pivot.targetIP ?? pivot.attackerBindIP,
      targetPort: pivot.targetPort ?? pivot.attackerPort,
      listener_port: pivot.attackerPort,
      prev_port: prev?.attackerPort ?? "",
    };

    const result: PivotCommands = {
      attacker: [],
      proxy: [],
      target: [],
    };

    for (const cmdKey of sequences[pivot.role]) {
      const plane = commandPlane(cmdKey);
      const rendered = render(commandTemplates[cmdKey], ctx);

      result[plane].push({
        step: globalStep++,
        command: rendered,
      });
    }

    return result;
  });
}
