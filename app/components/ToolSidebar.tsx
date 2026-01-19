import Link from "next/link";
import { loadTools } from "@/app/lib/toolLoader";

export default function ToolSidebar() {
  const tools = loadTools();

  return (
    <aside className="col-span-2 bg-zinc-900 border-r border-zinc-800 p-4">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase mb-4">
        Tools
      </h2>

      <nav className="space-y-1">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.id}`}
            className="block rounded px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition"
          >
            {tool.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
