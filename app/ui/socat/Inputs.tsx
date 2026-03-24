"use client";

import { SocatPivot, SocatMode } from "@/app/hooks/useSocatPivot";
import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";

const MODES: { id: SocatMode; label: string }[] = [
  { id: "tcp-forward", label: "TCP Forward" },
  { id: "udp-forward", label: "UDP Forward" },
  { id: "tty-shell", label: "TTY Shell" },
];

export default function SocatInputs({
  pivot,
  updatePivot,
}: {
  pivot: SocatPivot;
  updatePivot: (patch: Partial<SocatPivot>) => void;
}) {
  const isTtyShell = pivot.mode === "tty-shell";

  return (
    <div className="space-y-8">
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ----------- Config ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              Relay Configuration
            </h4>

            {/* Mode selector */}
            <div className="mt-3">
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                Mode
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {MODES.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updatePivot({ mode: m.id })}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      pivot.mode === m.id
                        ? "bg-blue-900 text-white border-blue-700"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <PortInput
                label="Listen Port"
                value={pivot.listenPort}
                onChange={v => updatePivot({ listenPort: v })}
                info="Port to open on the relay host."
              />
            </div>
          </div>

          {/* ----------- Target / Attacker ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            {!isTtyShell ? (
              <>
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                  Forward Destination
                </h4>
                <div className="flex flex-wrap gap-3 mt-3">
                  <IPInput
                    label="Target IP"
                    value={pivot.targetIP}
                    onChange={v => updatePivot({ targetIP: v })}
                    placeholder="10.10.30.200"
                    info="IP of the service to forward traffic to."
                  />
                  <PortInput
                    label="Target Port"
                    value={pivot.targetPort}
                    onChange={v => updatePivot({ targetPort: v })}
                    info="Port of the service on the target host."
                  />
                </div>
              </>
            ) : (
              <>
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                  Attacker Listener
                </h4>
                <div className="flex flex-wrap gap-3 mt-3">
                  <IPInput
                    label="Attacker IP"
                    value={pivot.attackerIP}
                    onChange={v => updatePivot({ attackerIP: v })}
                    placeholder="192.168.1.10"
                    info="Attacker IP the target will connect back to."
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
