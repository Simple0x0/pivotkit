"use client";

import { useEffect } from "react";

// Keep this list in sync with app/data/tools/*.yaml
const VALID_TOOLS = ["chisel", "ligolo-ng", "netsh", "rpivot", "socat", "ssh"];

export default function NotFound() {
  useEffect(() => {
    const path = window.location.pathname;

    // /tools/[valid-tool]/[...rest] → /tools/[valid-tool]
    const deepToolMatch = path.match(/^\/tools\/([^/]+)\/.+/);
    if (deepToolMatch) {
      const tool = deepToolMatch[1];
      if (VALID_TOOLS.includes(tool)) {
        window.location.replace(`/tools/${tool}`);
        return;
      }
    }

    // Everything else (unknown root paths, /tools, /tools/[invalid]) → /
    window.location.replace("/");
  }, []);

  return null;
}
