# AI Employee Operating Model

This document is the practical part behind the repo.

The main idea is straightforward: if an agent is supposed to help with real work, the setup should look more like a real role inside a company and less like a generic chat assistant with a long prompt.

## The baseline

For this repo, an AI employee is not:

- one agent doing everything
- full autonomy with no oversight
- a replacement for all human judgment

It is:

- a narrow role
- a defined scope
- the right tools and accounts for that role
- memory that stays useful over time
- clear approval rules
- a human manager or owner

## Why this operating model exists

The failure mode I kept hitting was always similar. One agent had too much context, too many skills, and too many unrelated responsibilities. It could do a lot of things badly, but it was hard to trust for repeated work.

The setup started getting better once the agent was treated more like a role-holder:

- one area of responsibility
- one operating surface
- one clear reporting line
- one set of success criteria

That is the model assumed by this repo.

## Real operating surfaces

If the role needs real systems, give the agent real systems.

That can mean:

- an email account
- a browser profile
- a CRM seat
- a shared inbox
- a WhatsApp or Telegram number
- a Discord, Slack, or internal chat presence
- dashboard access
- internal tools

The exact setup depends on the job, but the principle is the same: the agent should have the actual surfaces where the work happens.

Examples:

- a marketing support agent may need Meta Ads Manager, TikTok Ads, Google Ads, a posting calendar, and competitor watchlists
- a sales support agent may need a real inbox, CRM access, a browser profile for research, and approved collateral
- a data support agent may need access to the approved data layer plus one or more internal channels where the team asks questions

## Identity and channel design

Once an agent has real accounts, channel design matters.

Every serious setup should define:

- which channels the agent can use
- whether each channel is internal, external, or mixed
- what tone is acceptable in that channel
- what the agent can send without approval
- what needs confirmation
- what should never happen automatically

This is not just a brand question. It affects safety, memory, trust, and escalation.

## WhatsApp needs an explicit operating pattern

WhatsApp is one of the easiest places to create a messy agent.

The failure mode usually looks like this:

- the agent can read and reply to everyone by default
- owner and outsider conversations blur together
- outbound outreach is blocked by the same allowlist that protects owner-only live replies
- the agent starts behaving like a chatbot when the real need is a managed communication assistant

For most serious setups, decide between these modes up front:

### Mode A: owner-only live assistant

The agent may run live LLM conversations only with:

- the owner
- the agent's own linked number for self-chat/testing

Everyone else stays silent by default.

### Mode B: public chatbot

The agent can reply to anyone in the allowed scope.

Only use this when you truly want a chatbot.

If you want this combined behavior:

- owner-only live replies
- outsider chats visible as an operating surface
- manual outbound send to non-whitelisted numbers

then use a split design:

- keep normal live WhatsApp mode owner-only
- keep the default channel allowlist restricted to owner + self
- use a separate explicit outreach workflow for non-owner outbound sends

See [`WHATSAPP_OWNER_GATED_OUTREACH_PATTERN.md`](./WHATSAPP_OWNER_GATED_OUTREACH_PATTERN.md).

## Memory needs structure

I do not think "save everything" is a good memory strategy.

For most real use cases, memory should be partitioned.

Recommended partitions:

### Core role memory

Stable facts about the role:

- mission
- scope
- approval rules
- recurring tasks
- success metrics
- domain constraints

### Shared company memory

Durable company-level facts:

- product facts
- approved claims
- policies
- playbooks
- current priorities

### Relationship memory

Context tied to a person or account:

- previous conversations
- preferences
- objections
- status
- constraints

### Private DM memory

One-to-one context with a manager or teammate. This should not automatically become shared truth.

### Group or channel memory

Context from team chats, working groups, or shared threads. Some of this may deserve promotion into shared memory, but not all of it.

### Handoff memory

Explicit transfer of ownership or context between agents or between agent and human.

## Promotion rules

Raw interaction history should not become permanent memory by default.

Good candidates for promotion:

- repeated instructions
- approved corrections
- durable preferences
- decisions with ongoing operational impact
- lead-specific facts that will matter later
- workflow patterns that improved output

Bad candidates for promotion:

- filler
- jokes
- temporary confusion
- stale experiments
- unapproved claims

## Private and group context should not blur together

This matters more once the agent works through chat or email.

Examples:

- if a manager says something privately, that should not automatically be treated as team-wide policy
- if a team discusses something in a group channel, only the durable part should be promoted into shared memory
- if a contact says something in a sales thread, that should stay attached to that relationship unless it becomes generally useful

Without these boundaries, the agent’s memory becomes noisy and eventually unreliable.

## What the agent should do on its own

Within scope, the agent should be able to:

- check inboxes and open loops
- research relevant information
- prepare drafts
- monitor tools and dashboards
- summarize changes
- maintain memory
- suggest next steps
- keep recurring work moving on schedule

That is the point of giving it a real role and real surfaces.

## What should still stay with humans

Even in this model, I still think humans should own:

- irreversible actions
- legal and financial commitments
- public reputation
- major strategic changes
- sensitive relationship moments
- final closing

The agent can still do most of the computer work around those actions.

## Practical takeaway

The setup gets better when the agent has:

- a believable job
- a narrow scope
- the right accounts
- the right browser or system access
- memory that is structured
- a real manager
- a real schedule
- clear escalation rules

That is what this repo is trying to make easier to build.
