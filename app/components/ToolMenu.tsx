"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToolDefinition } from "@/app/types/tool";

export default function ToolMenu({ tools }: { tools: ToolDefinition[] }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tools.map((tool) => {
        const href = `/tools/${tool.id}`;
        const active = pathname === href;

        return (
          <Link
            key={tool.id}
            href={href}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition
              ${active
                ? "bg-zinc-800 text-white"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"}
            `}
          >
            {tool.name}
          </Link>
        );
      })}
    </div>
  );
}
