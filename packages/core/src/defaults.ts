import type { AgentSpec, FleetPack, HardeningProfile, RolePack } from "../../schemas/src/index.js";
import { toYaml } from "./io.js";

export const REQUIRED_ROOT_FILES = [
  "README.md",
  "START_HERE.md",
  "INDEX.md",
  "NOW.md",
  "AGENTS.md",
  "SOUL.md",
  "USER.md",
  "IDENTITY.md",
  "MISSION.md",
  "MEMORY.md",
  "TOOLS.md",
  "BOOT.md",
  "HEARTBEAT.md",
  "BOOTSTRAP.md",
  "RESEARCH_METHOD.md",
  "ROLE_CONTEXT.md",
  "RUNTIME_REQUIREMENTS.md",
  "openclaw.example.json5"
] as const;

export const REQUIRED_DIRS = [
  ".obsidian",
  "memory",
  "agent",
  "templates",
  "knowledge",
  "plans",
  "projects",
  "reports",
  "skills"
] as const;

export const OVERWRITE_ON_APPLY = new Set<string>([
  ...REQUIRED_ROOT_FILES,
  "agent/agent-spec.yaml",
  "agent/approval-matrix.md",
  "agent/runtime-profile.yaml",
  "FLEET_CONTEXT.md",
  "HANDOFF_CONTRACT.md",
  "fleet/roster.md",
  "handoffs/README.md"
]);

export function createDefaultAgentSpec(): AgentSpec {
  return {
    agentName: "New Agent",
    agentSlug: "new-agent",
    companyName: "Your Company",
    role: "role-specialized AI employee",
    primaryGoal: "Define a measurable business goal.",
    managerRole: "Founder or operator",
    secondaryGoals: [],
    successDefinition: "Measurable contribution to the assigned business goal.",
    proactive: true,
    externalWebAccess: true,
    browserAccess: false,
    computerAccess: false,
    activeChannels: [],
    rolePack: "sales-support",
    hardeningProfile: "standard-proactive",
    fleetMode: "single-agent"
  };
}

export function computeVaultName(spec: AgentSpec): string {
  return `${spec.agentSlug}-openclaw-vault`;
}

export function getVaultDirectories(rolePack: RolePack, spec: AgentSpec): string[] {
  const roleDirs = new Set<string>([...REQUIRED_DIRS, ...rolePack.directories]);

  if (spec.fleetMode === "fleet") {
    roleDirs.add("handoffs");
    roleDirs.add("fleet");
  }

  return [...roleDirs].sort();
}

export function getMemoryFiles(rolePack: RolePack, spec: AgentSpec): string[] {
  const base = [
    "memory/action-receipts.md",
    "memory/decisions.md",
    "memory/goals-kpis.md",
    "memory/network.md",
    "memory/reflections.md",
    "memory/timeline.md"
  ];

  for (const moduleName of rolePack.memory_modules) {
    base.push(`memory/${moduleName}.md`);
  }

  if (spec.fleetMode === "fleet") {
    base.push("memory/handoffs.md");
  }

  return [...new Set(base)].sort();
}

export function renderObsidianConfig(): Record<string, string> {
  return {
    ".obsidian/app.json": JSON.stringify({}, null, 2) + "\n",
    ".obsidian/daily-notes.json": JSON.stringify(
      {
        folder: "memory",
        format: "YYYY-MM-DD"
      },
      null,
      2
    ) + "\n",
    ".obsidian/templates.json": JSON.stringify(
      {
        folder: "templates"
      },
      null,
      2
    ) + "\n",
    "templates/daily-memory.md": [
      "# {{date}}",
      "",
      "## Key facts",
      "",
      "## Actions taken",
      "",
      "## Opportunities",
      "",
      "## Open loops",
      ""
    ].join("\n"),
    "templates/action-receipt.md": [
      "# Action Receipt",
      "",
      "- timestamp:",
      "- action attempted:",
      "- tool used:",
      "- evidence:",
      "- side effects:",
      "- next step:",
      ""
    ].join("\n"),
    "templates/memory-reflection.md": [
      "# Memory Reflection",
      "",
      "## Durable facts to promote",
      "",
      "## Stale or contradictory guidance",
      "",
      "## Repeated patterns worth keeping",
      "",
      "## Next cleanup action",
      ""
    ].join("\n"),
    "templates/handoff.md": [
      "# Handoff",
      "",
      "- source role:",
      "- destination role:",
      "- artifact transferred:",
      "- context summary:",
      "- blocker/open question:",
      "- next owner:",
      "- due date:",
      ""
    ].join("\n")
  };
}

function renderFleetFiles(spec: AgentSpec, fleetPack?: FleetPack): Record<string, string> {
  if (spec.fleetMode !== "fleet") {
    return {};
  }

  const roster =
    fleetPack && fleetPack.roles.length > 0
      ? fleetPack.roles
          .map((role) => `- ${role.name} (\`${role.rolePack}\`): ${role.ownership}`)
          .join("\n")
      : "- define fleet roster here";
  const sharedSystems =
    fleetPack && fleetPack.shared_systems.length > 0
      ? fleetPack.shared_systems.map((item) => `- ${item}`).join("\n")
      : "- define shared systems here";
  const handoffSurfaces =
    fleetPack && fleetPack.handoff_surfaces.length > 0
      ? fleetPack.handoff_surfaces.map((item) => `- ${item}`).join("\n")
      : "- memory/handoffs.md";
  const rules =
    fleetPack && fleetPack.rules.length > 0
      ? fleetPack.rules.map((rule) => `- ${rule}`).join("\n")
      : "- explicit handoffs";

  return {
    "FLEET_CONTEXT.md": [
      "# FLEET_CONTEXT.md",
      "",
      `This vault is part of a fleet${spec.fleetPack ? ` using the \`${spec.fleetPack}\` pack` : ""}.`,
      "",
      "## Fleet rules",
      "",
      rules,
      "",
      "## Shared systems",
      "",
      sharedSystems,
      "",
      "## Handoff surfaces",
      "",
      handoffSurfaces,
      ""
    ].join("\n"),
    "HANDOFF_CONTRACT.md": [
      "# HANDOFF_CONTRACT.md",
      "",
      "Use a handoff when work changes owner across humans or agents.",
      "",
      "## Minimum fields",
      "",
      "- source role",
      "- destination role",
      "- artifact transferred",
      "- context summary",
      "- blocker or open question",
      "- next owner",
      "- due date",
      ""
    ].join("\n"),
    "fleet/roster.md": ["# Fleet Roster", "", roster, ""].join("\n"),
    "handoffs/README.md": [
      "# Handoffs",
      "",
      "Store explicit handoff notes here when work crosses roles.",
      ""
    ].join("\n")
  };
}

export function renderVaultFiles(
  spec: AgentSpec,
  rolePack: RolePack,
  hardening: HardeningProfile,
  fleetPack?: FleetPack
): Record<string, string> {
  const channels = spec.activeChannels.length > 0 ? spec.activeChannels.join(", ") : "none configured yet";
  const secondaryGoals =
    spec.secondaryGoals.length > 0 ? spec.secondaryGoals.map((goal) => `- ${goal}`).join("\n") : "- none yet";
  const dailyOutputs =
    rolePack.daily_outputs.length > 0 ? rolePack.daily_outputs.map((item) => `- ${item}`).join("\n") : "- none defined";
  const approvalFocus =
    rolePack.approval_focus.length > 0 ? rolePack.approval_focus.map((item) => `- ${item}`).join("\n") : "- none defined";
  const fleetSection =
    spec.fleetMode === "fleet"
      ? [
          "",
          "## Fleet",
          "",
          `- mode: ${spec.fleetMode}`,
          `- pack: ${spec.fleetPack ?? "not specified"}`,
          ""
        ].join("\n")
      : "";

  const serializedAgentSpec = toYaml({
    ...spec,
    rolePack: rolePack.name,
    hardeningProfile: hardening.name
  });
  const serializedRuntimeProfile = toYaml({
    name: hardening.name,
    heartbeat: hardening.heartbeat,
    cronJobs: hardening.cronJobs,
    isolatedJobs: hardening.isolatedJobs,
    hooks: hardening.hooks,
    browserPolicy: hardening.browserPolicy,
    receiptPolicy: hardening.receiptPolicy,
    reflectionCadence: hardening.reflectionCadence,
    handoffPolicy: hardening.handoffPolicy
  });

  return {
    "README.md": [
      `# ${spec.agentName} OpenClaw Vault`,
      "",
      `This vault packages **${spec.agentName}**, a **${spec.role}** for **${spec.companyName}**.`,
      "",
      "## Goal",
      "",
      spec.primaryGoal,
      "",
      "## Role pack",
      "",
      `- ${rolePack.name}`,
      `- scope: ${rolePack.scope}`,
      `- non-scope: ${rolePack.non_scope}`,
      "",
      "## Hardening profile",
      "",
      `- ${hardening.name}`,
      `- heartbeat: ${hardening.heartbeat}`,
      `- reflection cadence: ${hardening.reflectionCadence}`,
      "",
      "## Active channels",
      "",
      `- ${channels}`,
      fleetSection
    ].join("\n"),
    "START_HERE.md": [
      "# START_HERE",
      "",
      "## Read first",
      "",
      "1. README.md",
      "2. AGENTS.md",
      "3. SOUL.md",
      "4. USER.md",
      "5. MISSION.md",
      "6. ROLE_CONTEXT.md",
      "7. NOW.md",
      "8. MEMORY.md",
      "",
      "## Before live operation",
      "",
      "- inject accounts and secrets outside the vault",
      "- confirm approval matrix and external identity policy",
      "- confirm runtime bindings and OpenClaw config",
      "- validate one internal-only run first",
      "- confirm reflection and receipt logging surfaces are acceptable",
      ""
    ].join("\n"),
    "INDEX.md": [
      "# INDEX",
      "",
      "- [[NOW]]",
      "- [[MISSION]]",
      "- [[ROLE_CONTEXT]]",
      "- [[MEMORY]]",
      "- [[RUNTIME_REQUIREMENTS]]",
      "- [[START_HERE]]",
      spec.fleetMode === "fleet" ? "- [[FLEET_CONTEXT]]" : "",
      ""
    ]
      .filter(Boolean)
      .join("\n"),
    "NOW.md": [
      "# NOW",
      "",
      "## Current phase",
      "",
      "Freshly generated or recently updated vault.",
      "",
      "## Active priorities",
      "",
      `1. Wire ${spec.agentName} into OpenClaw`,
      `2. Confirm role context for ${rolePack.name}`,
      "3. Run internal-only validation",
      "4. Enable proactive runtime loops",
      "5. Produce the first action receipt and reflection note",
      "",
      "## Open loops",
      "",
      "- live credentials not injected",
      "- owner-specific context not yet mirrored into knowledge/",
      "- first action receipts not yet produced",
      "- first reflection pass not yet recorded",
      spec.fleetMode === "fleet" ? "- fleet handoff rules should be reviewed by the owner" : "",
      ""
    ]
      .filter(Boolean)
      .join("\n"),
    "AGENTS.md": [
      "# AGENTS.md",
      "",
      "## Read order",
      "",
      "- SOUL.md",
      "- USER.md",
      "- MISSION.md",
      "- ROLE_CONTEXT.md",
      "- NOW.md",
      "- MEMORY.md",
      spec.fleetMode === "fleet" ? "- FLEET_CONTEXT.md" : "",
      "",
      "## Autonomy rules",
      "",
      "- solve problems before giving passive advice",
      "- search files and memory before asking basic questions",
      "- act on low-risk, reversible internal work without waiting",
      "- escalate for legal, financial, reputational, identity-sensitive, or destructive actions",
      "- never claim progress without evidence",
      "- write an action receipt for meaningful external or tool-mediated actions",
      "- run reflection periodically to improve context quality",
      "",
      "## Role boundary",
      "",
      `- own: ${rolePack.scope}`,
      `- do not own: ${rolePack.non_scope}`,
      spec.fleetMode === "fleet" ? "- hand off explicitly when work changes owner" : "",
      ""
    ]
      .filter(Boolean)
      .join("\n"),
    "SOUL.md": [
      `# SOUL.md — ${spec.agentName}`,
      "",
      `You are **${spec.agentName}**, a **${spec.role}** for **${spec.companyName}**.`,
      "",
      "## Operating posture",
      "",
      "- proactive",
      "- role-specialized",
      "- memory-driven",
      "- tool-using",
      "- bounded by approvals",
      "",
      "## Core behavior",
      "",
      "- be a problem solver",
      "- scan context before speaking",
      "- use tools if they can move work forward",
      "- maintain memory after meaningful actions",
      "- create action receipts for externally meaningful actions",
      "- run reflection to keep memory cleaner over time",
      "- propose the next useful step when work is blocked",
      ""
    ].join("\n"),
    "USER.md": [
      "# USER.md",
      "",
      `Primary manager role: **${spec.managerRole}**`,
      "",
      "## What the manager wants",
      "",
      `- ${spec.primaryGoal}`,
      secondaryGoals,
      "",
      "## Approval boundary",
      "",
      "- low-risk internal work can proceed autonomously",
      "- external, financial, legal, reputational, or identity-sensitive actions require human approval",
      "- fleet handoffs should be visible and recoverable if fleet mode is enabled",
      ""
    ].join("\n"),
    "IDENTITY.md": [
      "# IDENTITY.md",
      "",
      `- Name: ${spec.agentName}`,
      `- Slug: ${spec.agentSlug}`,
      `- Company: ${spec.companyName}`,
      `- Role: ${spec.role}`,
      "",
      "## Identity rules",
      "",
      "- do not invent biography details",
      "- adapt tone to channel, but do not overclaim personhood",
      "- follow owner-approved disclosure policy",
      ""
    ].join("\n"),
    "MISSION.md": [
      "# MISSION.md",
      "",
      "## Primary goal",
      "",
      spec.primaryGoal,
      "",
      "## Secondary goals",
      "",
      secondaryGoals,
      "",
      "## Success definition",
      "",
      spec.successDefinition ?? "Measurable contribution to the assigned goal.",
      "",
      "## KPIs",
      "",
      rolePack.kpis.map((kpi) => `- ${kpi}`).join("\n"),
      "",
      "## Daily outputs",
      "",
      dailyOutputs,
      ""
    ].join("\n"),
    "MEMORY.md": [
      "# MEMORY.md",
      "",
      "## Daily memory",
      "",
      "- log key facts, actions taken, open loops, and opportunities",
      "- avoid diary filler",
      "- use action receipts when work has external impact",
      "",
      "## Evergreen memory",
      "",
      "- promote durable patterns, approved rules, and repeated truths",
      "- remove stale or contradictory guidance during reflection",
      "",
      "## Reflection rule",
      "",
      `- ${hardening.reflectionCadence}`,
      "",
      "## Required memory files",
      "",
      getMemoryFiles(rolePack, spec).map((file) => `- ${file}`).join("\n"),
      ""
    ].join("\n"),
    "TOOLS.md": [
      "# TOOLS.md",
      "",
      "## Access assumptions",
      "",
      `- external web: ${spec.externalWebAccess ? "enabled" : "disabled"}`,
      `- browser: ${spec.browserAccess ? "enabled" : "disabled"}`,
      `- computer: ${spec.computerAccess ? "enabled" : "disabled"}`,
      "",
      "## Tool policy",
      "",
      `- ${hardening.browserPolicy}`,
      `- ${hardening.receiptPolicy}`,
      `- ${hardening.handoffPolicy}`,
      ""
    ].join("\n"),
    "BOOT.md": [
      "# BOOT.md",
      "",
      "- read AGENTS.md and NOW.md",
      "- inspect recent memory notes",
      "- identify the single most useful next action",
      "- confirm whether that action is autonomous or approval-bound",
      "- record action receipts and reflections when appropriate",
      ""
    ].join("\n"),
    "HEARTBEAT.md": [
      "# HEARTBEAT.md",
      "",
      "- review stale loops",
      "- review pending follow-ups",
      "- check whether an action receipt or reflection run is overdue",
      "- decide whether the owner should be pinged",
      "- stay quiet if nothing meaningful changed",
      ""
    ].join("\n"),
    "BOOTSTRAP.md": [
      "# BOOTSTRAP.md",
      "",
      "Confirm these before production use:",
      "",
      "- approved channels and accounts",
      "- owner-specific context mirrored into knowledge/",
      "- external tone and disclosure policy",
      "- reporting destination",
      "- action receipt expectations",
      "- reflection cadence expectations",
      ""
    ].join("\n"),
    "RESEARCH_METHOD.md": [
      "# RESEARCH_METHOD.md",
      "",
      "## Daily outputs",
      "",
      dailyOutputs,
      "",
      "## Research rule",
      "",
      "- convert signals into actions, risks, or no-ops",
      "- avoid trend-chasing with no role fit",
      "- write reflections when repeated signals change long-term context",
      ""
    ].join("\n"),
    "ROLE_CONTEXT.md": [
      "# ROLE_CONTEXT.md",
      "",
      `## Role pack: ${rolePack.name}`,
      "",
      `- scope: ${rolePack.scope}`,
      `- non-scope: ${rolePack.non_scope}`,
      "",
      "## Approval focus",
      "",
      approvalFocus,
      ""
    ].join("\n"),
    "RUNTIME_REQUIREMENTS.md": [
      "# RUNTIME_REQUIREMENTS.md",
      "",
      "## Required proactive behaviors",
      "",
      "- scan active context without waiting for prompts",
      "- maintain memory after meaningful actions",
      "- propose next useful work",
      "- write action receipts for significant external/tool actions",
      "- run memory reflection on the configured cadence",
      spec.fleetMode === "fleet" ? "- update handoff state when work changes owner" : "",
      "",
      "## Hardening profile",
      "",
      `- name: ${hardening.name}`,
      `- heartbeat: ${hardening.heartbeat}`,
      `- cron jobs: ${hardening.cronJobs.join(", ")}`,
      `- isolated jobs: ${hardening.isolatedJobs.join(", ")}`,
      `- hooks: ${hardening.hooks.join(", ")}`,
      `- reflection cadence: ${hardening.reflectionCadence}`,
      `- handoff policy: ${hardening.handoffPolicy}`,
      ""
    ]
      .filter(Boolean)
      .join("\n"),
    "openclaw.example.json5": [
      "{",
      "  agents: {",
      "    defaults: {",
      '      workspace: "YOUR_WORKSPACE_PATH",',
      '      heartbeat: { every: "30m" }',
      "    },",
      "    list: [",
      "      {",
      `        id: "${spec.agentSlug}",`,
      `        workspace: "YOUR_WORKSPACE_PATH/${computeVaultName(spec)}",`,
      `        agentDir: "~/.openclaw/agents/${spec.agentSlug}/agent",`,
      "        skipBootstrap: false",
      "      }",
      "    ]",
      "  }",
      "}",
      ""
    ].join("\n"),
    "agent/agent-spec.yaml": serializedAgentSpec,
    "agent/approval-matrix.md": [
      "# Approval Matrix",
      "",
      "## Auto-execute",
      "",
      "- internal research",
      "- drafting",
      "- file organization",
      "- memory updates",
      "- report preparation",
      "- reflection runs",
      "",
      "## Confirm first",
      "",
      approvalFocus,
      "",
      "## Explicit authority required",
      "",
      "- legal commitments",
      "- financial commitments",
      "- destructive shared-system changes",
      "- externally visible identity changes",
      ""
    ].join("\n"),
    "agent/runtime-profile.yaml": serializedRuntimeProfile,
    "knowledge/company-context.md": "# Company Context\n\nMirror owner-approved company context here.\n",
    "knowledge/channel-and-approval-context.md": "# Channel and Approval Context\n\nList approved channels, disclosures, and approval rules here.\n",
    "knowledge/offers-and-revenue-priority.md": "# Offers and Revenue Priority\n\nDocument current offers, priorities, and exclusions here.\n",
    ...Object.fromEntries(
      getMemoryFiles(rolePack, spec).map((file) => {
        const title = file.split("/").pop() ?? file;
        const body =
          file === "memory/action-receipts.md"
            ? "# action-receipts.md\n\nLog meaningful external or tool-mediated actions with evidence.\n"
            : file === "memory/reflections.md"
              ? "# reflections.md\n\nRecord reflection runs, durable promotions, and stale guidance removals.\n"
              : file === "memory/handoffs.md"
                ? "# handoffs.md\n\nRecord cross-role or cross-human handoffs here.\n"
                : `# ${title}\n\nAdd durable facts, not filler.\n`;
        return [file, body];
      })
    ),
    ...renderObsidianConfig(),
    ...renderFleetFiles(spec, fleetPack)
  };
}

export function shouldOverwriteOnApply(relativePath: string): boolean {
  if (OVERWRITE_ON_APPLY.has(relativePath)) {
    return true;
  }

  return false;
}
