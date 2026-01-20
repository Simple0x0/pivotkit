"use client";

import { Info } from "lucide-react";

export default function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group cursor-pointer">
      <Info size={14} className="text-zinc-400" />
      <div className="absolute z-10 hidden group-hover:block bg-zinc-800 text-xs text-zinc-200 p-2 rounded w-48 -left-20 top-6">
        {text}
      </div>
    </div>
  );
}
