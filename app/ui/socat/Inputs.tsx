"use client";

import { SocatPivot, SocatHop, SocatMode } from "@/app/hooks/useSocatPivot";
import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { SocatModeInput } from "@/app/components/inputs/SocatModeInput";

export default function SocatInputs({
  pivot,
  updatePivot,
  setMode,
  updateHop,
}: {
  pivot: SocatPivot;
  updatePivot: (patch: Partial<SocatPivot>) => void;
  setMode: (m: SocatMode) => void;
  updateHop: (i: number, patch: Partial<SocatHop>) => void;
}) {
  const hop = pivot.hops[0];
  const isTty = pivot.mode === "tty-shell";
  const isForward = pivot.mode === "tcp-forward" || pivot.mode === "udp-forward";

  const leftTitle = isTty ? "Attacker (Listener)" : "Relay Host";
  const rightTitle = isTty ? "Target (Connect-Back)" : "Target (Internal Service)";

  return (
    <div className="space-y-6">
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: relay host or attacker listener ── */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                {leftTitle}
              </h4>

              <div className="flex flex-wrap gap-3 mt-3">
                {isForward && (
                  <IPInput
                    label="Relay IP"
                    value={hop.relayIP}
                    onChange={v => updateHop(0, { relayIP: v })}
                    placeholder="e.g. 192.168.1.20"
                    info="IP of the relay (pivot) host — the machine socat runs on. Must be reachable from your attacker."
                  />
                )}

                <PortInput
                  label={isTty ? "Listen Port (attacker)" : "Listen Port (relay)"}
                  value={isTty ? pivot.ttyListenPort : hop.listenPort}
                  onChange={v =>
                    isTty
                      ? updatePivot({ ttyListenPort: v })
                      : updateHop(0, { listenPort: v })
                  }
                  info={
                    isTty
                      ? "Port your socat listener opens on YOUR machine. The target must be able to reach this port."
                      : "Port socat opens on the relay host. Your attacker connects here, and socat forwards each connection to the target."
                  }
                />

                <SocatModeInput
                  label="Mode"
                  value={pivot.mode}
                  onChange={setMode}
                  info="T: TCP port forward  •  U: UDP port forward  •  S: TTY reverse shell (target connects back to attacker)"
                />
              </div>
            </div>
          </div>

          {/* ── Right: target destination or attacker IP ── */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
              {rightTitle}
            </h4>

            {isForward && (
              <div className="flex flex-wrap gap-3 mt-3">
                <IPInput
                  label="Target IP"
                  value={hop.targetIP}
                  onChange={v => updateHop(0, { targetIP: v })}
                  placeholder="e.g. 10.10.10.200"
                  info="IP of the internal service socat forwards traffic to. The relay host must be able to reach this address."
                />
                <PortInput
                  label="Target Port"
                  value={hop.targetPort}
                  onChange={v => updateHop(0, { targetPort: v })}
                  info="Port of the service on the internal target host — e.g. 80 (HTTP), 443 (HTTPS), 22 (SSH), 445 (SMB)."
                />
              </div>
            )}

            {isTty && (
              <div className="flex flex-wrap gap-3 mt-3">
                <IPInput
                  label="Attacker IP"
                  value={pivot.attackerIP}
                  onChange={v => updatePivot({ attackerIP: v })}
                  placeholder="e.g. 192.168.1.10"
                  info="Your machine's IP. The target calls back here — run the socat listener on your machine first."
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
