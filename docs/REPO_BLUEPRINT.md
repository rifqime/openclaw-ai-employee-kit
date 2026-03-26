# Repo Blueprint

This repo is split into four layers:

1. `core factory`
2. `openclaw runtime hardening`
3. `role packs`
4. `fleet packs`

## v0.1 scope

The initial local repo should support:

- a typed `AgentSpec`
- a generated workspace skeleton
- OpenClaw hardening profiles as data/config
- reusable role packs
- one fleet pack
- validation and packaging surfaces

## Non-goals for v0.1

- forking OpenClaw
- shipping a full hosted control plane
- pretending browser actions are reliable without receipts
- general super-agent orchestration

## First implementation sequence

1. finalize schemas
2. implement vault generator
3. implement role-pack overlay system
4. implement hardening profile overlay system
5. implement validators
6. implement zip packaging
