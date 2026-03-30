# WhatsApp Owner-Gated Outreach Pattern

This document describes a WhatsApp setup that worked reliably for a real OpenClaw deployment where the agent needed:

- live WhatsApp assistant behavior for the owner
- silence by default for outsiders
- visibility into WhatsApp as an operating surface
- manual outbound outreach to non-whitelisted numbers

This is not a public chatbot pattern.

It is an owner-controlled operating pattern.

## Use this when

Use this pattern if the agent should:

- respond normally to the owner on WhatsApp
- avoid acting like an always-on chatbot for everyone else
- help review or summarize external WhatsApp traffic
- still be able to send outreach messages to non-owner numbers when explicitly instructed

## Do not use this when

Do not use this pattern if you want:

- fully open WhatsApp auto-replies
- broad public chatbot behavior
- one flat policy where everyone can both trigger and receive live replies

## The core problem

The naive setup is:

- enable WhatsApp
- set a broad DM policy
- hope prompt instructions will separate owner chat from outsider chat

That usually fails.

Another common failure is trying to solve everything with one allowlist. On some OpenClaw runtimes, the same allowlist that protects owner-only live replies can also block outbound delivery to non-whitelisted numbers.

That means these three goals may conflict if you try to do them with one flat channel policy:

- owner-only live replies
- read all outsider chats as normal live sessions
- manual outbound send to any number

## Recommended design

Split normal chat mode and outreach mode.

### Normal chat mode

Use WhatsApp as an owner-only live assistant surface.

Recommended config shape:

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "allowlist",
      "allowFrom": [
        "+6281310001870",
        "+6285718712275"
      ],
      "actions": {
        "sendMessage": true
      },
      "sendReadReceipts": false,
      "selfChatMode": true
    }
  }
}
```

Interpretation:

- the owner number is allowed
- the agent's own linked number is allowed for self-chat and testing
- outsiders do not get normal live OpenClaw replies
- manual send capability stays enabled at the channel level

## Why not rely on prompt policy alone

Prompt rules are useful, but they are not enough for this boundary.

If the goal is:

- owner gets live replies
- outsiders stay silent

use hard channel policy for that boundary.

Do not depend on the model to "remember to ignore outsiders."

## Outreach mode

If you also need manual outbound outreach to non-whitelisted numbers, use a separate workflow.

Recommended pattern:

- owner triggers a dedicated outreach skill, command, or wrapper
- the wrapper temporarily authorizes the target
- the message is sent
- the allowlist is restored to owner + self immediately after

This keeps:

- normal WhatsApp mode narrow and predictable
- outreach explicit and auditable

## Suggested trigger pattern

Example trigger phrase:

- `wa outreach`

Example flow:

1. owner asks the agent to perform `wa outreach`
2. agent prepares or confirms the message
3. local wrapper temporarily adds the target to `channels.whatsapp.allowFrom`
4. wrapper sends the message through OpenClaw
5. wrapper restores the safe owner-only allowlist
6. agent returns a compact receipt:
   - target
   - status
   - message id if available

## Wrapper behavior requirements

If you implement the outreach wrapper, it should:

- normalize the phone number to E.164
- use an explicit safe allowlist as the restore target
- not restore to a dirty runtime-discovered list
- log send attempts and results
- avoid unnecessary gateway restarts if dynamic config reload already works
- fail loudly with the exact transport error when delivery fails

## Important runtime notes

### 1. Keep recurring jobs internal-only

Do not let heartbeat or routine cron jobs post into the owner's live WhatsApp thread.

For routine jobs:

- prefer isolated sessions
- use internal-only delivery where possible
- avoid turning maintenance traffic into live owner chat events

### 2. Be careful with session resets

If you materially change channel routing or allowlist behavior, old direct-thread mappings may preserve bad state.

After major WhatsApp policy changes, it can be worth resetting only the affected session mapping so the next inbound owner message creates a clean thread.

### 3. Do not overuse send-policy hacks

If a runtime-specific send-policy rule seems to break owner replies, remove it and fall back to a simpler split:

- hard allowlist for live chat
- separate outreach wrapper for non-owner outbound

### 4. Treat the agent as a communication operator, not a chatbot

For many real roles, the right behavior is:

- summarize
- draft
- suggest
- wait for approval
- send only when asked

That is especially true for author, founder, operator, and reputation-sensitive roles.

## Recommended workspace policy language

If the agent uses this pattern, the workspace should say something like:

```text
WhatsApp default mode is owner-only.

Normal live OpenClaw replies are allowed only to the owner number and the agent's own linked number.

Do not treat outsider WhatsApp chats as normal live chat sessions unless the runtime policy explicitly allows it.

For non-owner outbound outreach, use the dedicated `wa outreach` workflow only.

Do not broaden the WhatsApp allowlist permanently just to send one message.
Restore the safe owner-only allowlist immediately after outreach.
```

## Recommended setup questions

If WhatsApp is part of the role, always ask:

1. Which number is the owner number?
2. Does the agent have a dedicated WhatsApp number?
3. Should outsiders stay silent by default?
4. Does the user still want summaries or visibility into outsider chats?
5. Should non-owner outbound outreach be possible?
6. If yes, should that outreach require an explicit trigger such as `wa outreach`?

## Bottom line

If you want a WhatsApp agent that feels like a disciplined operator instead of a sloppy chatbot:

- keep normal live mode owner-only
- keep outsider auto-replies off by default
- separate outreach into an explicit manual workflow
- restore the safe allowlist after every outreach send

That pattern is more reliable than trying to make one flat WhatsApp policy do everything at once.
