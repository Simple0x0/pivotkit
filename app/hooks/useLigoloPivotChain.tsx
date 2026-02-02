"use client";

import { useState } from "react";

export type OS = "linux" | "windows" | "macos";

export type LigoloPivot = {
  role: "entry" | "relay";

  // Attacker-side listener
  attackerPort: number;
  attackerOS: OS;

  /**
   * Real attacker IP
   * - REQUIRED for entry pivot
   * - UNUSED for relay pivots (derived dynamically)
   */
  attackerIP: string;

  /**
   * Bind IP for ligolo-proxy
   * entry  → 0.0.0.0
   * relay  → 127.0.0.1
   */
  attackerBindIP: string;

  // Relay target (user-controlled)
  targetIP?: string;
  targetPort?: number;
  targetOS?: OS;

  // Routed network
  network: string;
  cidr: number;
};

/* ---------- Factories ---------- */

function createEntryPivot(): LigoloPivot {
  return {
    role: "entry",

    attackerIP: "",
    attackerPort: 11601,
    attackerOS: "linux",
    attackerBindIP: "0.0.0.0",

    network: "",
    cidr: 24,
  };
}

function createRelayPivot(previous: LigoloPivot): LigoloPivot {
  return {
    role: "relay",

    // attackerIP is meaningless on relays
    attackerIP: "",

    attackerPort: previous.attackerPort + 1,
    attackerOS: "linux",
    attackerBindIP: "127.0.0.1",

    // User must enter this
    targetIP: "",
    targetPort: previous.attackerPort,
    targetOS: previous.attackerOS,

    network: "",
    cidr: 24,
  };
}

/* ---------- Hook ---------- */

export function useLigoloPivotChain() {
  const [pivots, setPivots] = useState<LigoloPivot[]>([
    createEntryPivot(),
  ]);

  function updatePivot(index: number, patch: Partial<LigoloPivot>) {
    setPivots(prev =>
      prev.map((p, i) =>
        i === index ? { ...p, ...patch } : p
      )
    );
  }

  function addPivot() {
    setPivots(prev => {
      const last = prev[prev.length - 1];
      return [...prev, createRelayPivot(last)];
    });
  }

  function removePivot(index: number) {
    setPivots(prev => {
      const filtered = prev.filter((_, i) => i !== index);

      // Re-derive relay linkage
      return filtered.map((pivot, i) => {
        if (i === 0) return pivot;
        if (pivot.role !== "relay") return pivot;

        const previous = filtered[i - 1];

        return {
          ...pivot,
          targetPort: previous.attackerPort,
          targetOS: previous.attackerOS,
        };
      });
    });
  }

  return {
    pivots,
    updatePivot,
    addPivot,
    removePivot,
  };
}
