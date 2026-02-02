"use client";

import InfoTooltip from "@/app/components/InfoTooltip";

export function TextInput({
  label,
  value,
  onChange,
  info,
  className = "",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  info?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={`flex flex-col mb-4 w-full sm:w-auto ${className}`}>
      <label className="mb-1 text-xs font-medium text-zinc-400">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full
            bg-zinc-900
            border border-zinc-900 rounded-lg
            px-3 py-2 pr-8
            text-sm text-white
            focus:outline-none
            focus:ring-1 focus:ring-slate-500
            focus:border-slate-500
            transition duration-200
            shadow-sm
            hover:border-zinc-700
          `}
        />

        {info && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <InfoTooltip text={info} />
          </div>
        )}
      </div>
    </div>
  );
}
