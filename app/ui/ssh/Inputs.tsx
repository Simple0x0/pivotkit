"use client";

import { IPInput } from "@/app/components/inputs/IPInput";
import { PortInput } from "@/app/components/inputs/PortInput";
import { SSHModeInput } from "@/app/components/inputs/SSHModeInput";
import { TextInput as UsernameInput } from "@/app/components/inputs/TextInput";
import InfoTooltip from "@/app/components/InfoTooltip";
import { SSHPivot, SSHForward } from "@/app/hooks/useSSHPivot";

/* ---------------- Validation ---------------- */

const isSSHPivotValid = (pivot: SSHPivot) => {
  if (!pivot.targetIP) return false;
  if (!pivot.targetUser) return false;
  if (!pivot.sshPort) return false;

  if (pivot.mode === "dynamic") {
    return !!pivot.socksPort;
  }

  return (
    pivot.forwards.length > 0 &&
    pivot.forwards.every(
      f => f.bindPort && f.forwardHost && f.forwardPort
    )
  );
};

/* ---------------- Component ---------------- */

export default function SSHInputs({
  pivot,
  updatePivot,
  setMode,
  addForward,
  updateForward,
  removeForward,
}: {
  pivot: SSHPivot;
  updatePivot: (patch: Partial<SSHPivot>) => void;
  setMode: (m: "local" | "remote" | "dynamic") => void;
  addForward: () => void;
  updateForward: (i: number, patch: Partial<SSHForward>) => void;
  removeForward: (i: number) => void;
}) {
  const valid = isSSHPivotValid(pivot);

  return (
    <div className="space-y-8">
      {/* SSH Pivot Card */}
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ---------------- Target (50% width) ---------------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                SSH Target
              </h4>

              <div className="flex flex-wrap gap-3 mt-3">
                <IPInput
                  label="SSH Server IP"
                  value={pivot.targetIP}
                  onChange={v => updatePivot({ targetIP: v })}
                  placeholder="172.59.91.150"
                  info={
                          pivot.mode === "local"
                            ? "SSH server (VICTIM / TARGET) IP address the ATTACKER connects to."
                            : "SSH server (ATTACKER) IP address the TARGET connects to."
                        }
                />

                <PortInput
                  label="SSH Port"
                  value={pivot.sshPort}
                  onChange={v => updatePivot({ sshPort: v })}
                  info={
                          pivot.mode === "local"
                            ? "SSH service port on the target (default: 22)."
                            : "SSH service port on the attacker (default: 22)."
                  }
                />

                <UsernameInput
                  label="SSH User"
                  value={pivot.targetUser}
                  onChange={v => updatePivot({ targetUser: v })}
                  placeholder="Targetuser"
                  info={
                          pivot.mode === "local"
                            ? "Username used to authenticate on the target SSH server."
                            : "Username used to authenticate on the attacker SSH server."
                  }
                />

                <SSHModeInput
                  label="Mode"
                  value={pivot.mode}
                  onChange={setMode}
                  info="L: access victim internal services  • R: access remote internal services via victim • D: SOCKS pivot through victim"
                />
              </div>
            </div>
          </div>

          {/* ---------------- Forwards / SOCKS (50%) ---------------- */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-gray-950 shadow-lg">
            {pivot.mode !== "dynamic" ? (
              <>
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                    {pivot.mode === "local"
                      ? "Local Forwards (-L)"
                      : "Remote Forwards (-R)"}
                  </h4>

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
                        label="Bind Port"
                        value={f.bindPort}
                        onChange={v =>
                          updateForward(i, { bindPort: v })
                        }
                        info={`Port to be opened on the attacker machine – You can access it via localhost:${f.bindPort}`}
                      />

                      <IPInput
                        label="Forward Host"
                        value={f.forwardHost}
                        onChange={v => updateForward(i, { forwardHost: v })}
                        placeholder={
                            pivot.mode === "local"
                            ? "127.0.0.1"
                            : "172.16.5.80"
                        }
                        info={
                            pivot.mode === "local"
                            ? "Local address of the target (service destination)."
                            : "Remote address of the target (service destination)."
                        }
                        />


                      <PortInput
                        label="Forward Port"
                        value={f.forwardPort}
                        onChange={v =>
                          updateForward(i, { forwardPort: v })
                        }
                        info="Which port is the service running on?"
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
              </>
            ) : (
              <>
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                  Dynamic SOCKS (-D)
                </h4>

                <div className="flex items-center gap-3 mt-3">
                  <PortInput
                    label="SOCKS Port"
                    value={pivot.socksPort!}
                    onChange={v =>
                      updatePivot({ socksPort: v })
                    }
                    info="Local SOCKS proxy port opened on the attacker machine (e.g. 1080)."
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
