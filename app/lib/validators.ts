import { ToolInput } from "@/app/types/tool";

export function validateInputs(
  schema: Record<string, ToolInput>,
  values: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [key, input] of Object.entries(schema)) {
    const value = values[key] ?? input.default;

    if (input.required && !value) {
      errors[key] = "This field is required";
      continue;
    }

    if (!value) continue;

    switch (input.type) {
      case "ip":
        if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value))
          errors[key] = "Invalid IP address";
        break;

      case "port":
        const port = Number(value);
        if (isNaN(port) || port < 1 || port > 65535)
          errors[key] = "Invalid port number";
        break;

      case "cidr":
        if (!/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(value))
          errors[key] = "Invalid CIDR notation";
        break;
    }
  }

  return errors;
}
