import { ToolDefinition } from "@/app/types/tool";
import { renderTemplate } from "@/app/lib/renderTemplate";
import CommandBlock from "./CommandBlock";

interface Props {
  tool: ToolDefinition;
  values: Record<string, any>;
}

export default function CommandOutput({ tool, values }: Props) {
  const resolvedValues = { ...values };

  for (const [key, input] of Object.entries(tool.inputs)) {
    if (resolvedValues[key] === undefined && input.default !== undefined) {
      resolvedValues[key] = input.default;
    }
  }

  return (
    <section>
      {tool.commands.attacker && (
        <CommandBlock
          title="Attacker"
          commands={tool.commands.attacker.map(cmd =>
            renderTemplate(cmd, resolvedValues)
          )}
        />
      )}

      {tool.commands.target && (
        <CommandBlock
          title="Target"
          commands={tool.commands.target.map(cmd =>
            renderTemplate(cmd, resolvedValues)
          )}
        />
      )}

      {tool.commands.post && (
        <CommandBlock
          title="Post-Pivot"
          commands={tool.commands.post.map(cmd =>
            renderTemplate(cmd, resolvedValues)
          )}
        />
      )}
    </section>
  );
}
