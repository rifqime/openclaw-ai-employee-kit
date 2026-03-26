import path from "node:path";

import { VaultValidationReportSchema, type VaultValidationReport } from "../../schemas/src/index.js";

import { REQUIRED_DIRS, REQUIRED_ROOT_FILES } from "./defaults.js";
import { pathExists } from "./io.js";

export async function validateVault(vaultPath: string): Promise<VaultValidationReport> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checkedPaths: string[] = [];

  for (const file of REQUIRED_ROOT_FILES) {
    const target = path.join(vaultPath, file);
    checkedPaths.push(target);
    if (!(await pathExists(target))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  for (const dir of REQUIRED_DIRS) {
    const target = path.join(vaultPath, dir);
    checkedPaths.push(target);
    if (!(await pathExists(target))) {
      errors.push(`Missing required directory: ${dir}`);
    }
  }

  const recommendedFiles = [
    "agent/runtime-profile.yaml",
    "memory/action-receipts.md",
    "memory/reflections.md",
    "templates/action-receipt.md",
    "templates/memory-reflection.md"
  ];

  for (const file of recommendedFiles) {
    const target = path.join(vaultPath, file);
    checkedPaths.push(target);
    if (!(await pathExists(target))) {
      warnings.push(`Missing recommended file: ${file}`);
    }
  }

  const handoffPath = path.join(vaultPath, "memory", "handoffs.md");
  const fleetContextPath = path.join(vaultPath, "FLEET_CONTEXT.md");
  const handoffContractPath = path.join(vaultPath, "HANDOFF_CONTRACT.md");
  const hasHandoffs = await pathExists(handoffPath);
  const hasFleetContext = await pathExists(fleetContextPath);
  const hasHandoffContract = await pathExists(handoffContractPath);

  if (hasHandoffs !== hasFleetContext || hasHandoffs !== hasHandoffContract) {
    warnings.push("Fleet files look partially configured. Keep handoffs, fleet context, and handoff contract in sync.");
  }

  return VaultValidationReportSchema.parse({
    ok: errors.length === 0,
    errors,
    warnings,
    checkedPaths
  });
}
