"use client";

import { useState } from "react";

export type RpivotPivot = {
  attackerIP: string;
  attackerPort: number;
  socksPort: number;
  targetOS: "linux" | "windows";
  useNtlm: boolean;
  ntlmProxyIP?: string;
  ntlmProxyPort?: number;
  ntlmDomain?: string;
  ntlmUser?: string;
  ntlmPassword?: string;
};

function createDefaultRpivotPivot(): RpivotPivot {
  return {
    attackerIP: "",
    attackerPort: 9999,
    socksPort: 1080,
    targetOS: "linux",
    useNtlm: false,
    ntlmProxyIP: "",
    ntlmProxyPort: 8080,
    ntlmDomain: "",
    ntlmUser: "",
    ntlmPassword: "",
  };
}

export function useRpivotPivot() {
  const [pivot, setPivot] = useState<RpivotPivot>(createDefaultRpivotPivot());

  function updatePivot(patch: Partial<RpivotPivot>) {
    setPivot(prev => ({ ...prev, ...patch }));
  }

  return { pivot, updatePivot };
}
