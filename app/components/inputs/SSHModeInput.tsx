"use client";

import InfoTooltip from "@/app/components/InfoTooltip";

export type SSHMode = "local" | "remote" | "dynamic";

export function SSHModeInput({
  label,
  value = "local",
  onChange,
  info,
  className = "",
}: {
  label: string;
  value?: SSHMode;
  onChange: (v: SSHMode) => void;
  info?: string;
  className?: string;
}) {
  const baseBtn =
    "flex items-center justify-center w-6 h-6 text-[10px] rounded border transition-colors";

  const active =
    "bg-blue-900 text-white border-slate-600";
  const inactive =
    "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Centered label */}
      <label className="text-[11px] font-medium text-zinc-400 text-center">
        {label}
      </label>

      {/* Selector */}
      <div className="relative mt-2 w-20 h-12">
        {/* Horizontal line */}
        <div className="absolute top-3 left-0 right-0 h-px bg-zinc-700" />
        {/* Vertical line */}
        <div className="absolute top-3 left-1/2 h-5 w-px -translate-x-1/2 bg-zinc-700" />

        {/* Local */}
        <button
          type="button"
          onClick={() => onChange("local")}
          className={`${baseBtn} absolute left-0 top-0 ${
            value === "local" ? active : inactive
          }`}
        >
          L
        </button>

        {/* Remote */}
        <button
          type="button"
          onClick={() => onChange("remote")}
          className={`${baseBtn} absolute right-0 top-0 ${
            value === "remote" ? active : inactive
          }`}
        >
          R
        </button>

        {/* Dynamic */}
        <button
          type="button"
          onClick={() => onChange("dynamic")}
          className={`${baseBtn} absolute left-1/2 bottom-0 -translate-x-1/2 ${
            value === "dynamic" ? active : inactive
          }`}
        >
          D
        </button>
      </div>

      {/* Centered value + tooltip */}
      <div className="mt-1 flex items-center justify-center gap-1">
        <span className="text-[9px] text-zinc-400 uppercase tracking-wide text-center">
          {value}
        </span>
        {info && <InfoTooltip text={info} />}
      </div>
    </div>
  );
}
