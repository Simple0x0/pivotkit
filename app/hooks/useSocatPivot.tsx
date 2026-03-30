"use client";

import { useState } from "react";

export type SocatMode = "tcp-forward" | "udp-forward" | "tty-shell";

export type SocatHop = {
  relayIP: string;
  listenPort: number;
  /** Used only on the last hop — the final internal service to reach */
  targetIP: string;
  /** Used only on the last hop — port of the final internal service */
  targetPort: number;
};

export type SocatPivot = {
  mode: SocatMode;
  /** One or more relay hops (TCP: multi-hop supported; UDP: single hop only) */
  hops: SocatHop[];
  /** TTY shell mode: attacker's IP the target calls back to */
  attackerIP: string;
  /** TTY shell mode: port socat listener opens on the attacker machine */
  ttyListenPort: number;
};

function createDefaultHop(): SocatHop {
  return { relayIP: "", listenPort: 8080, targetIP: "", targetPort: 80 };
}

function createDefaultPivot(): SocatPivot {
  return {
    mode: "tcp-forward",
    hops: [createDefaultHop()],
    attackerIP: "",
    ttyListenPort: 4444,
  };
}

export function useSocatPivot() {
  const [pivot, setPivot] = useState<SocatPivot>(createDefaultPivot());

  function updatePivot(patch: Partial<SocatPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  function setMode(mode: SocatMode) {
    setPivot(prev => ({
      ...prev,
      mode,
      // Drop extra relay hops when switching away from TCP (only TCP supports multi-hop)
      hops: mode !== "tcp-forward" ? [prev.hops[0]] : prev.hops,
    }));
  }

  function addHop() {
    setPivot(prev => ({ ...prev, hops: [...prev.hops, createDefaultHop()] }));
  }

  function removeHop(i: number) {
    setPivot(prev => ({
      ...prev,
      hops: prev.hops.filter((_, idx) => idx !== i),
    }));
  }

  function updateHop(i: number, patch: Partial<SocatHop>) {
    setPivot(prev => ({
      ...prev,
      hops: prev.hops.map((h, idx) => (idx === i ? { ...h, ...patch } : h)),
    }));
  }

  return { pivot, updatePivot, setMode, addHop, removeHop, updateHop };
}
