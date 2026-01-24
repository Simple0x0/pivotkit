"use client";

import { isValidIP } from "@/app/lib/validators";
import InfoTooltip from "@/app/components/InfoTooltip";

export function IPInput({
  label,
  value,
  onChange,
  info,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  info?: string;
  placeholder?: string;
  className?: string;
}) {
  const isValid = value === "" || isValidIP(value);

  return (
    <div className={`flex flex-col mb-4 w-full sm:w-auto ${className}`}>
      <label className="mb-1 text-xs font-medium text-zinc-400">{label}</label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full
            bg-zinc-900
            border rounded-lg
            px-3 py-2 pr-8
            text-sm text-white
            placeholder-zinc-500
            focus:outline-none
            focus:ring-1 focus:ring-slate-500
            focus:border-slate-500
            transition duration-200
            shadow-sm
            ${isValid ? "border-zinc-900 hover:border-zinc-700" : "border-red-500 focus:ring-red-500 focus:border-red-500"}
          `}
          placeholder={placeholder}
        />

        {info && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <InfoTooltip text={info} />
          </div>
        )}
      </div>

      {!isValid && (
        <span className="mt-1 text-[10px] text-red-400">
          Invalid IP address
        </span>
      )}
    </div>
  );
}
