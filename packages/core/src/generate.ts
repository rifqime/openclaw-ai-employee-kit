import { mkdir } from "node:fs/promises";
import path from "node:path";

import { getHardeningProfile } from "../../openclaw-runtime/src/index.js";
import {
  AgentSpecSchema,
  FleetPackSchema,
  type AgentSpec,
  type FleetPack,
  RolePackSchema,
  type RolePack
} from "../../schemas/src/index.js";

import {
  computeVaultName,
  getVaultDirectories,
  renderVaultFiles,
  shouldOverwriteOnApply
} from "./defaults.js";
import { loadYamlFile, pathExists, writeTextFile } from "./io.js";

export interface GenerateVaultOptions {
  repoRoot: string;
  specPath: string;
  outDir?: string;
}

export interface ApplyRolePackOptions {
  repoRoot: string;
  vaultPath: string;
  rolePackName: string;
}

export interface ApplyOpenClawHardeningOptions {
  repoRoot: string;
  vaultPath: string;
  profileName: string;
}

export interface ApplyFleetPackOptions {
  repoRoot: string;
  vaultPath: string;
  fleetPackName: string;
}

export interface GenerateVaultResult {
  spec: AgentSpec;
  rolePack: RolePack;
  fleetPack?: FleetPack;
  vaultDir: string;
  writtenFiles: string[];
}

async function writeRenderedFiles(
  vaultDir: string,
  files: Record<string, string>,
  mode: "fresh" | "apply"
): Promise<string[]> {
  const writtenFiles: string[] = [];

  for (const [relativePath, contents] of Object.entries(files)) {
    const outputPath = path.join(vaultDir, relativePath);
    const exists = await pathExists(outputPath);

    if (mode === "apply" && exists && !shouldOverwriteOnApply(relativePath)) {
      continue;
    }

    await writeTextFile(outputPath, contents);
    writtenFiles.push(outputPath);
  }

  return writtenFiles;
}

async function ensureVaultDirectories(vaultDir: string, rolePack: RolePack, spec: AgentSpec): Promise<void> {
  for (const directory of getVaultDirectories(rolePack, spec)) {
    await mkdir(path.join(vaultDir, directory), { recursive: true });
  }
}

export async function loadAgentSpec(specPath: string): Promise<AgentSpec> {
  const parsed = await loadYamlFile<unknown>(specPath);
  return AgentSpecSchema.parse(parsed);
}

export async function loadVaultAgentSpec(vaultPath: string): Promise<AgentSpec> {
  return loadAgentSpec(path.join(vaultPath, "agent", "agent-spec.yaml"));
}

export async function loadRolePack(repoRoot: string, rolePackName: string): Promise<RolePack> {
  const packPath = path.join(repoRoot, "role-packs", rolePackName, "pack.yaml");
  const parsed = await loadYamlFile<unknown>(packPath);
  return RolePackSchema.parse(parsed);
}

export async function loadFleetPack(repoRoot: string, fleetPackName: string): Promise<FleetPack> {
  const packPath = path.join(repoRoot, "fleet-packs", fleetPackName, "pack.yaml");
  const parsed = await loadYamlFile<unknown>(packPath);
  return FleetPackSchema.parse(parsed);
}

function resolveFleetPackPromise(repoRoot: string, spec: AgentSpec): Promise<FleetPack | undefined> {
  if (spec.fleetMode !== "fleet" || !spec.fleetPack) {
    return Promise.resolve(undefined);
  }

  return loadFleetPack(repoRoot, spec.fleetPack);
}

export async function generateVault(options: GenerateVaultOptions): Promise<GenerateVaultResult> {
  const spec = await loadAgentSpec(options.specPath);
  const rolePack = await loadRolePack(options.repoRoot, spec.rolePack);
  const hardening = getHardeningProfile(spec.hardeningProfile);
  const fleetPack = await resolveFleetPackPromise(options.repoRoot, spec);
  const vaultDir = options.outDir ?? path.join(options.repoRoot, "generated", computeVaultName(spec));

  if (await pathExists(vaultDir)) {
    throw new Error(`Refusing to overwrite existing directory: ${vaultDir}`);
  }

  await ensureVaultDirectories(vaultDir, rolePack, spec);

  const files = renderVaultFiles(spec, rolePack, hardening, fleetPack);
  const writtenFiles = await writeRenderedFiles(vaultDir, files, "fresh");

  return { spec, rolePack, fleetPack, vaultDir, writtenFiles };
}

export async function applyRolePack(options: ApplyRolePackOptions): Promise<GenerateVaultResult> {
  const spec = await loadVaultAgentSpec(options.vaultPath);
  spec.rolePack = options.rolePackName;
  const rolePack = await loadRolePack(options.repoRoot, options.rolePackName);
  const hardening = getHardeningProfile(spec.hardeningProfile);
  const fleetPack = await resolveFleetPackPromise(options.repoRoot, spec);

  await ensureVaultDirectories(options.vaultPath, rolePack, spec);

  const files = renderVaultFiles(spec, rolePack, hardening, fleetPack);
  const writtenFiles = await writeRenderedFiles(options.vaultPath, files, "apply");

  return {
    spec,
    rolePack,
    fleetPack,
    vaultDir: options.vaultPath,
    writtenFiles
  };
}

export async function applyOpenClawHardening(options: ApplyOpenClawHardeningOptions): Promise<GenerateVaultResult> {
  const spec = await loadVaultAgentSpec(options.vaultPath);
  spec.hardeningProfile = options.profileName;
  const rolePack = await loadRolePack(options.repoRoot, spec.rolePack);
  const hardening = getHardeningProfile(options.profileName);
  const fleetPack = await resolveFleetPackPromise(options.repoRoot, spec);

  await ensureVaultDirectories(options.vaultPath, rolePack, spec);

  const files = renderVaultFiles(spec, rolePack, hardening, fleetPack);
  const writtenFiles = await writeRenderedFiles(options.vaultPath, files, "apply");

  return {
    spec,
    rolePack,
    fleetPack,
    vaultDir: options.vaultPath,
    writtenFiles
  };
}

export async function applyFleetPack(options: ApplyFleetPackOptions): Promise<GenerateVaultResult> {
  const spec = await loadVaultAgentSpec(options.vaultPath);
  spec.fleetMode = "fleet";
  spec.fleetPack = options.fleetPackName;
  const rolePack = await loadRolePack(options.repoRoot, spec.rolePack);
  const hardening = getHardeningProfile(spec.hardeningProfile);
  const fleetPack = await loadFleetPack(options.repoRoot, options.fleetPackName);

  await ensureVaultDirectories(options.vaultPath, rolePack, spec);

  const files = renderVaultFiles(spec, rolePack, hardening, fleetPack);
  const writtenFiles = await writeRenderedFiles(options.vaultPath, files, "apply");

  return {
    spec,
    rolePack,
    fleetPack,
    vaultDir: options.vaultPath,
    writtenFiles
  };
}
