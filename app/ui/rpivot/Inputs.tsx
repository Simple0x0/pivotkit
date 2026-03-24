"use client";

import { useState } from "react";
import { RpivotPivot } from "@/app/hooks/useRpivotPivot";
import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { OSInput } from "@/app/components/inputs/OSInput";
import { TextInput } from "@/app/components/inputs/TextInput";

export default function RpivotInputs({
  pivot,
  updatePivot,
}: {
  pivot: RpivotPivot;
  updatePivot: (patch: Partial<RpivotPivot>) => void;
}) {
  const [showNtlm, setShowNtlm] = useState(pivot.useNtlm);

  function toggleNtlm() {
    const next = !showNtlm;
    setShowNtlm(next);
    updatePivot({ useNtlm: next });
  }

  return (
    <div className="space-y-8">
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ----------- Server (Attacker) ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              Server (Attacker)
            </h4>
            <div className="flex flex-wrap gap-3 mt-3">
              <IPInput
                label="Attacker IP"
                value={pivot.attackerIP}
                onChange={v => updatePivot({ attackerIP: v })}
                placeholder="192.168.1.10"
                info="IP the target will connect back to."
              />
              <PortInput
                label="Server Port"
                value={pivot.attackerPort}
                onChange={v => updatePivot({ attackerPort: v })}
                info="Port rpivot server listens on (default: 9999)."
              />
              <PortInput
                label="SOCKS Port"
                value={pivot.socksPort}
                onChange={v => updatePivot({ socksPort: v })}
                info="Local SOCKS4 proxy port created on the attacker (default: 1080)."
              />
            </div>
          </div>

          {/* ----------- Client (Target) ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              Client (Target)
            </h4>
            <div className="flex flex-wrap gap-3 mt-3">
              <OSInput
                label="Target OS"
                value={pivot.targetOS}
                onChange={v => updatePivot({ targetOS: v })}
                info="OS of the machine running the rpivot client."
              />
            </div>

            {/* NTLM toggle */}
            <div className="mt-4">
              <button
                type="button"
                onClick={toggleNtlm}
                className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                  showNtlm
                    ? "bg-blue-900 text-white border-blue-700"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                }`}
              >
                {showNtlm ? "▲ Hide NTLM Proxy" : "▼ NTLM Proxy Bypass"}
              </button>
            </div>

            {showNtlm && (
              <div className="flex flex-wrap gap-3 mt-3 border border-zinc-800 rounded-md p-3">
                <IPInput
                  label="Proxy IP"
                  value={pivot.ntlmProxyIP ?? ""}
                  onChange={v => updatePivot({ ntlmProxyIP: v })}
                  placeholder="10.10.30.1"
                  info="IP address of the NTLM-authenticating HTTP proxy."
                />
                <PortInput
                  label="Proxy Port"
                  value={pivot.ntlmProxyPort ?? 8080}
                  onChange={v => updatePivot({ ntlmProxyPort: v })}
                  info="Port of the NTLM proxy."
                />
                <TextInput
                  label="Domain"
                  value={pivot.ntlmDomain ?? ""}
                  onChange={v => updatePivot({ ntlmDomain: v })}
                  placeholder="CORP"
                  info="Windows domain for NTLM authentication."
                />
                <TextInput
                  label="Username"
                  value={pivot.ntlmUser ?? ""}
                  onChange={v => updatePivot({ ntlmUser: v })}
                  placeholder="user"
                  info="Username for NTLM authentication."
                />
                <TextInput
                  label="Password"
                  value={pivot.ntlmPassword ?? ""}
                  onChange={v => updatePivot({ ntlmPassword: v })}
                  placeholder="password"
                  info="Password for NTLM authentication."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
