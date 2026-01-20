"use client";

import InfoTooltip from "@/app/components/InfoTooltip";

export function OSInput({
  label,
  value,
  onChange,
  info,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  info?: string;
}) {
  const options = ["Linux", "Windows", "Mac"];

  return (
    <div className="flex flex-col w-full gap-1">
      <label className="text-xs font-medium text-zinc-400">{label}</label>

      <div className="flex items-center gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            flex-1 bg-zinc-900 border border-zinc-700 rounded-lg
            px-3 py-2 text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-slate-950
            hover:border-zinc-500 transition
          "
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {info && <InfoTooltip text={info} />}
      </div>
    </div>
  );
}
