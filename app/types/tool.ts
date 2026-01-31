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
  image?: string;
  blog?: string;
  keywords?: string[];
  category: ToolCategory;
  os: {
    attacker: OSType[];
    target: OSType[];
  };
  requires_root?: boolean;
  capabilities: ToolCapability[];
  notes?: string[];
}

export type CommandStep = {
  step: number;
  command: string;
};

export type PivotCommands = {
  attacker: CommandStep[];
  target: CommandStep[];
};
