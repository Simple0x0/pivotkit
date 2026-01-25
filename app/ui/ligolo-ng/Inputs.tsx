"use client";

import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { OSInput } from "@/app/components/inputs/OSInput";
import { CIDRInput } from "@/app/components/inputs/CIDRInput";

/* ---------------- Validation ---------------- */
const isPivotValid = (pivot: any) => {
  if (!pivot.attackerPort) return false;
  if (!pivot.network) return false;
  if (!pivot.cidr) return false;

  if (pivot.role === "relay") {
    if (!pivot.targetIP) return false;
    if (!pivot.targetPort) return false;
  }

  if (pivot.role === "entry" && !pivot.attackerBindIP) return false;

  return true;
};

/* ---------------- Component ---------------- */
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
    pivots.length === 0 ? true : isPivotValid(pivots[pivots.length - 1]);

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

      {/* Pivot Cards - Scrollable Container */}
      <div className="scrollable max-h-[70vh] overflow-y-auto pr-2 space-y-6">
        {pivots.map((pivot, idx) => {
          const isLast = idx === pivots.length - 1;
          const isEntry = pivot.role === "entry";

          return (
            <div
              key={idx}
              className="relative border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold">
                  {isEntry ? "Entry Pivot (TUN)" : `Relay Pivot #${idx}`}
                </h3>

                {!isEntry && isLast && pivots.length > 1 && (
                  <button
                    onClick={() => removePivot(idx)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                  >
                    ✕ Remove Relay
                  </button>
                )}
              </div>

              {/* Body */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  isEntry ? "lg:grid-cols-2" : "lg:grid-cols-3"
                } gap-6`}
              >
                {/* Attacker Section */}
                <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                      Attacker
                    </h4>
                    <div className="flex flex-row flex-wrap gap-3 mt-2">
                      {isEntry && (
                        <IPInput
                          label="Attacker IP"
                          value={pivot.attackerIP}
                          onChange={(v) => updatePivot(idx, { attackerIP: v })}
                          info="IP address of the attacker machine reachable by the compromised host."
                          placeholder="e.g. 192.168.10.5"
                        />
                      )}

                      <PortInput
                        label="Listener Port"
                        value={pivot.attackerPort}
                        onChange={(v) => updatePivot(idx, { attackerPort: v })}
                        info={
                          isEntry
                            ? "A port for ligolo proxy to listen on (default: 11601)."
                            : "Attacker local port which ligolo agent forwards traffic to."
                        }
                      />
                    </div>
                  </div>
                  {isEntry && (
                    <OSInput
                      label="Target OS"
                      value={pivot.targetOS}
                      onChange={(v) => updatePivot(idx, { targetOS: v })}
                      info="Operating system of the target machine (default: linux)."
                    />
                  )}
                </div>

                {/* Target Section (relay only) */}
                {!isEntry && (
                  <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                        Target
                      </h4>
                      <div className="flex flex-row flex-wrap gap-3 mt-2">
                        <IPInput
                          label="Compromised Host IP"
                          value={pivot.targetIP}
                          onChange={(v) => updatePivot(idx, { targetIP: v })}
                          info={`IP address of the previously compromised host (Relay ${idx}) providing access to the new network.`}
                          placeholder="e.g. 10.10.30.1"
                        />

                        <PortInput
                          label="Target Port"
                          value={pivot.targetPort}
                          onChange={(v) => updatePivot(idx, { targetPort: v })}
                          info="Port exposed on the previously compromised host to relay traffic."
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <OSInput
                        label="Target OS"
                        value={pivot.targetOS}
                        onChange={(v) => updatePivot(idx, { targetOS: v })}
                        info="Operating system of the previously compromised host."
                      />
                    </div>
                  </div>
                )}

                {/* Routed Network Section */}
                <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                      Routed Network
                    </h4>
                    <div className="flex flex-row flex-wrap gap-3 mt-2">
                      <IPInput
                        label="Network IP"
                        value={pivot.network}
                        onChange={(v) => updatePivot(idx, { network: v })}
                        info="The new network that will be routed through this pivot."
                        placeholder="e.g. 10.10.30.0"
                      />

                      <CIDRInput
                        label="Network CIDR"
                        value={pivot.cidr}
                        onChange={(v) => updatePivot(idx, { cidr: v })}
                        info="CIDR notation for the new network to be routed (e.g. 24)."
                      />
                    </div>
                  </div>
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
      </div>

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
