import { NetshPivot } from "@/app/hooks/useNetshPivot";
import { PivotCommands } from "@/app/types/tool";

export function resolvePivotCommands(pivot: NetshPivot): PivotCommands {
  const cmds: PivotCommands = { attacker: [], target: [] };
  let step = 1;

  const listenIP = pivot.listenIP?.trim() ? pivot.listenIP : "0.0.0.0";
  const connectIP = pivot.connectIP?.trim() ? pivot.connectIP : "<CONNECT_IP>";

  // Step 1: Add portproxy rule
  cmds.attacker.push({
    step: step++,
    command: `netsh interface portproxy add ${pivot.protocol} listenaddress=${listenIP} listenport=${pivot.listenPort} connectaddress=${connectIP} connectport=${pivot.connectPort}`,
  });

  // Step 2: Verify rule was added
  cmds.attacker.push({
    step: step++,
    command: `netsh interface portproxy show all`,
  });

  // Step 3: Add firewall rule to allow inbound traffic
  cmds.attacker.push({
    step: step++,
    command: `netsh advfirewall firewall add rule name="PivotKit-${pivot.listenPort}" protocol=TCP dir=in localport=${pivot.listenPort} action=allow`,
  });

  // Step 4: Cleanup — delete the rule when done
  cmds.attacker.push({
    step: step++,
    command: `# Cleanup: netsh interface portproxy delete ${pivot.protocol} listenaddress=${listenIP} listenport=${pivot.listenPort}`,
  });

  return cmds;
}
