"use client";

import { ChiselPivot, ChiselForward, ChiselMode, ChiselRelay } from "@/app/hooks/useChiselPivot";
import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { OSInput } from "@/app/components/inputs/OSInput";
import { TextInput } from "@/app/components/inputs/TextInput";
import { ChiselModeInput } from "@/app/components/inputs/ChiselModeInput";

export default function ChiselInputs({
  pivot,
  updatePivot,
  setMode,
  addForward,
  updateForward,
  removeForward,
  addRelay,
  updateRelay,
  removeRelay,
}: {
  pivot: ChiselPivot;
  updatePivot: (patch: Partial<ChiselPivot>) => void;
  setMode: (m: ChiselMode) => void;
  addForward: () => void;
  updateForward: (i: number, patch: Partial<ChiselForward>) => void;
  removeForward: (i: number) => void;
  addRelay: () => void;
  updateRelay: (i: number, patch: Partial<ChiselRelay>) => void;
  removeRelay: (i: number) => void;
}) {
  const isNormal = pivot.mode === "normal-forward";
  // In normal-forward the roles are flipped: server = pivot, client = attacker.
  // In both reverse modes: server = attacker, client = pivot.

  const serverColLabel = isNormal ? "Pivot (Server)" : "Attacker (Server)";
  const clientColLabel = isNormal ? "Attacker (Client)" : "Pivot 1 (Client)";

  const serverIPLabel = isNormal ? "Pivot IP" : "Attacker IP";
  const serverIPInfo = isNormal
    ? "IP of the pivot host running the Chisel server. Your attacker connects here."
    : "Your attacker machine IP — reachable by the pivot. The pivot client connects here.";

  const serverPortInfo = isNormal
    ? "Port the Chisel server listens on (pivot machine, default: 8080). Attacker connects here."
    : "Port the Chisel server listens on (attacker machine, default: 8080). Pivot connects here.";

  const serverOSInfo = isNormal
    ? "OS of the pivot host running the Chisel server."
    : "OS of the attacker machine running the Chisel server.";

  const clientOSInfo = isNormal
    ? "OS of the attacker machine running the Chisel client."
    : "OS of the pivot host (first hop) running the Chisel client.";

  return (
    <div className="space-y-6">
      {/* Chain visualization — only for reverse-socks with relays */}
      {pivot.mode === "reverse-socks" && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
            Attacker
          </span>
          <span className="text-zinc-500">←</span>
          <span className="px-2 py-1 rounded bg-blue-600 text-white">
            Pivot 1
          </span>
          {pivot.relays.map((_, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span className="text-zinc-500">←</span>
              <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
                Pivot {idx + 2}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* ── Base configuration card ── */}
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Server side */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                {serverColLabel}
              </h4>

              <div className="flex flex-wrap gap-3 mt-3">
                <IPInput
                  label={serverIPLabel}
                  value={pivot.serverIP}
                  onChange={v => updatePivot({ serverIP: v })}
                  placeholder={isNormal ? "10.10.10.100" : "192.168.1.10"}
                  info={serverIPInfo}
                />

                <PortInput
                  label="Chisel Port"
                  value={pivot.serverPort}
                  onChange={v => updatePivot({ serverPort: v })}
                  info={serverPortInfo}
                />

                <OSInput
                  label="OS"
                  value={pivot.serverOS}
                  onChange={v => updatePivot({ serverOS: v })}
                  info={serverOSInfo}
                />

                <ChiselModeInput
                  label="Mode"
                  value={pivot.mode}
                  onChange={setMode}
                  info="N = Normal: listener on client (attacker) — use when server/pivot has route to target  •  R = Reverse: listener on attacker — standard pentest mode  •  S = Reverse SOCKS5: full network pivot via proxy"
                />
              </div>
            </div>
          </div>

          {/* Client side */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              {clientColLabel}
            </h4>

            <div className="flex flex-wrap gap-3 mt-3">
              <OSInput
                label="OS"
                value={pivot.clientOS}
                onChange={v => updatePivot({ clientOS: v })}
                info={clientOSInfo}
              />
            </div>

            {/* SOCKS port — only for reverse-socks */}
            {pivot.mode === "reverse-socks" && (
              <div className="mt-3">
                <PortInput
                  label="SOCKS Port (attacker)"
                  value={pivot.socksPort}
                  onChange={v => updatePivot({ socksPort: v })}
                  info="Port on the attacker where the hop 1 SOCKS5 proxy will be available (default: 1080). Add 'socks5 127.0.0.1 1080' to proxychains.conf."
                />
              </div>
            )}

            {/* Port forward list — for normal-forward and reverse-forward */}
            {(pivot.mode === "normal-forward" || pivot.mode === "reverse-forward") && (
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                    {pivot.mode === "reverse-forward"
                      ? "Reverse Forwards (R:)"
                      : "Forwards"}
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
                        label="Port on Attacker"
                        value={f.localPort}
                        onChange={v => updateForward(i, { localPort: v })}
                        info={
                          pivot.mode === "normal-forward"
                            ? "Port that opens on the attacker (client). Access the service at http://localhost:<port> on the attacker."
                            : "Port that opens on the attacker (server, via R: prefix). Access the service at http://localhost:<port> on the attacker."
                        }
                      />
                      <TextInput
                        label="Target Host (via pivot)"
                        value={f.remoteHost}
                        onChange={v => updateForward(i, { remoteHost: v })}
                        placeholder="10.10.10.200"
                        info="IP or hostname the pivot can reach. The pivot connects to this host on behalf of the attacker."
                      />
                      <PortInput
                        label="Target Port"
                        value={f.remotePort}
                        onChange={v => updateForward(i, { remotePort: v })}
                        info="Port of the service on the target host (reachable from the pivot)."
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
                    <p className="text-xs text-zinc-500 italic">
                      No forwards defined
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Relay hop cards (reverse-socks only) ── */}
      {pivot.mode === "reverse-socks" && (
        <>
          {pivot.relays.map((relay, idx) => {
            const isLast = idx === pivot.relays.length - 1;
            const relayNum = idx + 1;       // Pivot N acting as relay
            const newHopNum = idx + 2;      // Pivot N+1 (new hop)

            return (
              <div
                key={idx}
                className="relative border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold">
                    Relay Pivot {relayNum} — Hop {newHopNum}
                  </h3>
                  {isLast && (
                    <button
                      onClick={() => removeRelay(idx)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                    >
                      ✕ Remove Relay
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Relay pivot setup */}
                  <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                      Pivot {relayNum} (Relay)
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Runs a second Chisel server for Pivot {newHopNum} to connect to,
                      then relays SOCKS back to the attacker.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <IPInput
                        label={`Pivot ${relayNum} Internal IP`}
                        value={relay.pivotInternalIP}
                        onChange={v => updateRelay(idx, { pivotInternalIP: v })}
                        placeholder="10.10.10.100"
                        info={`Internal IP of Pivot ${relayNum} — must be reachable by Pivot ${newHopNum}. Pivot ${newHopNum} connects here.`}
                      />
                      <PortInput
                        label="Relay Server Port"
                        value={relay.serverPort}
                        onChange={v => updateRelay(idx, { serverPort: v })}
                        info={`Port for the second Chisel server on Pivot ${relayNum} (default: 9090). Pivot ${newHopNum} connects here.`}
                      />
                      <PortInput
                        label={`Hop ${newHopNum} SOCKS Port (attacker)`}
                        value={relay.socksPort}
                        onChange={v => updateRelay(idx, { socksPort: v })}
                        info={`Port on the attacker for the hop ${newHopNum} SOCKS5 proxy (default: ${relay.socksPort}). Add to proxychains_hop${newHopNum}.conf.`}
                      />
                    </div>
                  </div>

                  {/* New hop */}
                  <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                      Pivot {newHopNum} (New Hop)
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Connects to Pivot {relayNum}&apos;s relay server with R:socks,
                      creating a SOCKS5 proxy on Pivot {relayNum} at port 1080.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <OSInput
                        label="OS"
                        value={relay.relayOS}
                        onChange={v => updateRelay(idx, { relayOS: v })}
                        info={`OS of Pivot ${newHopNum} — the new hop host.`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Relay button (mirrors Ligolo pattern) */}
          <div className="flex justify-center pt-2">
            <button
              onClick={addRelay}
              className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
            >
              <span className="text-lg leading-none">＋</span>
              Add Relay
            </button>
          </div>
        </>
      )}
    </div>
  );
}
