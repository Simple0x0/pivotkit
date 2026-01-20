# PivotKit

PivotKit is **not a pivoting tool**.  
PivotKit is a **deterministic command generator** for network pivoting operations.

It consumes **normalized parameters** and outputs **fully rendered, ready‑to‑execute commands** for specific pivoting tools, based strictly on their **technical category and constraints**.

PivotKit is part of the **NetPivot‑X** project.

---

## Core Principle

> **Same input → same output. No interpretation. No prose. No guesswork.**

PivotKit does **not**:
- Execute commands
- Deploy payloads
- Maintain sessions
- Act as a C2
- Perform discovery or validation

PivotKit **only** generates commands.

---

## Input Model (Normalized)

All tools consume the same normalized parameter set.  
Unused parameters are ignored by tools that do not require them.

### Required Parameters

- `attacker_ip`
- `attacker_ports`
- `target_ip`
- `target_ports`
- `pivot_network`
- `cidr`

### Optional Parameters

- `interface`
- `protocol`
- `os`
- `privilege_level`
- `mode` (reverse / bind)
- `transport` (tun / socks / relay)
- `notes` (ignored by generator)

---

## Output Model

PivotKit outputs:

- Fully rendered commands
- Tool‑specific syntax
- Correct flag ordering
- Context‑aware mode selection
- No explanations, no comments, no markdown

**Architecture**

[Server] Layout.tsx
    ├─ ToolMenu (server component)
    └─ UserInputs (client component)  ← persistent across pages
[Server] page.tsx (/)
    └─ Workspace placeholder (optional)
[Server] /tools/[tool]/page.tsx
    ├─ Tool-specific Workspace (client component)
    └─ Receives inputs from UserInputs (via React context or state lift)
