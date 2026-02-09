
"use client";

import { SSHPivot } from "@/app/hooks/useSSHPivot";
import { PivotCommands } from "@/app/types/tool";
import CommandPanel from "@/app/components/CommandPanel";

export default function SSHCommandsDisplay({
    pivot,
    resolvedCommands,
}: {
    pivot: SSHPivot;
    resolvedCommands: PivotCommands;
}) {
    if (!pivot) return null;

    const cmds = resolvedCommands ?? { attacker: [], target: [] };

    return (
        <div className="rounded-xl border border-zinc-800 bg-gray-950 bg-black/40 shadow-lg p-5">
            <CommandPanel
                title="Attacker"
                steps={cmds.attacker}
                commentStyle="text-sm font-mono text-zinc-500 italic break-all leading-relaxed"
            />
        </div>
    );
}