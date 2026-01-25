"use client";

import InfoTooltip from "@/app/components/InfoTooltip";
import { isValidCIDR } from "@/app/lib/validators";

export function CIDRInput({
  label = "Pivot Network CIDR",
  value,
  onChange,
  info,
  className = "",
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  info?: string;
  className?: string;
}) {
  const safeValue = Number.isFinite(value) ? value : 24;
  const isValid = isValidCIDR(safeValue);

  const increment = () => {
    if (safeValue < 32) onChange(safeValue + 1);
  };
  const decrement = () => {
    if (safeValue > 0) onChange(safeValue - 1);
  };

  return (
    <div className={`flex flex-col mb-4 w-full sm:w-auto ${className}`}>
      <label className="mb-1 text-xs font-medium text-zinc-400">{label}</label>

      <div className="flex items-center gap-2">
        <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
          <button
            type="button"
            onClick={decrement}
            disabled={safeValue <= 0}
            className="px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
          >
            -
          </button>

          <input
            type="text"
            value={`/${safeValue}`}
            onChange={(e) => {
              const val = e.target.value.replace("/", "");
              const num = Number(val);
              if (!isNaN(num) && num >= 0 && num <= 32) onChange(num);
            }}
            className={`
              w-16 text-center px-2 py-1 text-sm bg-zinc-900 focus:outline-none
              ${isValid ? "border-none" : "border border-red-500"} text-white
            `}
          />

          <button
            type="button"
            onClick={increment}
            disabled={safeValue >= 32}
            className="px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
          >
            +
          </button>
        </div>

        {info && <InfoTooltip text={info} />}
      </div>

      {!isValid && (
        <span className="text-[10px] text-red-400 mt-1">Invalid CIDR</span>
      )}
    </div>
  );
}
