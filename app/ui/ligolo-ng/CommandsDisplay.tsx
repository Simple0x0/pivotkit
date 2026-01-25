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


/* ---------------- Command Panel ---------------- */

function CommandPanel({
  title,
  steps,
}: {
  title: string;
  steps: CommandStep[];
}) {
  return (
    <div className="rounded-lg  p-4 space-y-3">
      <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
        On {title}
      </h4>

      {steps.length === 0 && (
        <p className="text-xs text-zinc-500 italic">
          No commands generated
        </p>
      )}

      <div className="space-y-2">
        {steps.map((s) => (
          <CommandRow
            key={`${title}-${s.step}`}
            step={s.step}
            cmd={s.command}
          />
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
    setTimeout(() => setCopied(false), 900);
  };

  return (
  <div
    onClick={copy}
    className={`
      group cursor-pointer
      flex items-start gap-3
      border border-slate-800 rounded-md
      px-3 py-2
      hover:bg-slate-950
      shadow-xl
      transition-all duration-150
    `}
    title="Click to copy"
  >
    {/* Step */}
    <span className="flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded bg-gray-800 text-white text-[11px] select-none">
      {step}
    </span>

    {/* Command + Copy */}
    <div className="flex flex-1 justify-between items-center">
      <code className="text-sm font-bold font-sans text-zinc-400 break-all leading-relaxed">
        {cmd}
      </code>

      {/* Copy feedback */}
      <span
          className={`mt-1 block text-[10px] transition-opacity ${
            copied
              ? "text-green-400 opacity-100"
              : "opacity-0 group-hover:opacity-40 text-zinc-400"
          }`}
        >
        {copied ? "Copied!" : "Copy"}
      </span>
    </div>
  </div>
);

}
