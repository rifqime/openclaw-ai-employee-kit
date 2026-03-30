# OpenClaw AI Employee Kit

Role-scoped OpenClaw agents for real business work.

This repo came out of a setup that kept failing.

I originally tried to run one OpenClaw agent as a general-purpose operator. It had too much context, too many tools, too many skills, and too many unrelated jobs. On paper that looked efficient. In practice it was unreliable: wrong tool calls, wrong skill calls, missed scheduled work, weak follow-through, and too much fake confidence.

What worked better for me was to stop building one super-agent and start building smaller role-based agents inside the same OpenClaw gateway. Each agent gets a narrower scope, a smaller context window, clearer success criteria, and only the tools it actually needs.

The second thing that mattered was treating the agent more like an employee than a chatbot. If the role needs it, the agent should have a real inbox, a real browser profile, access to the actual tools for the job, and a clear manager. Once I started thinking about the setup that way, the whole system got easier to reason about.

That is what this repo is for.

## Who this is for

- people using OpenClaw who feel one big agent is getting messy
- operators who want narrower agents with clearer responsibilities
- teams that want agents to work through real inboxes, dashboards, and internal tools
- people who are comfortable with an opinionated setup, not a neutral framework

## Who this is not for

- people looking for a hosted product
- people expecting public benchmarks or polished case studies
- people who want one general-purpose agent to run everything
- people who want the safest possible default for every use case

## What this repo does

It helps you generate and harden role-specific OpenClaw agents with:

- a structured vault layout for OpenClaw and Obsidian
- a role pack
- a hardening profile for proactivity and runtime behavior
- optional fleet support for multiple agents in one company setup
- validation and zip packaging

It also supports a simpler flow where another agent can read this repo, ask setup questions, and generate the workspace for you.

This is an opinionated setup kit, not a public proof-of-results repo.
It shares the operating pattern, not private company internals, prompts, or results.

## The opinion behind it

My current view is simple:

- one giant agent is usually a bad operating model
- narrower agents are easier to trust and easier to debug
- if you want an agent to act like an employee, give it employee-shaped reality

For me that usually means some combination of:

- a real role
- a real manager
- a real KPI
- a real email or inbox
- a real browser profile already logged into the right tools
- a real chat surface if the role works in chat
- memory that survives across days
- clear approval rules

This is not the safest possible framing and it is definitely not the only one. It is just the setup that has made the most sense in actual use.

## What I am trying to avoid

I am not trying to build a magical all-purpose AGI employee.

I am trying to avoid a familiar failure mode:

- huge prompts
- huge context
- huge skill libraries
- weak role boundaries
- passive behavior unless the user keeps asking
- lots of apparent activity with very little dependable output

The point of this repo is to replace that with a narrower and more operational model.

## How I think this should be used

Start with one role that already exists inside a real company workflow. Good examples:

- sales support
- marketing support
- research analyst
- ops assistant
- data analyst / internal Q&A

Then define the setup around that role:

- what the agent is responsible for
- what it is not responsible for
- what systems it needs
- what memory it should keep
- what it can do without approval
- what it should escalate

If that role works, add another agent. Do not keep bloating the first one.

## Example roles

- Marketing support: competitor scan, content research, draft generation, campaign notes, scheduling reminders
- Research analyst: recurring market scan, synthesis, citation-first notes, internal brief preparation
- Ops assistant: follow-up queue maintenance, task reminders, status receipts, lightweight coordination work
- Sales support: prospect research, inbox prep, CRM hygiene, outreach drafts, meeting preparation

## Real operating surfaces matter

This is the part I care about most.

The agent should not just have abstract "tool access". It should have the actual operating surfaces that match the job.

Examples:

- a marketing support agent should be able to read ad dashboards, watch competitors, draft posts, and track campaign notes
- a sales support agent should have a real inbox, CRM access, a browser profile for research, and a clear approval path for outreach
- a data support agent should be able to read the approved data layer, answer questions in internal channels, and keep useful analytical memory

If the role works through email, give it email. If the role works through WhatsApp, Discord, or Slack, design for that. If the role needs a LinkedIn or X account, that should be part of the operating model, not an afterthought.

For WhatsApp-heavy roles, do not stop at "enable the channel." Define:

- who may trigger live OpenClaw replies
- who should stay silent by default
- whether outbound sends are limited to the allowlist or opened through a separate outreach workflow
- whether the agent owns a dedicated WhatsApp number

If you want the owner-only plus controlled-outreach pattern that held up best in practice, see [`docs/WHATSAPP_OWNER_GATED_OUTREACH_PATTERN.md`](./docs/WHATSAPP_OWNER_GATED_OUTREACH_PATTERN.md).

## Memory should not be one big bucket

Once an agent works across real channels, memory gets more important and also more dangerous.

I think the useful split is usually:

- core role memory
- shared company memory
- relationship memory
- private DM memory
- group or channel memory
- handoff memory

Private context should not automatically become shared context. Group chatter should not automatically become durable memory. Relationship-specific details should stay attached to that relationship unless there is a good reason to promote them.

This matters much more once the agent has a real inbox, a real chat surface, and recurring work.

## Human in the loop

I still think the right default is human ownership for:

- irreversible actions
- sensitive outreach
- public posting
- legal or financial commitments
- anything that can damage trust quickly

The agent can still do most of the digital work around those actions: research, preparation, draft creation, follow-up, reporting, and memory maintenance.

## Two ways to use the repo

### 1. Direct toolkit mode

Use the CLI, specs, role packs, hardening profiles, and validation flow yourself.

This is the better path if you want direct control over the generated setup.

### 2. Guided setup mode

Give this repo to another AI agent together with:

- [`prompts/OPENCLAW_AGENT_SETUP_OPERATOR.md`](./prompts/OPENCLAW_AGENT_SETUP_OPERATOR.md)
- [`questions/AGENT_SETUP_QUESTIONNAIRE.md`](./questions/AGENT_SETUP_QUESTIONNAIRE.md)

That setup operator should read the repo, ask the user the right questions, generate the spec, generate the vault, validate it, and package the result.

## Example generated output

```text
generated/
  marketing-support-openclaw-vault/
    AGENTS.md
    SOUL.md
    USER.md
    MISSION.md
    MEMORY.md
    HEARTBEAT.md
    ROLE_CONTEXT.md
    RUNTIME_REQUIREMENTS.md
    openclaw.example.json5
    memory/
      goals-kpis.md
      action-receipts.md
      reflections.md
    templates/
      action-receipt.md
      memory-reflection.md
    agent/
      agent-spec.yaml
      runtime-profile.yaml
```

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

## Simplest path

If you do not want to think about the structure first, run:

```bash
npm run employee-kit -- print-setup-prompt
```

Then give that prompt, this repo, and the questionnaire to your setup agent.

## Smoke test

```bash
npm run smoke
```

## Repo structure

- `docs/` — design docs and operating notes
- `questions/` — setup questionnaire
- `prompts/` — setup operator prompt
- `packages/` — CLI, generator, runtime helpers, schemas
- `role-packs/` — role overlays
- `fleet-packs/` — multi-agent overlays
- `examples/` — starter specs
- `schemas/` — public YAML schemas

## What "self-improving" means here

I am not talking about model self-modification.

I mean:

- better context over time
- better memory over time
- better reflection over time
- better fit to the role over time

## Core docs

- [AI Employee Operating Model](./docs/AI_EMPLOYEE_OPERATING_MODEL.md)
- [Simple Mode](./docs/SIMPLE_MODE.md)
- [Repo Blueprint](./docs/REPO_BLUEPRINT.md)
- [Universal Agent Zip Factory](./docs/UNIVERSAL_OPENCLAW_AGENT_ZIP_FACTORY_BRIEF.md)
- [OpenClaw Proactive Agent Hardening Guide](./docs/OPENCLAW_PROACTIVE_AGENT_HARDENING_GUIDE.md)
- [Document Map](./docs/OPENCLAW_AGENT_FACTORY_DOCUMENT_MAP.md)
