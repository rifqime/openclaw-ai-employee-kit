import type { HardeningProfile } from "../../schemas/src/index.js";

export const standardHardeningProfile: HardeningProfile = {
  name: "standard-proactive",
  heartbeat: "Use heartbeat for vigilance, stale-loop checks, and deciding whether the owner should be pinged.",
  cronJobs: ["morning-brief", "opportunity-scan", "pipeline-sweep", "memory-reflection", "weekly-review"],
  isolatedJobs: ["morning-brief", "weekly-review", "memory-reflection"],
  hooks: ["session-memory", "bootstrap-extra-files", "command-logger", "boot-md"],
  browserPolicy: "Prefer API or script first. Browser actions require evidence before being treated as complete.",
  receiptPolicy: "All meaningful external actions must produce an action receipt with evidence, side effects, and next step.",
  reflectionCadence: "Run a reflection pass daily or weekly to promote durable facts and collapse stale noise.",
  handoffPolicy: "Use explicit handoff records whenever work crosses roles, humans, or agents."
};

const hardeningProfiles = new Map<string, HardeningProfile>([
  [standardHardeningProfile.name, standardHardeningProfile]
]);

export function getHardeningProfile(name: string): HardeningProfile {
  const profile = hardeningProfiles.get(name);

  if (!profile) {
    throw new Error(`Unknown hardening profile: ${name}`);
  }

  return profile;
}
