"use client";

import { NetshPivot, NetshProtocol } from "@/app/hooks/useNetshPivot";
import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";

const PROTOCOLS: NetshProtocol[] = ["v4tov4", "v4tov6", "v6tov4", "v6tov6"];

export default function NetshInputs({
  pivot,
  updatePivot,
}: {
  pivot: NetshPivot;
  updatePivot: (patch: Partial<NetshPivot>) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ----------- Listen ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              Listen (Proxy Host)
            </h4>
            <div className="flex flex-wrap gap-3 mt-3">
              <IPInput
                label="Listen Address"
                value={pivot.listenIP}
                onChange={v => updatePivot({ listenIP: v })}
                placeholder="0.0.0.0"
                info="IP address to bind the listener on. Use 0.0.0.0 to accept on all interfaces."
              />
              <PortInput
                label="Listen Port"
                value={pivot.listenPort}
                onChange={v => updatePivot({ listenPort: v })}
                info="Port to open on the Windows proxy host."
              />
            </div>

            {/* Protocol selector */}
            <div className="mt-3">
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                Protocol
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PROTOCOLS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updatePivot({ protocol: p })}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      pivot.protocol === p
                        ? "bg-blue-900 text-white border-blue-700"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ----------- Connect ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              Connect (Destination)
            </h4>
            <div className="flex flex-wrap gap-3 mt-3">
              <IPInput
                label="Connect Address"
                value={pivot.connectIP}
                onChange={v => updatePivot({ connectIP: v })}
                placeholder="10.10.30.200"
                info="Destination IP that traffic will be forwarded to."
              />
              <PortInput
                label="Connect Port"
                value={pivot.connectPort}
                onChange={v => updatePivot({ connectPort: v })}
                info="Port of the service on the destination host."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
