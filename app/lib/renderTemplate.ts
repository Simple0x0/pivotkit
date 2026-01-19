export function renderTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    if (values[key] === undefined) {
      throw new Error(`Missing value for variable: ${key}`);
    }
    return String(values[key]);
  });
}
