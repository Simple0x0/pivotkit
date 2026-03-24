"use client";

import { useState } from "react";

export type SocatMode = "tcp-forward" | "udp-forward" | "tty-shell";

export type SocatPivot = {
  mode: SocatMode;
  listenPort: number;
  targetIP: string;
  targetPort: number;
  attackerIP: string;
};

function createDefaultSocatPivot(): SocatPivot {
  return {
    mode: "tcp-forward",
    listenPort: 8080,
    targetIP: "",
    targetPort: 80,
    attackerIP: "",
  };
}

export function useSocatPivot() {
  const [pivot, setPivot] = useState<SocatPivot>(createDefaultSocatPivot());

  function updatePivot(patch: Partial<SocatPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  return { pivot, updatePivot };
}
