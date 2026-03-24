"use client";

import { ChiselPivot } from "@/app/hooks/useChiselPivot";
import { PivotCommands } from "@/app/types/tool";
import CommandPanel from "@/app/components/CommandPanel";

export default function ChiselCommandsDisplay({
  pivot,
  resolvedCommands,
}: {
  pivot: ChiselPivot;
  resolvedCommands: PivotCommands;
}) {
  if (!pivot) return null;

  const cmds = resolvedCommands ?? { attacker: [], target: [] };

  return (
    <div className="rounded-xl border border-zinc-800 bg-gray-950 shadow-lg p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <CommandPanel
          title="Attacker (Server)"
          steps={cmds.attacker}
          commentStyle="text-sm font-mono text-zinc-500 italic break-all leading-relaxed"
        />

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 h-3/5 w-px -ml-3 mt-3 -translate-y-1/2 bg-slate-700" />
          <CommandPanel
            title="Target (Client)"
            steps={cmds.target}
            commentStyle="text-sm font-mono text-zinc-500 italic break-all leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
