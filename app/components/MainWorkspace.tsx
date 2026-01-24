import ToolWorkspacePlaceholder from "@/app/components/ToolWorkspacePlaceholder";
import LigoloWorkspace from "@/app/ui/ligolo-ng/Workspace";

const WORKSPACE_MAP: Record<string, React.FC<any>> = {
  "ligolo-ng": LigoloWorkspace,
  // other tools later
};

export default function MainWorkspace({ tool }: { tool?: string }) {

  if (!tool) return <ToolWorkspacePlaceholder />;

  const ToolWorkspace = WORKSPACE_MAP[tool];
  if (!ToolWorkspace) return <ToolWorkspacePlaceholder />;

  return <ToolWorkspace />;
}
