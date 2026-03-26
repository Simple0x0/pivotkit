"use client";

import { ChiselPivot } from "@/app/hooks/useChiselPivot";
import { PivotCommands } from "@/app/types/tool";
import CommandPanel from "@/app/components/CommandPanel";

/**
 * Returns column titles for each section.
 *
 * Section 0 (base hop):
 *   - normal-forward: left = "Pivot (Server)"       right = "Attacker (Client)"
 *   - reverse modes:  left = "Attacker (Server)"    right = "Pivot 1 (Client)"
 *
 * Section N>0 (relay hop):
 *   - left = "Pivot N (Relay)"   right = "Pivot N+1 (New Hop)"
 *   The left column shows relay-pivot commands plus an attacker proxychains note.
 */
function getSectionTitles(
  pivot: ChiselPivot,
  idx: number
): { left: string; right: string; heading: string } {
  if (idx === 0) {
    if (pivot.mode === "normal-forward") {
      return {
        left: "Pivot (Server)",
        right: "Attacker (Client)",
        heading: "Normal Forward Tunnel",
      };
    }
    if (pivot.mode === "reverse-forward") {
      return {
        left: "Attacker (Server)",
        right: "Pivot (Client)",
        heading: "Reverse Forward Tunnel",
      };
    }
    // reverse-socks
    return {
      left: "Attacker (Server)",
      right: "Pivot 1 (Client)",
      heading:
        pivot.relays.length > 0
          ? "Hop 1 — Base Setup"
          : "Reverse SOCKS5 Tunnel",
    };
  }

  // Relay sections
  const pivotNum = idx;       // Pivot N acting as relay
  const newHopNum = idx + 1;  // Pivot N+1 (new hop)
  return {
    left: `Pivot ${pivotNum} (Relay)`,
    right: `Pivot ${newHopNum} (New Hop)`,
    heading: `Hop ${newHopNum} — Relay`,
  };
}

export default function ChiselCommandsDisplay({
  pivot,
  resolvedCommands,
}: {
  pivot: ChiselPivot;
  resolvedCommands: PivotCommands[];
}) {
  if (!pivot || !resolvedCommands.length) return null;

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-12 scrollable">
      {resolvedCommands.map((section, idx) => {
        const { left, right, heading } = getSectionTitles(pivot, idx);
        const cmds = section ?? { attacker: [], target: [] };

        return (
          <div key={idx} className="space-y-6">
            {/* Section header — mirrors Ligolo display */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                {heading}
              </span>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-gray-950 shadow-lg p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <CommandPanel
                  title={left}
                  steps={cmds.attacker}
                  commentStyle="text-sm font-mono text-zinc-500 italic break-all leading-relaxed"
                />

                <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 h-3/5 w-px -ml-3 mt-3 -translate-y-1/2 bg-slate-700" />
                  <CommandPanel
                    title={right}
                    steps={cmds.target}
                    commentStyle="text-sm font-mono text-zinc-500 italic break-all leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
