# Simple Mode

This repo supports two ways of working:

## 1. Toolkit mode

Use the CLI, specs, role packs, hardening profiles, and validation flow directly.

This is best for:

- technical founders
- engineers
- teams who want deterministic generation
- users who will edit specs and generated vaults themselves

## 2. Guided agent mode

Give this repo to an AI agent and have it act as the setup operator.

In this mode, the AI agent should:

1. read the repo docs first
2. ask the user the minimum setup questions
3. create or fill the agent spec
4. generate the vault
5. validate the vault
6. package the zip
7. explain what still needs manual credential binding or approval

This is best for:

- average OpenClaw users
- non-technical founders
- people who want the agent to drive setup conversationally

## What guided agent mode needs

The external AI agent should be given:

- the repo path or repo link
- the instruction file in `prompts/OPENCLAW_AGENT_SETUP_OPERATOR.md`
- the questionnaire in `questions/AGENT_SETUP_QUESTIONNAIRE.md`
- a clear statement of the desired employee role

The repo is intentionally structured so the agent can use:

- `README.md`
- `docs/REPO_BLUEPRINT.md`
- `docs/UNIVERSAL_OPENCLAW_AGENT_ZIP_FACTORY_BRIEF.md`
- `docs/OPENCLAW_PROACTIVE_AGENT_HARDENING_GUIDE.md`
- `prompts/OPENCLAW_AGENT_SETUP_OPERATOR.md`
- `questions/AGENT_SETUP_QUESTIONNAIRE.md`

without needing hidden context from the original creator.

## Design rule

Simple mode should never bypass the repo architecture.

It should only make the user experience easier by:

- moving the questioning burden to the AI setup operator
- providing a ready-made instruction prompt
- giving the operator a strict completion checklist

The output is still the same:

- generated vault
- validated workspace
- packaged zip
- explicit note about what still requires human action
