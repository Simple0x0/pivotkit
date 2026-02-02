"use client";

import { LigoloPivot } from "@/app/hooks/useLigoloPivotChain";
import { PivotCommands } from "@/app/types/tool";
import CommandPanel from "@/app/components/CommandPanel";

/* ---------------- Main Component ---------------- */

export default function LigoloCommandsDisplay({
  pivots,
  resolvedCommands,
}: {
  pivots: LigoloPivot[];
  resolvedCommands: PivotCommands[];
}) {
  if (!pivots.length) return null;

  return (
    <div
      className="
        max-h-[70vh]
        overflow-y-auto
        pr-2
        space-y-12
        scrollable
      "
    >
      {pivots.map((pivot, idx) => {
        const isEntry = pivot.role === "entry";
        const cmds = resolvedCommands[idx] ?? { attacker: [], target: [] };

        return (
          <div key={idx} className="space-y-6">
            {/* -------- Pivot Header -------- */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                {isEntry ? "Entry Pivot (TUN)" : `Relay Pivot #${idx}`}
              </span>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>

            {/* -------- Pivot Card -------- */}
            <div className="rounded-xl border border-zinc-800 bg-gray-950 bg-black/40 shadow-lg p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <CommandPanel title="Attacker" steps={cmds.attacker} />

                <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 h-3/5 w-px -ml-3 mt-3 -translate-y-1/2 bg-slate-700" />
                  <CommandPanel title="Target" steps={cmds.target} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

