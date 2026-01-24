export type OSType = "linux" | "windows" | "macos";

export type ToolCategory =
  | "tun"
  | "socks"
  | "port-forward"
  | "c2";

export type ToolCapability =
  | "multi-hop"
  | "tun-interface"
  | "port-forward"
  | "reverse-connection"
  | "bind-connection"
  | "requires-agent";


export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  os: {
    attacker: OSType[];
    target: OSType[];
  };
  requires_root?: boolean;
  capabilities: ToolCapability[];
  notes?: string[];
}
