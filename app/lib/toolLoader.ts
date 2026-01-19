import fs from "fs";
import path from "path";
import YAML from "yaml";
import { ToolDefinition } from "@/app/types/tool";

const TOOLS_DIR = path.join(process.cwd(), "app/data/tools");

export function loadTools(): ToolDefinition[] {
  if (!fs.existsSync(TOOLS_DIR)) return [];

  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".yaml"));

  return files
    .map((file) => {
      const fullPath = path.join(TOOLS_DIR, file);
      const content = fs.readFileSync(fullPath, "utf-8").trim();

      if (!content) return null;

      const parsed = YAML.parse(content) as ToolDefinition;
      return parsed?.id ? parsed : null;
    })
    .filter((tool): tool is ToolDefinition => tool !== null);
}

export function loadToolById(id: string): ToolDefinition | null {
  const filePath = path.join(TOOLS_DIR, `${id}.yaml`);

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8").trim();
  if (!content) return null;

  const parsed = YAML.parse(content) as ToolDefinition;
  return parsed?.id ? parsed : null;
}
