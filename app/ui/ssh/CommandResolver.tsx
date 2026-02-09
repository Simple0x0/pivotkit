
import { SSHPivot } from "@/app/hooks/useSSHPivot";
import { PivotCommands } from "@/app/types/tool";

/*
    resolvePivotCommands
    - Accepts a single SSHPivot and returns attacker/target command steps
    - Modes supported: local (-L), remote (-R), dynamic (-D)
*/
export function resolvePivotCommands(pivot: SSHPivot): PivotCommands {
    const cmds: PivotCommands = { attacker: [], target: [] };
    let step = 1;
    if (!pivot) return cmds;

    // Fill sensible defaults / placeholders so the UI shows commands even
    // when the user hasn't entered everything yet.
    const targetIP = pivot.targetIP?.trim() ? pivot.targetIP : "<TARGET_IP>";
    const targetUser = pivot.targetUser?.trim() ? pivot.targetUser : "<TARGET_USER>";
    const sshPort = pivot.sshPort ?? 22;
    const portArg = sshPort === 22 ? "" : `-p ${sshPort}`;

    // Dynamic SOCKS (-D)
    if (pivot.mode === "dynamic") {
        const socks = pivot.socksPort ?? 1080;

        cmds.attacker.push({
            step: step++,
            command: `ssh -D ${socks}${portArg ? ' ' + portArg : ''} ${targetUser}@${targetIP} -N`,
        });

        // Provide explicit proxychains configuration guidance and usage
        cmds.attacker.push({
            step: step++,
            command: `# Add SOCKS line to /etc/proxychains.conf (or /etc/proxychains4.conf):\n#    socks5 127.0.0.1 ${socks}`,
        });

        cmds.attacker.push({
            step: step++,
            command: `# Command eg: proxychains curl http://${pivot.targetIP}`,
        });

        return cmds;
    }

    // Local (-L) or Remote (-R) forwards
    const flag = pivot.mode === "local" ? "-L" : "-R";

    if (!pivot.forwards || pivot.forwards.length === 0) {
        return cmds;
    }

    // Build combined ssh command with all forwards
    const forwardArgs = pivot.forwards
        .map((f) => `${flag} ${f.bindPort}:${f.forwardHost}:${f.forwardPort}`)
        .join(" ");

    const sshCmd = `ssh ${forwardArgs}${portArg ? ' ' + portArg : ''} ${targetUser}@${targetIP} -N`;

    // Both local and remote forwards are initiated from the attacker host.
    cmds.attacker.push({ step: step++, command: sshCmd });

    // Add concise usage hints per forward (attacker-side)
    for (const f of pivot.forwards) {
        if (pivot.mode === "local") {
            cmds.attacker.push({
                step: step++,
                command: `# Access:  http://localhost:${f.bindPort}`,
            });
        } else {
            cmds.attacker.push({
                step: step++,
                command: `# Access:  http://localhost:${f.bindPort}`,
            });
        }
    }

    return cmds;
}