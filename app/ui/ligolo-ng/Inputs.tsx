"use client";

import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { OSInput } from "@/app/components/inputs/OSInput";
import { CIDRInput } from "@/app/components/inputs/CIDRInput";

const isValidCIDR = (cidr: number | string) => {
  const n = Number(cidr);
  return Number.isInteger(n) && n >= 0 && n <= 32;
};

const isRelayValid = (pivot: any) => {
  return (
    pivot.attackerIP &&
    pivot.targetIP &&
    pivot.network &&
    Number(pivot.attackerPort) > 0 &&
    Number(pivot.targetPort) > 0 &&
    isValidCIDR(pivot.cidr)
  );
};

export default function LigoloInputs({
  pivots,
  updatePivot,
  addPivot,
  removePivot,
}: {
  pivots: any[];
  updatePivot: (i: number, patch: any) => void;
  addPivot: () => void;
  removePivot: (i: number) => void;
}) {
  const lastPivotValid =
    pivots.length === 0
      ? true
      : isRelayValid(pivots[pivots.length - 1]);

  return (
    <div className="space-y-8">
      {/* Chain Visualization */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
          Attacker (TUN)
        </span>

        {pivots.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-zinc-500">→</span>
            <span
              className={`px-2 py-1 rounded ${
                idx === pivots.length - 1
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-200"
              }`}
            >
              Relay {idx + 1}
            </span>
          </div>
        ))}

        <span className="text-zinc-500">→</span>
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
          Target
        </span>
      </div>

      {/* Relay Cards */}
      {pivots.map((pivot, idx) => {
        const isLast = idx === pivots.length - 1;

        return (
          <div
            key={idx}
            className="relative border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold">
                {idx === 0
                  ? "Entry Pivot (TUN)"
                  : `Relay Pivot #${idx}`}
              </h3>

              {isLast && pivots.length > 1 && (
                <button
                  onClick={() => removePivot(idx)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                >
                  ✕ Remove Relay
                </button>
              )}
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Attacker */}
              <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 space-y-3 shadow-lg">
                <h4 className="text-xs font-bold text-zinc-400">Attacker</h4>

                <IPInput
                  label="Attacker IP"
                  value={pivot.attackerIP}
                  onChange={(v) => updatePivot(idx, { attackerIP: v })}
                  info="Address the Ligolo proxy binds to. Usually 0.0.0.0 to listen on all interfaces."
                />

                <div className="flex flex-wrap gap-2">
                  <PortInput
                    label="Listener Port"
                    value={pivot.attackerPort}
                    onChange={(v) => updatePivot(idx, { attackerPort: v })}
                    info="The port the attacker is listening on"
                  />
                  <OSInput
                    label="OS"
                    value={pivot.attackerOS ?? "Linux"}
                    onChange={(v) => updatePivot(idx, { attackerOS: v })}
                    info="The operating system of the attacker machine"
                  />
                </div>
              </div>

              {/* Target */}
              <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 space-y-3 shadow-lg">
                <h4 className="text-xs font-bold text-zinc-400">Target</h4>

                <IPInput
                  label="Target IP"
                  value={pivot.targetIP}
                  onChange={(v) => updatePivot(idx, { targetIP: v })}
                  info="IP of the target machine"
                />

                <div className="flex flex-wrap gap-2">
                  {idx > 0 && (
                    <PortInput
                      label="Target Port"
                      value={pivot.targetPort}
                      onChange={(v) => updatePivot(idx, { targetPort: v })}
                      info="Port exposed by the previous relay"
                    />
                  )}

                  <OSInput
                    label="OS"
                    value={pivot.targetOS ?? "Linux"}
                    onChange={(v) => updatePivot(idx, { targetOS: v })}
                    info="The operating system of the target machine"
                  />
                </div>
              </div>

              {/* Routed Network */}
              <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 space-y-3 shadow-lg">
                <h4 className="text-xs font-bold text-zinc-400">Routed Network</h4>

                <IPInput
                  label="Network IP"
                  value={pivot.network}
                  onChange={(v) => updatePivot(idx, { network: v })}
                  info="The network that will be routed through this pivot."
                />

                <CIDRInput
                  value={pivot.cidr ?? 24}
                  onChange={(v) => updatePivot(idx, { cidr: v })}
                  info="The CIDR notation for the routed network."
                />
              </div>
            </div>

            {!isLast && (
              <div className="absolute top-4 right-4 text-[10px] text-zinc-500">
                Locked
              </div>
            )}
          </div>
        );
      })}

      {/* Add Relay */}
      <div className="flex justify-center pt-2">
        <button
          onClick={addPivot}
          disabled={!lastPivotValid}
          className={`flex items-center gap-2 px-4 py-2 rounded-md
                     border text-sm transition
                     ${
                       lastPivotValid
                         ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                         : "border-zinc-800 bg-zinc-950 text-zinc-500 cursor-not-allowed"
                     }`}
        >
          <span className="text-lg leading-none">＋</span>
          Add Relay
        </button>
      </div>
    </div>
  );
}
