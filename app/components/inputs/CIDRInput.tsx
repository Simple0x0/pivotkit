"use client";

import { useState, useEffect } from "react";
import { isValidCIDR } from "@/app/lib/validators";
import InfoTooltip from "@/app/components/InfoTooltip";

export function CIDRInput({
  label = "Pivot Network CIDR",
  value,
  onChange,
  info, // optional tooltip
}: {
  label?: string;
  value: number; // store as number
  onChange: (v: number) => void;
  info?: string;
}) {
  const safeValue = Number.isFinite(value) ? value : 24; // default /24
  const isValid = isValidCIDR(safeValue);

  const increment = () => {
    if (safeValue < 32) onChange(safeValue + 1);
  };
  const decrement = () => {
    if (safeValue > 0) onChange(safeValue - 1);
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
            disabled={safeValue <= 0}
            className="px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
          >
            -
          </button>

          {/* Input */}
          <input
            type="text"
            value={`/${safeValue}`} // show slash
            onChange={(e) => {
              const val = e.target.value.replace("/", "");
              const num = Number(val);
              if (!isNaN(num) && num >= 0 && num <= 32) onChange(num);
            }}
            className={`
              w-16 text-center px-2 py-1 text-sm bg-zinc-900 focus:outline-none
              ${isValid ? "border-none" : "border border-red-500"}
              text-white
            `}
          />

          {/* Increment button */}
          <button
            type="button"
            onClick={increment}
            disabled={safeValue >= 32}
            className="px-3 py-1 bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
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
          Invalid CIDR
        </span>
      )}
    </div>
  );
}
