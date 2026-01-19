export type OSType = "linux" | "windows" | "macos";

export type ToolCategory =
  | "tun"
  | "socks"
  | "port-forward"
  | "c2";

export type InputType =
  | "ip"
  | "port"
  | "cidr"
  | "string"
  | "boolean";

export interface ToolInput {
  label?: string;
  type: InputType;
  required?: boolean;
  default?: string | number | boolean;
  description?: string;
}

export interface ToolCommandBlock {
  attacker?: string[];
  target?: string[];
  post?: string[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  description?: string;
  category: ToolCategory;
  os: {
    attacker: OSType[];
    target: OSType[];
  };
  requires_root?: boolean;
  inputs: Record<string, ToolInput>;
  commands: ToolCommandBlock;
  notes?: string[];
}
