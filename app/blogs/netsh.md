Netsh is a Windows built-in command-line utility that manages network settings on Windows hosts. Its `interface portproxy` subcommand configures persistent port-forwarding rules that redirect TCP traffic from one address and port to another. Critically, this requires no external binary — netsh ships with every Windows installation from XP onward, making it the canonical living-off-the-land (LotL) port forwarding technique on Windows.

When you have a foothold on a Windows machine that sits between the attacker and a network segment, netsh portproxy turns that machine into a TCP relay with a single administrative command. No agent upload. No download. No dependency. The only requirement is that the user context has Administrator privileges, because netsh portproxy modifies system networking state.

### Why Netsh?

Every other tunnelling technique covered in these guides requires uploading a binary to the target. Netsh eliminates that risk entirely. Binary transfers are a common detection vector: AV scans new executables, EDR solutions flag unknown or unsigned binaries, and blue teams monitor for unusual executables in temp directories. When a compromised Windows host has Administrator access, netsh portproxy is often the lowest-footprint method available.

The tradeoff is a narrow feature set: TCP only, no encryption, no SOCKS proxy, no multi-hop chaining beyond manually configuring multiple rules across multiple hosts.

### TL;DR

```batch
rem Add the rule (Administrator required)
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8080 connectaddress=10.10.30.200 connectport=80

rem Verify
netsh interface portproxy show all

rem Allow inbound traffic through Windows Firewall
netsh advfirewall firewall add rule name="Pivot-8080" protocol=TCP dir=in localport=8080 action=allow

rem Cleanup
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=8080
```

### Requirements

Administrator privileges are mandatory. Running netsh portproxy as a standard user returns "Access is denied." If your shell is running as a low-privileged user, you must escalate privileges first.

Windows Firewall is active by default and will block inbound connections to the listener port unless an explicit allow rule is added. The firewall rule addition is a separate netsh command and is included in the steps below.

> [!NOTE]
> Portproxy rules created with netsh persist across reboots. They are stored in the registry under HKLM\SYSTEM\CurrentControlSet\Services\PortProxy. This means if you forget to clean up, the rule will still be active after the machine reboots and may expose internal services indefinitely.

### Lab Topology

| Host                    | Primary IP    | Secondary IP  | Open Ports      | Role           |
| ----------------------- | ------------- | ------------- | --------------- | -------------- |
| Attacker (Kali)         | 192.168.1.10  | N/A           | N/A             | Attack Box     |
| Windows Proxy Host      | 192.168.1.13  | 10.10.30.201  | 8080 (proxied)  | Jump Host      |
| Internal Target         | 10.10.30.200  | N/A           | 80, 3389        | Internal Host  |

The attacker has Administrator access to the Windows Proxy Host and cannot reach the Internal Target directly.

### Step 1: Add the Port Proxy Rule

Open an Administrator command prompt or PowerShell session on the Windows Proxy Host and run:

```batch
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8080 connectaddress=10.10.30.200 connectport=80
```

Breaking down the arguments:

- `v4tov4` — both the listen side and connect side use IPv4. Other valid values are `v4tov6`, `v6tov4`, `v6tov6`.
- `listenaddress=0.0.0.0` — listen on all available network interfaces. Use a specific IP to restrict the listener to one interface.
- `listenport=8080` — the port that will accept inbound connections on the proxy host.
- `connectaddress=10.10.30.200` — the destination IP that inbound connections will be forwarded to.
- `connectport=80` — the port at the destination.

When a client connects to `192.168.1.13:8080`, Windows silently forwards that connection to `10.10.30.200:80`. The forwarding is transparent — the destination service sees a connection originating from the proxy host.

### Step 2: Verify the Rule

```batch
netsh interface portproxy show all
```

Expected output:

```
Listen on ipv4:             Connect to ipv4:

Address         Port        Address         Port
--------------- ----------  --------------- ----------
0.0.0.0         8080        10.10.30.200    80
```

If the rule does not appear, verify that you ran the command with Administrator privileges.

### Step 3: Add the Firewall Rule

By default, Windows Firewall will block inbound connections to the new listener port. Add an allow rule:

```batch
netsh advfirewall firewall add rule name="Pivot-8080" protocol=TCP dir=in localport=8080 action=allow
```

You can verify the firewall rule was added:

```batch
netsh advfirewall firewall show rule name="Pivot-8080"
```

> [!NOTE]
> If the Windows host is domain-joined, Group Policy may override local firewall rules or push new firewall policies that remove your rule. Check whether the firewall state changes after a Group Policy refresh.

### Step 4: Access the Internal Service

From the attacker:

```bash
curl http://192.168.1.13:8080
```

The request goes to the Windows proxy on port 8080, gets forwarded to `10.10.30.200:80`, and the response returns through the same path.

For RDP access through the proxy:

```batch
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=3390 connectaddress=10.10.30.200 connectport=3389
```

Then connect from the attacker: `rdesktop 192.168.1.13:3390`

### Step 5: Cleanup

When the operation is complete, remove the portproxy rule and the firewall rule to restore the host to its original state:

```batch
rem Delete the portproxy rule
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=8080

rem Delete the firewall rule
netsh advfirewall firewall delete rule name="Pivot-8080"
```

Verify cleanup:

```batch
netsh interface portproxy show all
```

The output should be empty or show no entries for the port you removed.

### Operational Security Notes

Portproxy rules are visible via `netsh interface portproxy show all` and via `netstat -ano` which will show the listening TCP socket. Any red team operation that enumerates open ports on the proxy host will see the listener. On a heavily monitored host, a new listening port on an unusual port number may trigger an alert. Consider using a port that blends with normal business traffic (e.g., 443, 8443, 3389 if those are already expected).

Portproxy rule creation is logged in the Windows Security Event Log if object access auditing is enabled. The registry keys under HKLM\SYSTEM\CurrentControlSet\Services\PortProxy are modified — forensic analysis will find evidence of portproxy configuration even after cleanup because registry hives are backed up in volume shadow copies.

Netsh portproxy only supports TCP. It cannot forward UDP. For UDP services like DNS or SNMP, use socat or another tool on a Linux relay.

### Troubleshooting

Add command returns "Access is denied": You are not running as Administrator. Open an elevated command prompt or use `runas /user:COMPUTERNAME\Administrator cmd`.

Rule exists but connections are refused: The Windows Firewall allow rule may be missing or overridden by GPO. Check with `netsh advfirewall show currentprofile state`.

Rule exists and firewall is configured but connections still fail: Verify that the destination service is actually running and listening on the connectaddress and connectport. Test from the proxy host directly: `telnet 10.10.30.200 80`.

Multiple rules causing confusion: Run `netsh interface portproxy show all` to list all active rules. Delete specific rules using the listenaddress and listenport to identify them.

### Quick Reference

| Action          | Command                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------|
| Add rule        | `netsh interface portproxy add v4tov4 listenaddress=LADDR listenport=LPORT connectaddress=CADDR connectport=CPORT` |
| Show rules      | `netsh interface portproxy show all`                                                    |
| Allow firewall  | `netsh advfirewall firewall add rule name="NAME" protocol=TCP dir=in localport=PORT action=allow` |
| Delete rule     | `netsh interface portproxy delete v4tov4 listenaddress=LADDR listenport=LPORT`          |
| Delete firewall | `netsh advfirewall firewall delete rule name="NAME"`                                    |

### When to Use Netsh vs Alternatives

Use netsh when: the pivot host is Windows, you have Administrator access, and you want to avoid transferring any binary. It is the ideal LotL technique on Windows segment bridges.

Use socat when: the pivot host is Linux and you want the same simplicity with a tool that is likely already installed.

Use Chisel when: you need encryption, a SOCKS proxy, or the firewall blocks your relay but allows outbound HTTP.

Use Ligolo-ng when: you need full native routing across multiple hops without configuring individual forwards per service.
