# OpenClaw AI Employee Kit

I built this because my "super agent" kept failing in the most annoying ways.

I kept giving one agent too many jobs at once: coding, research, marketing, design, operations, outreach. I gave it more context, more tools, more skills, more instructions. It looked powerful on paper.

In practice, it kept breaking down:

- wrong tool calls
- wrong skill calls
- shallow context switching
- missing scheduled jobs
- forgotten details
- passive behavior unless I kept poking it
- too much confidence for work it did not actually finish

The problem was not that the model was useless. The problem was the shape.

What worked better was much simpler:

- split the work into narrower agents
- give each one a real role
- keep their context limited
- keep their tools relevant to that role
- define clear approval boundaries
- make them proactive on a schedule
- make them write memory and receipts so they do not "feel" productive while doing nothing

This repo is the system I wanted when I was trying to make that shift.

It helps you build AI employees that are:

- narrower
- more reliable
- easier to reason about
- easier to harden
- easier to run together inside one OpenClaw setup

Not a magical AGI employee. A better operating model.

## What this is

This repo gives you a way to:

- generate an OpenClaw + Obsidian vault for a role-specific agent
- apply a role pack
- apply an OpenClaw hardening profile
- apply a fleet pack if the agent belongs to a company roster
- validate the result
- package it into a zip

It also includes a simpler path for people who do not want to hand-edit specs:

- give the repo to an AI agent
- give it the setup prompt and questionnaire
- let it interview you
- let it generate the vault for you

## Why this needs to exist

Most agent setups are still too vague.

They define a personality and a goal, then hope the runtime will do the rest.

That is usually where things fall apart.

If you want an agent to behave more like an employee, you need more than a system prompt. You need:

- role boundaries
- approval rules
- memory discipline
- scheduled proactivity
- action receipts
- reflection
- handoffs if multiple agents are involved

This repo is opinionated about that.

## The core idea

Do not start with one giant agent that supposedly runs your company.

Start with a narrow role:

- sales support
- marketing support
- research analyst
- ops assistant
- data analyst / Q&A layer

Then harden that role until it is dependable.

If you need more coverage, add another narrow agent instead of bloating the first one.

## Two ways to use it

### 1. Toolkit mode

Use the CLI, specs, role packs, hardening profiles, and validation flow directly.

This is the better path if you are technical and want deterministic control.

### 2. Guided setup mode

Give this repo to an AI agent together with:

- [`prompts/OPENCLAW_AGENT_SETUP_OPERATOR.md`](./prompts/OPENCLAW_AGENT_SETUP_OPERATOR.md)
- [`questions/AGENT_SETUP_QUESTIONNAIRE.md`](./questions/AGENT_SETUP_QUESTIONNAIRE.md)

That setup operator should:

- read the repo
- ask you the setup questions
- create the spec
- generate the vault
- validate it
- package the zip

This is the easier path if you just want the repo to behave like a setup system.

## What is implemented right now

Working commands:

- `init-spec`
- `wizard`
- `print-setup-prompt`
- `print-setup-questionnaire`
- `list-role-packs`
- `list-fleet-packs`
- `generate-vault`
- `apply-role-pack`
- `apply-openclaw-hardening`
- `apply-fleet-pack`
- `validate-vault`
- `package-zip`

Implemented scaffolding:

- role packs
- hardening profile
- fleet pack schema
- action receipt scaffolding
- memory reflection scaffolding
- fleet handoff scaffolding
- smoke-tested generation flow

## Quickstart

```bash
corepack pnpm install
corepack pnpm build

# create a starter spec
npm run employee-kit -- init-spec --yaml --out ./agent.spec.yaml

# or use the interactive setup flow
npm run employee-kit -- wizard --out ./agent.spec.yaml

# generate a vault
npm run employee-kit -- generate-vault --spec ./agent.spec.yaml

# optional overlays
npm run employee-kit -- apply-role-pack --path ./generated/new-agent-openclaw-vault --role marketing-support
npm run employee-kit -- apply-openclaw-hardening --path ./generated/new-agent-openclaw-vault --profile standard-proactive
npm run employee-kit -- apply-fleet-pack --path ./generated/new-agent-openclaw-vault --fleet small-startup-core

# validate and package
npm run employee-kit -- validate-vault --path ./generated/new-agent-openclaw-vault
npm run employee-kit -- package-zip --path ./generated/new-agent-openclaw-vault
```

## If you only want the simplest path

Run:

```bash
npm run employee-kit -- print-setup-prompt
```

Then give that prompt, this repo, and the questionnaire to your AI setup operator.

## Smoke test

```bash
npm run smoke
```

## Repo structure

- `docs/` — the deeper design docs
- `questions/` — setup questionnaire
- `prompts/` — setup operator prompt
- `packages/` — CLI, generator, runtime helpers, schemas
- `role-packs/` — role overlays
- `fleet-packs/` — multi-agent overlays
- `examples/` — starter specs
- `schemas/` — public YAML schemas

## Important note

This repo is not trying to make agents "smarter" by magic.

When I say self-improving, I mean:

- better context over time
- better memory over time
- better reflection over time
- better role fit over time

Not model self-modification.

## Core docs

- [Simple Mode](./docs/SIMPLE_MODE.md)
- [Repo Blueprint](./docs/REPO_BLUEPRINT.md)
- [Universal Agent Zip Factory](./docs/UNIVERSAL_OPENCLAW_AGENT_ZIP_FACTORY_BRIEF.md)
- [OpenClaw Proactive Agent Hardening Guide](./docs/OPENCLAW_PROACTIVE_AGENT_HARDENING_GUIDE.md)
- [Document Map](./docs/OPENCLAW_AGENT_FACTORY_DOCUMENT_MAP.md)
