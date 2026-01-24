"use client";

import { useState } from "react";

export type OS = "linux" | "windows" | "macos";

export type LigoloPivot = {
  role: "entry" | "relay";

  // Attacker-side listener
  attackerPort: number;
  attackerOS: OS;

  // Bind IP (defaulted by role, user-overridable)
  attackerBindIP: string;

  // Relay target (derived automatically)
  targetIP?: string;
  targetPort?: number;
  targetOS?: OS;

  // Routed network
  network: string;
  cidr: number;
};

/* ---------- LigoloPivot factories ---------- */

function createEntryPivot(): LigoloPivot {
  return {
    role: "entry",
    attackerPort: 11601,
    attackerOS: "linux",
    attackerBindIP: "0.0.0.0", // default for entry (TUN-facing)
    network: "",
    cidr: 24,
  };
}

function createRelayPivot(previous: LigoloPivot): LigoloPivot {
  return {
    role: "relay",

    attackerPort: previous.attackerPort + 1,
    attackerOS: "linux",
    attackerBindIP: "127.0.0.1", // default for relay (local-only)

    targetIP: "",
    targetPort: previous.attackerPort,
    targetOS: previous.attackerOS,

    network: "",
    cidr: 24,
  };
}

/* ---------- Hook ---------- */

export function usePivotChain() {
  const [pivots, setPivots] = useState<LigoloPivot[]>([createEntryPivot()]);

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

      // Re-derive relay targets after removal
      return filtered.map((pivot, i) => {
        if (i === 0) return pivot;
        if (pivot.role !== "relay") return pivot;

        const previous = filtered[i - 1];

        return {
          ...pivot,
          targetIP: previous.attackerBindIP,
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

/* ---------- Helper: getBindIP (for command generation) ---------- */

export function getBindIP(pivot: LigoloPivot): string {
  return pivot.attackerBindIP;
}
