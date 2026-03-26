# OpenClaw Agent Factory Document Map

## Purpose

This document explains how the standalone docs fit together.

If you are building an AI employee workspace, do **not** treat every document as the same layer.

There are at least two layers:

1. the **agent creation layer**
2. the **runtime hardening layer**

And often a third:

3. the **company role-pack / fleet layer**

## Document roles

### 1. Universal generator

Document:

- [`UNIVERSAL_OPENCLAW_AGENT_ZIP_FACTORY_BRIEF.md`](./UNIVERSAL_OPENCLAW_AGENT_ZIP_FACTORY_BRIEF.md)

This is the creation document.

It defines:

- who the agent is
- what the role is
- what goals it owns
- what memory it keeps
- what files and folders exist
- what approval model applies
- what success looks like

This layer should remain reusable even if the harness changes later.

### 2. OpenClaw hardening guide

Document:

- [`OPENCLAW_PROACTIVE_AGENT_HARDENING_GUIDE.md`](./OPENCLAW_PROACTIVE_AGENT_HARDENING_GUIDE.md)

This is the runtime document.

It defines:

- how to make the agent proactive inside OpenClaw
- how heartbeat should be used
- how cron should be used
- how hooks should be used
- how to avoid context drift
- how to handle browser/computer-use reliability
- how to use subagents safely

This layer is harness-specific.

### 3. Company role packs and fleet overlays

These are optional overlays built on top of the first two layers.

They define:

- the company roster of agents
- role boundaries between them
- shared systems
- handoff surfaces
- company-specific operating conventions

## Correct application order

### Step 1

Use the universal generator brief to create the base workspace.

### Step 2

Apply the OpenClaw hardening guide to wire the runtime so the agent actually behaves like a proactive employee.

### Step 3

Optionally add role-specific or company-specific overlays.

Examples:

- marketing operator overlay
- sales rep overlay
- research analyst overlay
- founder chief-of-staff overlay

### Step 4

If the company will run multiple AI employees, add a fleet layer:

- define agent roster
- define ownership boundaries
- define shared systems
- define handoff notes and status surfaces

## Why this split is best

If you merge creation and hardening into one big document:

- the generator becomes bloated
- OpenClaw-specific details leak into the universal spec
- future runtime swaps become painful
- builders confuse identity with orchestration

If you separate them:

- the employee definition stays clean
- the runtime hardening stays practical
- the role overlays stay modular

If you also add a fleet layer:

- multi-agent deployment becomes cleaner
- role overlap is reduced
- handoffs become explicit
- hiring new agents later becomes easier

## Quick rule

Use the universal brief to answer:

> What is this agent?

Use the hardening guide to answer:

> How do we make OpenClaw behave like that agent reliably?

Use a role-pack or fleet overlay to answer:

> How does this agent fit into this specific company alongside other agents and humans?
