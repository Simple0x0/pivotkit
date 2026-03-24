"use client";

import { useState } from "react";

export type ChiselMode = "reverse-socks" | "local-forward" | "remote-forward";

export type ChiselForward = {
  localPort: number;
  remoteHost: string;
  remotePort: number;
};

export type ChiselPivot = {
  mode: ChiselMode;
  serverIP: string;
  serverPort: number;
  serverOS: "linux" | "windows";
  clientOS: "linux" | "windows";
  socksPort: number;
  forwards: ChiselForward[];
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
  };
}

export function useChiselPivot() {
  const [pivot, setPivot] = useState<ChiselPivot>(createDefaultChiselPivot());

  function updatePivot(patch: Partial<ChiselPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  function setMode(mode: ChiselMode) {
    setPivot(prev => ({
      ...prev,
      mode,
    }));
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

  return {
    pivot,
    updatePivot,
    setMode,
    addForward,
    updateForward,
    removeForward,
  };
}
