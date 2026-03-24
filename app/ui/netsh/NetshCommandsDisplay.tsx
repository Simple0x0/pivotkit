"use client";

import { NetshPivot } from "@/app/hooks/useNetshPivot";
import { PivotCommands } from "@/app/types/tool";
import CommandPanel from "@/app/components/CommandPanel";

export default function NetshCommandsDisplay({
  pivot,
  resolvedCommands,
}: {
  pivot: NetshPivot;
  resolvedCommands: PivotCommands;
}) {
  if (!pivot) return null;

  const cmds = resolvedCommands ?? { attacker: [], target: [] };

  return (
    <div className="rounded-xl border border-zinc-800 bg-gray-950 shadow-lg p-5">
      <CommandPanel
        title="Windows Host (Administrator)"
        steps={cmds.attacker}
        commentStyle="text-sm font-mono text-zinc-500 italic break-all leading-relaxed"
      />
    </div>
  );
}
