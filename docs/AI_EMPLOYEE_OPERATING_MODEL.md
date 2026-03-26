# AI Employee Operating Model

This is the most opinionated part of the repo.

I do not think AI employees become useful by giving them a giant prompt and a pile of tools.

I think they become useful when you give them something closer to employee-shaped reality:

- a real role
- a real goal
- a real manager
- real tools
- real operating surfaces
- real memory
- real approval boundaries

That is the model I am optimizing for here.

## The core belief

If an AI agent is supposed to behave like an employee, it should be set up more like one.

That means the agent may need:

- its own email account
- its own browser profile
- its own chat identity
- its own CRM or dashboard access
- its own recurring work
- its own KPI
- its own reporting loop

I do not think this is the only valid way to run agents.

I do think it is one of the most practical ways to make them useful inside a small team or company.

## What "real employee" means in this repo

In this repo, "AI employee" does not mean:

- magical full autonomy
- no human oversight
- replacing all human judgment
- one agent running an entire company

It means:

- a narrow role
- a defined operating surface
- a proactive rhythm
- durable memory
- a human owner or manager
- clear escalation rules

## Employee-shaped infrastructure

The agent should not just have "tools". It should have operating surfaces that match the job.

Examples:

- a marketing support agent:
  - Meta Ads Manager
  - TikTok Ads
  - Google Ads
  - posting calendar
  - brand asset folder
  - competitor watchlist

- a sales support agent:
  - CRM
  - research browser profile
  - outreach inbox
  - LinkedIn surface
  - company deck and case studies

- a data support agent:
  - data warehouse or database access
  - approved query layer
  - team chat surface
  - reporting templates

That is a much better operating model than one general-purpose agent that gets asked random things all day.

## Channels and identity surfaces

This repo assumes an agent may need more than one channel.

Possible identity surfaces:

- email
- WhatsApp
- Telegram
- Discord
- Slack
- LinkedIn
- X
- browser session
- shared dashboards
- internal tools

Each channel changes how the agent should behave.

That means every serious setup should define:

- which channels the agent is allowed to use
- whether the channel is internal, external, or mixed
- what can be sent without approval
- what needs confirmation
- what should never be done automatically

## Private versus shared context

This is one of the biggest practical issues once an agent is working across real channels.

The agent should not treat all memory as one big bucket.

I recommend at least these partitions:

### 1. Core role memory

Stable facts about:

- identity
- mission
- approval rules
- recurring tasks
- success metrics
- domain rules

### 2. Shared company memory

Durable company context such as:

- product facts
- approved claims
- policies
- playbooks
- key contacts
- current priorities

### 3. Relationship memory

Facts tied to a person, lead, customer, partner, or stakeholder.

Examples:

- what they care about
- previous conversations
- objections
- tone preferences
- current status

### 4. Private DM memory

Context from one-on-one conversations with a manager or teammate.

This should not automatically become shared truth.

### 5. Group or channel memory

Context from team channels, working groups, or shared threads.

This is often more volatile, but some of it should be promoted to shared memory if it becomes durable.

### 6. Handoff memory

When one agent or person passes work to another, the transfer should be explicit:

- what happened
- what matters
- what is blocked
- who owns next step

## Promotion rules

I do not think raw chat history should become memory by default.

Useful memory needs promotion rules.

Good candidates for promotion:

- repeated instructions
- durable user preferences
- approved claims
- recurring workflow corrections
- lead-specific facts
- outcomes that changed future behavior
- decisions with operational impact

Bad candidates for promotion:

- casual filler
- one-off jokes
- stale experiments
- temporary confusion
- unapproved assumptions

## Why this matters for real-world use

Once an agent has:

- a real inbox
- a real phone number
- a real social account
- a real browser session

it stops being a toy.

That is where memory quality, channel boundaries, and approval rules start to matter a lot more.

Without that structure, the agent becomes noisy, forgetful, or overconfident.

With that structure, it starts to look more like a useful operator.

## The operating loop

The version I trust looks more like this:

1. Scan current priorities
2. Check inboxes, tasks, and open loops
3. Research relevant signals
4. Produce something useful
5. Log what happened
6. Ask for approval when needed
7. Promote useful memory
8. Repeat on a schedule

That is much closer to how a good employee works than how most agent demos work.

## What should stay human

Even in this operating model, I still want humans to own:

- closing
- high-stakes relationships
- public reputation
- legal decisions
- financial commitments
- strategic pivots

The agent can do a lot of the digital work around those things.

It does not need to own all of them.

## My opinionated takeaway

The mistake is not that most people use weak models.

The mistake is that they try to run agents without giving them:

- a believable role
- a manageable scope
- real operating surfaces
- structured memory
- explicit approval rules

This repo is my current attempt to fix that.
