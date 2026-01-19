import { loadTools, loadToolById } from "@/app/lib/toolLoader";
import ToolSidebar from "@/app/components/ToolSidebar";
import ToolWorkspacePlaceholder from "@/app/components/ToolWorkspacePlaceholder";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  const tools = loadTools();
  return tools.map((tool) => ({ tool: tool.id }));
}

type Props = {
  params: Promise<{ tool: string }>;
};

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;

  const toolData = loadToolById(tool);
  if (!toolData) return notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="grid grid-cols-12 min-h-screen">

        {/* Left Menu */}
        <ToolSidebar />

        {/* Main Workspace */}
        <main className="col-span-8 p-6">
          <h1 className="text-2xl font-semibold mb-2">
            {toolData.name}
          </h1>
          <p className="text-zinc-400 mb-6">
            {toolData.description}
          </p>

          <ToolWorkspacePlaceholder />
        </main>

        {/* Right Visual Panel (reserved) */}
        <aside className="col-span-2 border-l border-zinc-800 p-4 text-zinc-500 text-sm">
          Visuals placeholder
        </aside>

      </div>
    </div>
  );
}
