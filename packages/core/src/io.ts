import { mkdir, readdir, stat, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";

export async function loadYamlFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return parse(raw) as T;
}

export async function writeTextFile(filePath: string, contents: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

export function toYaml(value: unknown): string {
  return stringify(value, { lineWidth: 0 });
}

export async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        return listFilesRecursive(fullPath);
      }
      return [fullPath];
    })
  );

  return results.flat();
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}
