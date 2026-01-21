// app/ui/ligolo-ng/Commands.tsx
"use client";

type Pivot = {
  attackerIP: string;
  attackerPort: number;
  targetIP: string;
  targetPort: number;
  network: string;
  cidr: number;
};

export default function LigoloCommands({ pivots }: { pivots: Pivot[] }) {
  if (!pivots.length) return null;

  const commands = buildLigoloCommands(pivots);

  return (
    <div className="space-y-6">
      {/* Attacker Commands */}
      <CommandBlock
        title="Attacker Host"
        commands={commands.attacker}
      />

      {/* Target Commands */}
      <CommandBlock
        title="Target Host(s)"
        commands={commands.target}
      />
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function buildLigoloCommands(pivots: Pivot[]) {
  const attacker: string[] = [];
  const target: string[] = [];

  pivots.forEach((pivot, idx) => {
    const iface = `ligolo${idx}`;

    /* Target: start agent */
    target.push(
      `# Hop ${idx + 1}`,
      `./agent -connect ${pivot.attackerIP}:${pivot.attackerPort}`
    );

    /* Attacker: create listener */
    attacker.push(
      `# Hop ${idx + 1}`,
      `ligolo-ng proxy -listen ${pivot.attackerPort}`
    );

    /* Attacker: add route (CRITICAL) */
    attacker.push(
      `ip route add ${pivot.network}/${pivot.cidr} dev ${iface}`
    );
  });

  return { attacker, target };
}

/* -------------------- UI -------------------- */

function CommandBlock({
  title,
  commands,
}: {
  title: string;
  commands: string[];
}) {
  return (
    <div className="border border-zinc-800 rounded-lg bg-zinc-950">
      <div className="px-4 py-2 border-b border-zinc-800 text-sm font-semibold">
        {title}
      </div>

      <ol className="p-4 space-y-2 text-sm font-mono">
        {commands.map((cmd, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-zinc-500 select-none">
              {i + 1}.
            </span>
            <code className="text-zinc-100">{cmd}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}
