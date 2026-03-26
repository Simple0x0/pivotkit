"use client";

import InfoTooltip from "@/app/components/InfoTooltip";
import { ChiselMode } from "@/app/hooks/useChiselPivot";

export function ChiselModeInput({
  label,
  value = "reverse-socks",
  onChange,
  info,
  className = "",
}: {
  label: string;
  value?: ChiselMode;
  onChange: (v: ChiselMode) => void;
  info?: string;
  className?: string;
}) {
  const baseBtn =
    "flex items-center justify-center w-6 h-6 text-[10px] rounded border transition-colors";

  const active = "bg-blue-900 text-white border-slate-600";
  const inactive = "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white";

  const modeLabel =
    value === "normal-forward"
      ? "normal"
      : value === "reverse-forward"
      ? "reverse"
      : "socks5";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Centered label */}
      <label className="text-[11px] font-medium text-zinc-400 text-center">
        {label}
      </label>

      {/* Selector — same T-shape layout as SSHModeInput */}
      <div className="relative mt-2 w-20 h-12">
        {/* Horizontal line */}
        <div className="absolute top-3 left-0 right-0 h-px bg-zinc-700" />
        {/* Vertical line */}
        <div className="absolute top-3 left-1/2 h-5 w-px -translate-x-1/2 bg-zinc-700" />

        {/* N — Normal Forward (top-left) */}
        <button
          type="button"
          onClick={() => onChange("normal-forward")}
          className={`${baseBtn} absolute left-0 top-0 ${
            value === "normal-forward" ? active : inactive
          }`}
        >
          N
        </button>

        {/* R — Reverse Forward (top-right) */}
        <button
          type="button"
          onClick={() => onChange("reverse-forward")}
          className={`${baseBtn} absolute right-0 top-0 ${
            value === "reverse-forward" ? active : inactive
          }`}
        >
          R
        </button>

        {/* S — Reverse SOCKS5 (bottom-center) */}
        <button
          type="button"
          onClick={() => onChange("reverse-socks")}
          className={`${baseBtn} absolute left-1/2 bottom-0 -translate-x-1/2 ${
            value === "reverse-socks" ? active : inactive
          }`}
        >
          S
        </button>
      </div>

      {/* Current value + tooltip */}
      <div className="mt-1 flex items-center justify-center gap-1">
        <span className="text-[9px] text-zinc-400 uppercase tracking-wide text-center">
          {modeLabel}
        </span>
        {info && <InfoTooltip text={info} />}
      </div>
    </div>
  );
}
