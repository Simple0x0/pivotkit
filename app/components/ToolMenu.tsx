"use client";

import { useUserInputs } from "@/app/context/UserInputsContext";
import { ToolDefinition } from "@/app/types/tool";

export default function ToolMenu({ tools }: { tools: ToolDefinition[] }) {
  const { selectedTool, setSelectedTool } = useUserInputs();

  return (
    <div className="flex space-x-4">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setSelectedTool(tool.id)}
          className={`px-3 py-2 rounded text-sm font-medium ${
            selectedTool === tool.id
              ? "bg-zinc-800 text-white"
              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {tool.name}
        </button>
      ))}
    </div>
  );
}
