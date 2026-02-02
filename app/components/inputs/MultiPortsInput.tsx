"use client";

import { isValidPort } from "@/app/lib/validators";
import InfoTooltip from "@/app/components/InfoTooltip";
import { useEffect, useMemo, useState } from "react";

type Props = {
  label: string;
  value: number[];
  placeholder: string;
  onChange: (ports: number[]) => void;
  info?: string;
  className?: string;
};

export function MultiPortsInput({
  label,
  value,
  placeholder,
  onChange,
  info,
  className = "",
}: Props) {
  const [input, setInput] = useState(value.join(","));

  // Keep input in sync if parent updates value externally
  useEffect(() => {
    setInput(value.join(","));
  }, [value]);

  const parsed = useMemo(() => {
    const parts = input
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const ports = parts.map(Number);

    const invalidPorts = ports.filter(
      (p) => !Number.isInteger(p) || !isValidPort(p)
    );

    return { ports, invalidPorts };
  }, [input]);

  const handleChange = (val: string) => {
    setInput(val);

    const validPorts = val
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map(Number)
      .filter((p) => Number.isInteger(p) && isValidPort(p));

    onChange(validPorts);
  };

  const hasError = parsed.invalidPorts.length > 0;

  return (
    <div className={`flex flex-col mb-4 w-full ${className}`}>
      <label className="mb-1 text-xs font-medium text-zinc-400">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-zinc-900
            border ${hasError ? "border-red-500" : "border-zinc-700"}
            focus:outline-none
          `}
        />

        {info && <InfoTooltip text={info} />}
      </div>

      {hasError && (
        <span className="text-[10px] text-red-400 mt-1">
          Invalid port(s): {parsed.invalidPorts.join(", ")} — valid range is 1–65535
        </span>
      )}
    </div>
  );
}
