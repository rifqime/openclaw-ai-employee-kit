import { readdir } from "node:fs/promises";
import path from "node:path";

async function listPackNames(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function listRolePackNames(repoRoot: string): Promise<string[]> {
  return listPackNames(path.join(repoRoot, "role-packs"));
}

export async function listFleetPackNames(repoRoot: string): Promise<string[]> {
  return listPackNames(path.join(repoRoot, "fleet-packs"));
}
