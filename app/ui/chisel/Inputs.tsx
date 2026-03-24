"use client";

import { ChiselPivot, ChiselForward, ChiselMode } from "@/app/hooks/useChiselPivot";
import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { OSInput } from "@/app/components/inputs/OSInput";
import { TextInput } from "@/app/components/inputs/TextInput";

const MODES: { id: ChiselMode; label: string }[] = [
  { id: "reverse-socks", label: "Rev SOCKS" },
  { id: "local-forward", label: "Local Fwd" },
  { id: "remote-forward", label: "Remote Fwd" },
];

export default function ChiselInputs({
  pivot,
  updatePivot,
  setMode,
  addForward,
  updateForward,
  removeForward,
}: {
  pivot: ChiselPivot;
  updatePivot: (patch: Partial<ChiselPivot>) => void;
  setMode: (m: ChiselMode) => void;
  addForward: () => void;
  updateForward: (i: number, patch: Partial<ChiselForward>) => void;
  removeForward: (i: number) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ----------- Server (Attacker) ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                Server (Attacker)
              </h4>

              <div className="flex flex-wrap gap-3 mt-3">
                <IPInput
                  label="Server IP"
                  value={pivot.serverIP}
                  onChange={v => updatePivot({ serverIP: v })}
                  placeholder="192.168.1.10"
                  info="IP address reachable by the target/client."
                />

                <PortInput
                  label="Server Port"
                  value={pivot.serverPort}
                  onChange={v => updatePivot({ serverPort: v })}
                  info="Port the chisel server listens on (default: 8080)."
                />

                <OSInput
                  label="Server OS"
                  value={pivot.serverOS}
                  onChange={v => updatePivot({ serverOS: v })}
                  info="OS of the machine running the chisel server."
                />
              </div>

              {/* Mode selector */}
              <div className="mt-4">
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  Mode
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
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
            </div>
          </div>

          {/* ----------- Client (Target) ----------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              Client (Target)
            </h4>

            <div className="flex flex-wrap gap-3 mt-3">
              <OSInput
                label="Client OS"
                value={pivot.clientOS}
                onChange={v => updatePivot({ clientOS: v })}
                info="OS of the machine running the chisel client."
              />
            </div>

            {pivot.mode === "reverse-socks" && (
              <div className="mt-3">
                <PortInput
                  label="SOCKS Port"
                  value={pivot.socksPort}
                  onChange={v => updatePivot({ socksPort: v })}
                  info="Local SOCKS5 proxy port on the attacker (default: 1080)."
                />
              </div>
            )}

            {(pivot.mode === "local-forward" || pivot.mode === "remote-forward") && (
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                    {pivot.mode === "local-forward" ? "Local Forwards" : "Remote Forwards"}
                  </h5>
                  <button
                    onClick={addForward}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    ＋ Add Forward
                  </button>
                </div>

                <div className="space-y-3 mt-3">
                  {pivot.forwards.map((f, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-end gap-3 border border-zinc-800 rounded-md p-2"
                    >
                      <PortInput
                        label="Local Port"
                        value={f.localPort}
                        onChange={v => updateForward(i, { localPort: v })}
                        info="Port opened on the attacker to access the forwarded service."
                      />
                      <TextInput
                        label="Remote Host"
                        value={f.remoteHost}
                        onChange={v => updateForward(i, { remoteHost: v })}
                        placeholder="127.0.0.1"
                        info="Destination host reachable from the target."
                      />
                      <PortInput
                        label="Remote Port"
                        value={f.remotePort}
                        onChange={v => updateForward(i, { remotePort: v })}
                        info="Port of the service on the remote host."
                      />
                      <button
                        onClick={() => removeForward(i)}
                        className="text-xs text-red-400 hover:text-red-300 ml-auto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {pivot.forwards.length === 0 && (
                    <p className="text-xs text-zinc-500 italic">No forwards defined</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
