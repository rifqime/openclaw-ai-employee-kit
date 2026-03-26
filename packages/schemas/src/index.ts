import { z } from "zod";

export const AgentSpecSchema = z.object({
  agentName: z.string().min(1),
  agentSlug: z.string().min(1),
  companyName: z.string().min(1),
  role: z.string().min(1),
  primaryGoal: z.string().min(1),
  managerRole: z.string().min(1),
  secondaryGoals: z.array(z.string().min(1)).default([]),
  successDefinition: z.string().optional(),
  proactive: z.boolean(),
  externalWebAccess: z.boolean(),
  browserAccess: z.boolean(),
  computerAccess: z.boolean(),
  activeChannels: z.array(z.string().min(1)).default([]),
  rolePack: z.string().min(1),
  hardeningProfile: z.string().min(1),
  fleetMode: z.enum(["single-agent", "fleet"]),
  fleetPack: z.string().min(1).optional()
});

export type AgentSpec = z.infer<typeof AgentSpecSchema>;

export const RolePackSchema = z.object({
  name: z.string().min(1),
  scope: z.string().min(1),
  non_scope: z.string().min(1),
  kpis: z.array(z.string().min(1)).min(1),
  directories: z.array(z.string().min(1)).default([]),
  memory_modules: z.array(z.string().min(1)).default([]),
  daily_outputs: z.array(z.string().min(1)).default([]),
  approval_focus: z.array(z.string().min(1)).default([])
});

export type RolePack = z.infer<typeof RolePackSchema>;

export const FleetRoleSchema = z.object({
  name: z.string().min(1),
  rolePack: z.string().min(1),
  ownership: z.string().min(1)
});

export const FleetPackSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  roles: z.array(FleetRoleSchema).min(1),
  rules: z.array(z.string().min(1)).min(1),
  shared_systems: z.array(z.string().min(1)).default([]),
  handoff_surfaces: z.array(z.string().min(1)).default([]),
  shared_memory_files: z.array(z.string().min(1)).default([])
});

export type FleetPack = z.infer<typeof FleetPackSchema>;

export const HardeningProfileSchema = z.object({
  name: z.string().min(1),
  heartbeat: z.string().min(1),
  cronJobs: z.array(z.string().min(1)).min(1),
  isolatedJobs: z.array(z.string().min(1)).default([]),
  hooks: z.array(z.string().min(1)).default([]),
  browserPolicy: z.string().min(1),
  receiptPolicy: z.string().min(1),
  reflectionCadence: z.string().min(1),
  handoffPolicy: z.string().min(1)
});

export type HardeningProfile = z.infer<typeof HardeningProfileSchema>;

export const VaultValidationReportSchema = z.object({
  ok: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  checkedPaths: z.array(z.string())
});

export type VaultValidationReport = z.infer<typeof VaultValidationReportSchema>;
