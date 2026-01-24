"use client";

import { LigoloPivot } from "@/app/hooks/usePivotChain";
import { useState } from "react";
import { PivotCommands, CommandStep } from "./Types";

/* ---------------- Main Component ---------------- */

export default function LigoloCommands({
  pivots,
  resolvedCommands,
}: {
  pivots: LigoloPivot[];
  resolvedCommands: PivotCommands[];
}) {
  if (!pivots.length) return null;

  return (
    <div className="space-y-10">
      {pivots.map((pivot, idx) => {
        const isEntry = pivot.role === "entry";

        const cmds = resolvedCommands[idx] ?? { attacker: [], target: [] };

        return (
          <div key={idx} className="space-y-6">
            {/* -------- Pivot Header -------- */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium">
                {isEntry ? "Entry Pivot (TUN)" : `Relay Pivot #${idx}`}
              </span>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>

            {/* -------- Pivot Card -------- */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CommandPanel title="Attacker Commands" steps={cmds.attacker} />
                <CommandPanel title="Target Commands" steps={cmds.target} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Command Panel ---------------- */

function CommandPanel({
  title,
  steps,
}: {
  title: string;
  steps: CommandStep[];
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-gray-950 shadow-inner p-3 space-y-3">
      <h4 className="text-xs font-bold text-zinc-100 tracking-wide">{title}</h4>

      {steps.length === 0 && (
        <p className="text-xs text-zinc-500 italic">No commands generated</p>
      )}

      <div className="space-y-2">
        {steps.map((s) => (
          <CommandRow key={`${title}-${s.step}`} step={s.step} cmd={s.command} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Command Row ---------------- */

function CommandRow({ step, cmd }: { step: number; cmd: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex items-start justify-between gap-3 border border-zinc-700 rounded-md p-3 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-150">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold select-none">
          {step}
        </span>

        <code className="text-xs font-mono text-zinc-100 break-all leading-relaxed">
          {cmd}
        </code>
      </div>

      <button
        onClick={copy}
        className={`text-xs px-2 py-1 rounded hover:bg-zinc-700 transition-colors ${
          copied ? "text-green-400" : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="Copy command"
      >
        {copied ? "✓ Copied" : "⧉"}
      </button>
    </div>
  );
}
