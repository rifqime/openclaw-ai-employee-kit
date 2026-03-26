import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import JSZip from "jszip";

import { listFilesRecursive } from "./io.js";

export async function packageVaultZip(vaultPath: string, outPath?: string): Promise<string> {
  const zip = new JSZip();
  const files = await listFilesRecursive(vaultPath);
  const rootName = path.basename(vaultPath);

  for (const filePath of files) {
    const relativePath = path.relative(vaultPath, filePath);
    const contents = await readFile(filePath);
    zip.file(path.posix.join(rootName, relativePath.split(path.sep).join(path.posix.sep)), contents);
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipPath = outPath ?? `${vaultPath}.zip`;
  await writeFile(zipPath, buffer);

  return zipPath;
}
