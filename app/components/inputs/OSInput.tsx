"use client";

import InfoTooltip from "@/app/components/InfoTooltip";

export function OSInput({
  label,
  value = "Linux",
  onChange,
  info,
  className = "",
}: {
  label: string;
  value: "Linux" | "Win";
  onChange: (v: "Linux" | "Win") => void;
  info?: string;
  className?: string;
}) {
  const isLinux = value === "Linux";

  const toggle = () => {
    onChange(isLinux ? "Win" : "Linux");
  };

  return (
    <div className={`flex flex-col w-full sm:w-auto ${className}`}>
      <label className="text-[11px] font-medium text-zinc-400">{label}</label>

      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] ${!isLinux ? "text-white" : "text-zinc-500"}`}>Win</span>

        <button
          type="button"
          onClick={toggle}
          className={`
            relative w-8 h-4 rounded-full border transition-colors
            ${isLinux ? "bg-yellow-800 border-yellow-700" : "bg-blue-600 border-blue-500"}
            focus:outline-none
          `}
          aria-label="Toggle operating system"
        >
          <span
            className={`
              absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white
              transition-transform
              ${isLinux ? "translate-x-4" : "translate-x-0"}
            `}
          />
        </button>

        <span className={`text-[10px] ${isLinux ? "text-white" : "text-zinc-500"}`}>Linux</span>

        {info && <InfoTooltip text={info} />}
      </div>
    </div>
  );
}
