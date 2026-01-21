"use client";

import { useState } from "react";

export type Pivot = {
  attackerIP: string;
  attackerPort: number;
  attackerOS: "linux" | "windows" | "macos";
  targetIP: string;
  targetPort: number;
  targetOS: "linux" | "windows" | "macos";
  network: string;
  cidr: number;
};

function createEmptyPivot(): Pivot {
  return {
    attackerIP: "0.0.0.0",
    attackerPort: 4444,
    attackerOS: "linux",
    targetIP: "",
    targetPort: 4444,
    targetOS: "linux",
    network: "",
    cidr: 24,
  };
}

export function usePivotChain(initial = 1) {
  const [pivots, setPivots] = useState<Pivot[]>(
    Array.from({ length: initial }, createEmptyPivot)
  );

  function updatePivot(index: number, patch: Partial<Pivot>) {
    setPivots(prev =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  }

  function addPivot() {
    setPivots(prev => [...prev, createEmptyPivot()]);
  }

  function removePivot(index: number) {
    setPivots(prev => prev.filter((_, i) => i !== index));
  }

  return {
    pivots,
    updatePivot,
    addPivot,
    removePivot,
  };
}
