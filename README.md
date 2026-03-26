# OpenClaw AI Employee Kit

I built this because my "super agent" kept failing in the most annoying ways.

I kept trying to make one OpenClaw agent do everything: coding, research, marketing, design, operations, outreach. I gave it more context, more tools, more skills, more instructions. It looked impressive on paper.

In practice, it kept breaking down:

- wrong tool calls
- wrong skill calls
- shallow context switching
- missing scheduled jobs
- forgotten details
- passive behavior unless I kept poking it
- too much confidence for work it did not actually finish

The problem was not that the model was useless. The problem was the shape.

What started working for me was much simpler:

- split the work into narrower agents
- give each one a real role
- keep their context limited
- keep their tools relevant to that role
- define clear approval boundaries
- make them proactive on a schedule
- make them write memory and receipts so they do not "feel" productive while doing nothing

But the bigger shift was this:

I stopped treating them like floating assistants.

I started treating them more like employees.

That means each agent can have:

- its own role and target
- its own inbox or email account
- its own browser profile already logged into the tools it needs
- its own social or messaging surface if the job needs it
- its own memory
- its own manager
- its own reporting rhythm
- its own approval boundary

That is the opinionated part of this repo.

I think AI employees work better when you give them employee-shaped reality.

Not just a prompt. Not just a pile of tools. Not just a giant memory file.

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

Most agent setups are still too vague, too ambitious, or too detached from how real work actually happens.

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
- real accounts and real operating surfaces when the role needs them
- clear rules for private context, shared context, and channel-specific behavior

This repo is opinionated about that.

## My current opinion

If you want an AI employee to actually become useful, give it a job that looks like a real job.

That usually means:

- a real email account
- a real browser profile
- access to the real tools for that role
- a real reporting line
- a real KPI
- a real channel where people can reach it
- memory that survives day to day

If the role is internal, that could mean Slack, Discord, WhatsApp, Telegram, email, Notion, Linear, HubSpot, Meta Ads Manager, Google Ads, or your own internal tools.

If the role is external, that could mean a sales inbox, a LinkedIn account, a WhatsApp number, or a customer support channel.

I know that is risky. I know some people will hate that framing. That is fine.

This repo is not trying to be the most conservative answer. It is my current answer to a practical problem:

How do I make AI agents actually useful inside a company without pretending one giant super-agent will somehow do everything well?

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

Then give each agent the operating surfaces that match that role.

For example:

- a marketer support agent should be able to read ad dashboards, competitor pages, and posting calendars
- a sales support agent should have a real inbox, a CRM surface, and a browser profile for research and outreach prep
- a data support agent should be able to answer in team chats, read your data layer, and keep useful analytical memory over time

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

## What I think makes this work

There are four things I trust more now than I did when I started:

1. Narrow roles beat super-agents.
2. Real accounts beat abstract tool access.
3. Memory needs to be structured, not just long.
4. Human-in-the-loop is still the right move for high-stakes actions.

The agent can do a lot on its own:

- monitor
- research
- summarize
- draft
- follow up
- prepare
- maintain memory
- surface opportunities
- keep moving on a schedule

But I still want humans on the hook for:

- irreversible actions
- sensitive outreach
- public reputation
- legal or financial decisions
- major strategic changes

That is not a weakness in the model. That is just sane operations.

## Private vs shared context matters

One thing I care about a lot now is not just "memory", but memory partitions.

An agent should be able to keep:

- core role memory
- company memory
- relationship memory
- private DM memory
- group or channel memory
- handoff memory

And those should not all bleed together blindly.

If an agent talks to one person privately, that context should not automatically become group truth.

If a decision happens in a team channel, that may need to be promoted into shared memory.

If a lead says something in one thread, that should stay relationship-specific unless it becomes broadly useful.

This matters a lot once the agent has a real inbox, a real chat surface, and real responsibility.

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

- [AI Employee Operating Model](./docs/AI_EMPLOYEE_OPERATING_MODEL.md)
- [Simple Mode](./docs/SIMPLE_MODE.md)
- [Repo Blueprint](./docs/REPO_BLUEPRINT.md)
- [Universal Agent Zip Factory](./docs/UNIVERSAL_OPENCLAW_AGENT_ZIP_FACTORY_BRIEF.md)
- [OpenClaw Proactive Agent Hardening Guide](./docs/OPENCLAW_PROACTIVE_AGENT_HARDENING_GUIDE.md)
- [Document Map](./docs/OPENCLAW_AGENT_FACTORY_DOCUMENT_MAP.md)
