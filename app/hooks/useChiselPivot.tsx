"use client";

import { useState } from "react";

export type ChiselMode = "reverse-socks" | "normal-forward" | "reverse-forward";

export type ChiselForward = {
  localPort: number;
  remoteHost: string;
  remotePort: number;
};

/**
 * One relay hop for multi-pivot chaining (reverse-socks only).
 *
 * Pivot N runs a second Chisel server so Pivot N+1 can connect,
 * then relays that SOCKS back to the attacker through the existing tunnel.
 */
export type ChiselRelay = {
  /** Internal IP of the relay pivot — reachable by the next hop. */
  pivotInternalIP: string;
  /** Port for the second Chisel server on the relay pivot (default: 9090). */
  serverPort: number;
  /** SOCKS port exposed on the attacker for this hop (default: 1081+). */
  socksPort: number;
  /** OS of the new hop host (Pivot N+1). */
  relayOS: "linux" | "windows";
};

export type ChiselPivot = {
  mode: ChiselMode;
  serverIP: string;
  serverPort: number;
  serverOS: "linux" | "windows";
  clientOS: "linux" | "windows";
  socksPort: number;
  forwards: ChiselForward[];
  /** Multi-pivot relays — only used when mode === "reverse-socks". */
  relays: ChiselRelay[];
};

function createDefaultChiselPivot(): ChiselPivot {
  return {
    mode: "reverse-socks",
    serverIP: "",
    serverPort: 8080,
    serverOS: "linux",
    clientOS: "linux",
    socksPort: 1080,
    forwards: [
      {
        localPort: 8000,
        remoteHost: "127.0.0.1",
        remotePort: 80,
      },
    ],
    relays: [],
  };
}

export function useChiselPivot() {
  const [pivot, setPivot] = useState<ChiselPivot>(createDefaultChiselPivot());

  function updatePivot(patch: Partial<ChiselPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  function setMode(mode: ChiselMode) {
    setPivot(prev => ({ ...prev, mode }));
  }

  function addForward() {
    setPivot(prev => ({
      ...prev,
      forwards: [
        ...prev.forwards,
        {
          localPort: 8000 + prev.forwards.length,
          remoteHost: "127.0.0.1",
          remotePort: 80,
        },
      ],
    }));
  }

  function updateForward(index: number, patch: Partial<ChiselForward>) {
    setPivot(prev => ({
      ...prev,
      forwards: prev.forwards.map((f, i) =>
        i === index ? { ...f, ...patch } : f
      ),
    }));
  }

  function removeForward(index: number) {
    setPivot(prev => ({
      ...prev,
      forwards: prev.forwards.filter((_, i) => i !== index),
    }));
  }

  function addRelay() {
    setPivot(prev => ({
      ...prev,
      relays: [
        ...prev.relays,
        {
          pivotInternalIP: "",
          serverPort: 9090 + prev.relays.length,
          socksPort: 1081 + prev.relays.length,
          relayOS: "linux",
        },
      ],
    }));
  }

  function updateRelay(index: number, patch: Partial<ChiselRelay>) {
    setPivot(prev => ({
      ...prev,
      relays: prev.relays.map((r, i) =>
        i === index ? { ...r, ...patch } : r
      ),
    }));
  }

  function removeRelay(index: number) {
    setPivot(prev => ({
      ...prev,
      relays: prev.relays.filter((_, i) => i !== index),
    }));
  }

  return {
    pivot,
    updatePivot,
    setMode,
    addForward,
    updateForward,
    removeForward,
    addRelay,
    updateRelay,
    removeRelay,
  };
}
