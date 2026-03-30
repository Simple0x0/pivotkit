"use client";

import InfoTooltip from "@/app/components/InfoTooltip";
import { SocatMode } from "@/app/hooks/useSocatPivot";

export type { SocatMode };

export function SocatModeInput({
  label,
  value = "tcp-forward",
  onChange,
  info,
  className = "",
}: {
  label: string;
  value?: SocatMode;
  onChange: (v: SocatMode) => void;
  info?: string;
  className?: string;
}) {
  const baseBtn =
    "flex items-center justify-center w-6 h-6 text-[10px] rounded border transition-colors";
  const active = "bg-blue-900 text-white border-slate-600";
  const inactive = "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white";

  const labelDisplay =
    value === "tcp-forward" ? "tcp" : value === "udp-forward" ? "udp" : "shell";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <label className="text-[11px] font-medium text-zinc-400 text-center">
        {label}
      </label>

      {/* T-shaped button layout — mirrors SSHModeInput exactly */}
      <div className="relative mt-2 w-20 h-12">
        {/* Horizontal line */}
        <div className="absolute top-3 left-0 right-0 h-px bg-zinc-700" />
        {/* Vertical line */}
        <div className="absolute top-3 left-1/2 h-5 w-px -translate-x-1/2 bg-zinc-700" />

        {/* T = TCP Forward */}
        <button
          type="button"
          onClick={() => onChange("tcp-forward")}
          title="TCP Forward — relay TCP traffic to an internal service"
          className={`${baseBtn} absolute left-0 top-0 ${
            value === "tcp-forward" ? active : inactive
          }`}
        >
          T
        </button>

        {/* U = UDP Forward */}
        <button
          type="button"
          onClick={() => onChange("udp-forward")}
          title="UDP Forward — relay UDP traffic (DNS, SNMP, etc.)"
          className={`${baseBtn} absolute right-0 top-0 ${
            value === "udp-forward" ? active : inactive
          }`}
        >
          U
        </button>

        {/* S = TTY Shell */}
        <button
          type="button"
          onClick={() => onChange("tty-shell")}
          title="TTY Shell — interactive PTY reverse shell from target to attacker"
          className={`${baseBtn} absolute left-1/2 bottom-0 -translate-x-1/2 ${
            value === "tty-shell" ? active : inactive
          }`}
        >
          S
        </button>
      </div>

      <div className="mt-1 flex items-center justify-center gap-1">
        <span className="text-[9px] text-zinc-400 uppercase tracking-wide text-center">
          {labelDisplay}
        </span>
        {info && <InfoTooltip text={info} />}
      </div>
    </div>
  );
}
