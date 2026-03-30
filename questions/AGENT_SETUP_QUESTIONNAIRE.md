# Agent Setup Questionnaire

Use this questionnaire when creating a new AI employee spec.

## Required questions

1. What is the agent name?
2. What company does this agent belong to?
3. What is the agent's role?
4. What is the primary business goal?
5. Who is the manager or owner?
6. Which role pack fits best?
7. Should the agent be proactive by default?
8. Should external web access be enabled?
9. Should browser access be enabled?
10. Should computer access be enabled?
11. Which channels may the agent operate on?
12. Is this a single agent or part of a fleet?
13. If fleet mode is enabled, which fleet pack applies?
14. Which hardening profile should be used?
15. If WhatsApp is enabled, which numbers are allowed to trigger live replies?
16. If WhatsApp is enabled, should the agent stay silent to non-whitelisted numbers?
17. If WhatsApp is enabled, should non-whitelisted outbound outreach be allowed through a separate explicit workflow?

## Optional questions

1. What are the secondary goals?
2. How should success be defined?

## Defaults

- proactive: `true`
- external web access: `true`
- browser access: `false`
- computer access: `false`
- channels: empty
- fleet mode: `single-agent`
- hardening profile: `standard-proactive`
- role pack: choose the narrowest one that matches the role
- WhatsApp default: owner-only live replies, silent outsiders, and separate manual outreach if needed
