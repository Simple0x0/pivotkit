export function isValidIP(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  return parts.every((p) => {
    const n = Number(p);
    return Number.isInteger(n) && n >= 0 && n <= 255;
  });
}

export function isValidPort(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 65535;
}

export function isValidCIDR(value: string | number): boolean {
  const num = typeof value === "string" ? Number(value.replace("/", "")) : value;
  return Number.isInteger(num) && num >= 0 && num <= 32;
}

