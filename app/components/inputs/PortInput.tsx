"use client";

import { isValidPort } from "@/app/lib/validators";
import InfoTooltip from "@/app/components/InfoTooltip";

export function PortInput({
  label,
  value,
  onChange,
  info, // optional tooltip text
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  info?: string;
}) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const isValid = isValidPort(safeValue);

  const increment = () => {
    if (safeValue < 65535) onChange(safeValue + 1);
  };
  const decrement = () => {
    if (safeValue > 1) onChange(safeValue - 1);
  };

  return (
    <div className="flex flex-col w-44 gap-1">
      <label className="text-xs font-medium text-zinc-400">{label}</label>

      {/* Group container: input + buttons + tooltip */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
          {/* Decrement button */}
          <button
            type="button"
            onClick={decrement}
            className="px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
            disabled={safeValue <= 1}
          >
            -
          </button>

          {/* Input */}
          <input
            type="text"
            value={safeValue}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= 0) onChange(val);
            }}
            className={`
              w-16 text-center px-2 py-1 text-sm bg-zinc-900 focus:outline-none
              ${isValid ? "border-none" : "border border-red-500"}
            `}
          />

          {/* Increment button */}
          <button
            type="button"
            onClick={increment}
            className="px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
            disabled={safeValue >= 65535}
          >
            +
          </button>
        </div>

        {/* Tooltip after the input group */}
        {info && <InfoTooltip text={info} />}
      </div>

      {/* Validation message */}
      {!isValid && (
        <span className="text-[10px] text-red-400 mt-1">
          Port must be 1–65535
        </span>
      )}
    </div>
  );
}
