'use client';

import { useState } from "react";

export default function CommandRow({ step, cmd }: { step?: number; cmd: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  };

  return (
  <div
    onClick={copy}
    className={`
      group cursor-pointer
      flex items-start gap-3
      border border-slate-800 rounded-md
      px-3 py-2
      hover:bg-slate-950
      shadow-xl
      transition-all duration-150
    `}
    title="Click to copy"
  >
    {/* Step */}
    {step ? (
      <span className="flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded bg-gray-800 text-white text-[11px] select-none">
        {step}
      </span>
      ) : null}

    {/* Command + Copy */}
    <div className="flex flex-1 justify-between items-center">
      <code className="text-sm font-bold font-sans text-zinc-400 break-all leading-relaxed">
        {cmd}
      </code>

      {/* Copy feedback */}
      <span
          className={`mt-1 block text-[10px] transition-opacity ${
            copied
              ? "text-green-400 opacity-100"
              : "opacity-0 group-hover:opacity-40 text-zinc-400"
          }`}
        >
        {copied ? "Copied!" : "Copy"}
      </span>
    </div>
  </div>
);

}