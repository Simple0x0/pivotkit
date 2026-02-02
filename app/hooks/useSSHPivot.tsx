"use client";

import { useState } from "react";

export type SSHMode = "local" | "remote" | "dynamic";

export type SSHForward = {
  bindPort: number;
  forwardHost: string;
  forwardPort: number;
};

export type SSHPivot = {
  mode: SSHMode;

  targetIP: string;
  targetUser: string;
  sshPort: number;

  // -D only
  socksPort?: number;

  // -L / -R only
  forwards: SSHForward[];
};

function createDefaultSSHPivot(): SSHPivot {
  return {
    mode: "local",
    targetIP: "",
    targetUser: "",
    sshPort: 22,
    forwards: [
      {
        bindPort: 8000,
        forwardHost: "127.0.0.1",
        forwardPort: 80,
      },
    ],
  };
}


export function useSSHPivot() {
  const [pivot, setPivot] = useState<SSHPivot>(createDefaultSSHPivot());

  function updatePivot(patch: Partial<SSHPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  function setMode(mode: SSHMode) {
    setPivot(prev => {
      if (mode === "dynamic") {
        // Clear forwards, enable SOCKS
        return {
          ...prev,
          mode,
          forwards: [],
          socksPort: prev.socksPort ?? 1080,
        };
      }

      // Switching back to local/remote
      return {
        ...prev,
        mode,
        socksPort: undefined,
        forwards: prev.forwards.length > 0
          ? prev.forwards // keep existing forwards if any
          : [
              {
                bindPort: 8000,
                forwardHost: "127.0.0.1",
                forwardPort: 80,
              },
            ], // add default forward if empty
      };
    });
  }


  function addForward() {
    setPivot(prev => {
      if (prev.mode === "dynamic") return prev;

      return {
        ...prev,
        forwards: [
          ...prev.forwards,
          {
            bindPort: 8000 + prev.forwards.length,
            forwardHost: "127.0.0.1",
            forwardPort: 80,
          },
        ],
      };
    });
  }

  function updateForward(index: number, patch: Partial<SSHForward>) {
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
