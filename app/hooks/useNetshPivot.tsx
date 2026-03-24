"use client";

import { useState } from "react";

export type NetshProtocol = "v4tov4" | "v4tov6" | "v6tov4" | "v6tov6";

export type NetshPivot = {
  listenIP: string;
  listenPort: number;
  connectIP: string;
  connectPort: number;
  protocol: NetshProtocol;
};

function createDefaultNetshPivot(): NetshPivot {
  return {
    listenIP: "0.0.0.0",
    listenPort: 8080,
    connectIP: "",
    connectPort: 80,
    protocol: "v4tov4",
  };
}

export function useNetshPivot() {
  const [pivot, setPivot] = useState<NetshPivot>(createDefaultNetshPivot());

  function updatePivot(patch: Partial<NetshPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  return { pivot, updatePivot };
}
