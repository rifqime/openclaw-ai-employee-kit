# OpenClaw Proactive Agent Hardening Guide

## Summary

This document is the **Layer 2 runtime guide** for agents created by the universal factory.

Its purpose is to make a generated agent behave less like a request-bound assistant and more like a **proactive AI employee** inside OpenClaw.

This document is OpenClaw-specific. It answers:

- why a well-written agent still feels passive
- what runtime patterns are needed for true proactivity
- what to change in heartbeat, cron, hooks, memory, subagents, browser use, and reporting
- when the problem is configuration versus model versus harness

This guide assumes the base workspace already exists.

It does **not** replace the generator. It hardens the runtime behavior of the generated agent.

## Why this hardening layer exists

A good `SOUL.md` and `MISSION.md` do not automatically produce employee-like behavior in OpenClaw.

OpenClaw is wake-based and runtime-driven. In practice, “proactive employee behavior” usually fails because of:

- weak heartbeat design
- missing cron topology
- oversized or diluted bootstrap files
- poor memory writeback discipline
- subagents losing identity context
- browser/computer-use hallucinated success
- unclear approval boundaries
- models that are decent at chat but weak at long-horizon action

This gets harder in a company fleet where multiple agents exist, because passivity and overlap can happen at the same time.

So the job of hardening is to turn:

- identity
- mission
- goals
- memory rules
- operating loops

into a runtime architecture that actually wakes, acts, logs, reports, and persists.

## What research suggests

### Primary OpenClaw docs

- [Agent Workspace](https://docs.openclaw.ai/agent-workspace)
- [Bootstrapping](https://docs.openclaw.ai/start/bootstrapping)
- [Heartbeat](https://docs.openclaw.ai/gateway/heartbeat)
- [Cron Jobs](https://docs.openclaw.ai/cron/)
- [System Prompt](https://docs.openclaw.ai/concepts/system-prompt)
- [Sub-Agents](https://docs.openclaw.ai/tools/subagents)
- [Hooks](https://docs.openclaw.ai/automation/)

### Community signals

These are anecdotal but directionally useful:

- [OpenClaw feels non-proactive](https://www.reddit.com/r/clawdbot/comments/1qvu8qc/openclaw_feels_nonproactive_agent_and_subagents/)
- [How to make OpenClaw proactive](https://www.reddit.com/r/openclaw/comments/1rhcgxp/how_to_make_openclaw_agents_proactive_instead_of/)
- [Heartbeat isn’t autonomy by itself](https://www.reddit.com/r/openclaw/comments/1s0e0we/how_do_you_utilize_heartbeat_and_i_kinda_wish_the/)
- [My agent wouldn’t stay autonomous](https://www.reddit.com/r/openclaw/comments/1rxiwa2/my_openclaw_agent_wouldnt_stay_autonomous_heres/)
- [Cron / reliability complaints](https://www.reddit.com/r/openclaw/comments/1rk6zqn/experienced_dev_openclaw_has_been_an_absolute/)

## Diagnosis model: where proactivity breaks

In most real cases, the problem is a mix of these layers:

### 1. Harness/runtime layer

Common failures:

- no scheduled wake-up architecture
- cron job exists but is not isolated or not delivered
- heartbeat exists but does not trigger useful work
- bootstrap files are too large or vague

### 2. Workspace design layer

Common failures:

- agent knows goals abstractly but not what to do next
- no `NOW.md`, open loops, or task surfaces
- approval model is vague
- no runtime expectations declared
- no role boundary when multiple agents exist

### 3. Memory layer

Common failures:

- no enforced writeback
- daily facts never promoted to evergreen memory
- no opportunity log
- no decision log
- no handoff memory between agents

### 4. Execution layer

Common failures:

- browser actions claim success without proof
- no API-first policy
- no action receipts

### 5. Model layer

Common failures:

- model behaves like an answer bot
- model is weak at tool persistence
- model over-explains instead of acting

## Hardening objective

After hardening, the OpenClaw agent should:

- wake on schedule
- scan current context
- identify useful work without prompting
- do low-risk work autonomously
- escalate only when needed
- write memory consistently
- report back with concrete results
- scan external opportunities if role requires it
- coordinate sanely if multiple company agents exist

## Hardening principles

### Principle 1: Separate monitor, propose, and execute

Do not treat “proactivity” as one blob.

Split the runtime into:

- `monitor`
  - scan state, files, pipelines, inboxes, external signals
- `propose`
  - decide what matters and what should happen next
- `execute`
  - do low-risk work autonomously
- `escalate`
  - ask the user when the action crosses approval boundaries

In a multi-agent company, also separate:

- `own`
  - work this agent is directly responsible for
- `handoff`
  - work this agent prepares for another human or agent

This separation should show up in:

- heartbeat design
- cron design
- memory notes
- reporting behavior

### Principle 2: Keep bootstrap sharp

The files injected every session should be small, stable, and decisive.

Best practice:

- `AGENTS.md`: rules and approval matrix
- `SOUL.md`: identity and posture
- `USER.md`: owner relationship and approval
- `HEARTBEAT.md`: tiny recurring checklist
- `BOOT.md`: startup order

Avoid:

- giant lore docs in bootstrap
- strategy essays in always-loaded files
- long examples where crisp rules are enough

### Principle 3: Use cron for action, heartbeat for vigilance

Recommended split:

- `heartbeat`
  - check state
  - inspect open loops
  - decide if user should be pinged
  - decide if a scheduled action was missed

- `cron`
  - morning brief
  - research digest
  - pipeline sweep
  - weekly review
  - report generation

Do not rely on heartbeat alone for serious proactive work.

### Principle 4: Prefer isolated scheduled jobs for output

If the job must reliably produce a report, digest, or morning brief:

- prefer isolated cron sessions

Use main-session jobs when:

- the job is meant to feel conversationally continuous
- the runtime needs the active thread state

### Principle 5: Treat browser/computer use as fallible

Hard rule:

- browser actions do not count as done unless there is evidence

Preferred hierarchy:

1. API
2. script/CLI
3. browser

If browser is required:

- verify outcome
- capture proof
- write receipt into memory or status notes

### Principle 6: One role, one operating center

Do not try to make one OpenClaw agent the whole company.

For small-team or founder setups, the stronger pattern is usually:

- multiple narrow agents
- each with one measurable job
- shared handoff surfaces
- one human owner over them

## Recommended OpenClaw hardening architecture

### A. Core runtime files

Ensure the workspace has:

- `NOW.md`
- `agent/status.md`
- `agent/open-loops.md`
- `memory/decisions.md`
- `memory/goals-kpis.md`
- `memory/opportunities.md` if opportunity scanning matters
- `memory/handoffs.md` if multiple agents or teams exist

The agent should always have:

- a current state note
- a next-actions surface
- a durable decision trail
- a handoff trail where collaboration exists

### B. Suggested cron topology

Minimum useful proactive stack:

#### 1. Morning brief job

Runs every morning.

Does:

- scan `NOW.md`
- scan open loops
- scan role-relevant external sources
- produce a concise brief:
  - what changed
  - what matters
  - what is actionable
  - what the agent proposes to do

#### 2. Midday sweep job

Runs mid-day.

Does:

- check if tasks are stalled
- inspect inbox/pipeline/project surfaces
- propose or execute the next best low-risk task
- update handoff state if this role feeds another role

#### 3. End-of-day log job

Runs late day.

Does:

- summarize what moved
- write memory
- update status surfaces
- preserve open loops

#### 4. Weekly review job

Runs weekly.

Does:

- KPI review
- bottleneck review
- pipeline review
- opportunity review
- recommendation note

### D. Fleet-level scheduling rule

If multiple agents are deployed in the same company:

- do not make every agent scan the same full universe
- assign domain-specific morning scans
- assign domain-specific KPI review
- use shared reporting surfaces only where needed

### C. Suggested heartbeat role

Heartbeat should be short and decision-oriented.

Use it to ask:

- what changed since the last check?
- is there useful work available now?
- is there anything waiting for user input?
- should I ping the user?
- did a scheduled process fail or get skipped?

Do not overload heartbeat with full planning or long research.

## Hook recommendations

Use hooks to improve continuity, not to replace architecture.

Most relevant hook categories:

- session memory / writeback hooks
- boot-time extra file loading
- startup helpers

Hardening goals for hooks:

- reduce memory loss
- keep the agent from forgetting high-value state
- keep bootstrap slim while still loading critical state
- keep role boundaries and handoff context recoverable

## Subagent policy

OpenClaw subagents are useful, but they are dangerous for persona-heavy or approval-sensitive work because they do not inherit the full identity stack.

Use subagents only for:

- bounded research
- extraction
- ranking
- draft generation for internal review
- non-public analysis

Do not use subagents directly for:

- public-facing replies in the agent’s name
- final approval-sensitive outreach
- identity-heavy decisions

If subagents are used:

- pass a compact task brief
- restate the exact goal
- restate scope and approval limits
- require a structured result

If you run a company fleet, prefer:

- specialized top-level agents for durable roles
- subagents only for bounded temporary tasks

## Model hardening guidance

Do not assume one model is enough because the prompt is strong.

What matters:

- tool persistence
- long-horizon task behavior
- low hallucination rate on actions
- ability to obey structured loops

Practical rule:

- if the agent keeps explaining instead of acting, that is partly a model issue
- if the agent never wakes or logs, that is not primarily a model issue

So evaluate models only after runtime architecture is sane.

## Runtime observability

A proactive employee agent needs visible state.

Minimum observable surfaces:

- `NOW.md`
- `agent/status.md`
- `agent/open-loops.md`
- `memory/decisions.md`
- `memory/handoffs.md` where relevant

The user should be able to see:

- what the agent thinks it is doing
- what is blocked
- what it proposes next
- what changed recently
- what it handed off and what is waiting on others

## What should be changed in the base generated workspace

If the universal generator is used first, the hardening pass should add or tighten:

- runtime-facing notes like `NOW.md`
- opportunity memory if relevant
- a stronger approval matrix
- heartbeat wording
- explicit reporting loops
- explicit background-research expectation
- open-loop tracking
- explicit role boundary and handoff memory if part of a fleet

## When the problem is OpenClaw itself

Consider the harness a real blocker only if:

- you already hardened cron/heartbeat/hooks
- the agent still fails to wake reliably
- browser/computer reliability is unacceptable for the role
- subagent context loss is too damaging for your use case
- the model options available through your OpenClaw stack are underperforming

Only then should you seriously compare alternative runtimes.

## When to consider another harness

Switch or compare if:

- your use case is extremely execution-heavy and browser-light
- you want lower-latency single-agent loops
- you care more about execution kernel efficiency than workspace semantics
- OpenClaw orchestration remains brittle after hardening

Do **not** switch harness just because the base workspace felt passive before runtime hardening.

## Implementation order

Apply hardening in this order:

1. tighten bootstrap files
2. define approval matrix
3. add state surfaces
4. wire cron jobs
5. refine heartbeat
6. add memory writeback discipline
7. constrain browser/computer actions
8. set subagent policy
9. add role-boundary and handoff surfaces if part of a fleet
10. evaluate model fit
11. only then reassess harness choice

## Deliverables this guide should drive

An implementer using this guide should produce:

- a hardened OpenClaw workspace
- a cron/heartbeat plan
- a hook plan
- a subagent policy
- a browser/API execution policy
- an observability/status layer
- a clear decision on whether OpenClaw is sufficient for the role
- a clear decision on whether the role should be one agent or part of a fleet

## Bottom line

The universal generator should create the employee.

This guide should make OpenClaw behave like the runtime that employee actually needs.

If you merge both into one document, you will bloat the generator and still have a muddy runtime model.

If you keep them separate but linked, you get:

- cleaner creation
- cleaner hardening
- less context rot
- easier future harness swaps

## Small-team viability note

For a solo founder or small team, this architecture is viable when:

- each agent owns a narrow slice of work
- the human keeps high-stakes judgment
- the runtime is hardened enough to keep moving without babysitting
- outputs are verified
- memory stays clean
