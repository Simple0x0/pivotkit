"use client";

import { useUserInputs } from "@/app/context/UserInputsContext";
import ToolWorkspacePlaceholder from "@/app/components/ToolWorkspacePlaceholder";
import LigoloWorkspace from "@/app/ui/ligolo-ng/Workspace";

const WORKSPACE_MAP: Record<string, React.FC<any>> = {
  "ligolo-ng": LigoloWorkspace,
};

export default function Workspace({ tool }: { tool?: string }) {
  const { inputs } = useUserInputs();

  if (!tool) return <ToolWorkspacePlaceholder />;

  const ToolWorkspace = WORKSPACE_MAP[tool];
  if (!ToolWorkspace) return <ToolWorkspacePlaceholder />;

  return <ToolWorkspace inputs={inputs} />;
}
