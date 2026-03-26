import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import {
  applyFleetPack,
  applyOpenClawHardening,
  applyRolePack,
  createDefaultAgentSpec,
  generateVault,
  listFleetPackNames,
  listRolePackNames,
  packageVaultZip,
  toYaml,
  validateVault
} from "../../core/src/index.js";
import type { AgentSpec } from "../../schemas/src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

function getFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["y", "yes", "true", "1"].includes(normalized)) {
    return true;
  }
  if (["n", "no", "false", "0"].includes(normalized)) {
    return false;
  }
  return fallback;
}

function printHelp(): void {
  console.log(
    [
      "employee-kit",
      "",
      "Available commands:",
      "  init-spec [--yaml] [--out <path>]",
      "  wizard [--out <path>]",
      "  print-setup-prompt",
      "  print-setup-questionnaire",
      "  list-role-packs",
      "  list-fleet-packs",
      "  generate-vault --spec <path> [--out-dir <path>]",
      "  apply-role-pack --path <vault-path> --role <role-pack>",
      "  apply-openclaw-hardening --path <vault-path> --profile <profile>",
      "  apply-fleet-pack --path <vault-path> --fleet <fleet-pack>",
      "  validate-vault --path <vault-path>",
      "  package-zip --path <vault-path> [--out <zip-path>]"
    ].join("\n")
  );
}

async function writeSpecFile(spec: AgentSpec, outPath?: string, yaml = true): Promise<void> {
  const serialized = yaml ? toYaml(spec) : JSON.stringify(spec, null, 2);

  if (outPath) {
    await writeFile(path.resolve(process.cwd(), outPath), serialized, "utf8");
    console.log(JSON.stringify({ ok: true, specPath: path.resolve(process.cwd(), outPath) }, null, 2));
    return;
  }

  console.log(serialized);
}

async function runWizard(outPath?: string): Promise<void> {
  if (!input.isTTY || !output.isTTY) {
    throw new Error("Wizard requires an interactive terminal. Use `init-spec --yaml --out <path>` in non-interactive environments.");
  }

  const rolePacks = await listRolePackNames(repoRoot);
  const fleetPacks = await listFleetPackNames(repoRoot);
  const defaults = createDefaultAgentSpec();
  const rl = createInterface({ input, output });

  try {
    const agentName = (await rl.question(`Agent name [${defaults.agentName}]: `)).trim() || defaults.agentName;
    const agentSlugInput = (await rl.question(`Agent slug [${slugify(agentName) || defaults.agentSlug}]: `)).trim();
    const companyName = (await rl.question(`Company name [${defaults.companyName}]: `)).trim() || defaults.companyName;
    const role = (await rl.question(`Role [${defaults.role}]: `)).trim() || defaults.role;
    const primaryGoal =
      (await rl.question(`Primary goal [${defaults.primaryGoal}]: `)).trim() || defaults.primaryGoal;
    const managerRole =
      (await rl.question(`Manager role [${defaults.managerRole}]: `)).trim() || defaults.managerRole;
    const secondaryGoalsInput = (await rl.question("Secondary goals (comma separated, optional): ")).trim();
    const successDefinition =
      (await rl.question(`Success definition [${defaults.successDefinition}]: `)).trim() || defaults.successDefinition;

    console.log(`Available role packs: ${rolePacks.join(", ")}`);
    const rolePack = (await rl.question(`Role pack [${defaults.rolePack}]: `)).trim() || defaults.rolePack;

    const proactive = parseBoolean(
      await rl.question(`Proactive by default? [${defaults.proactive ? "Y/n" : "y/N"}]: `),
      defaults.proactive
    );
    const externalWebAccess = parseBoolean(
      await rl.question(`Enable external web access? [${defaults.externalWebAccess ? "Y/n" : "y/N"}]: `),
      defaults.externalWebAccess
    );
    const browserAccess = parseBoolean(
      await rl.question(`Enable browser access? [${defaults.browserAccess ? "Y/n" : "y/N"}]: `),
      defaults.browserAccess
    );
    const computerAccess = parseBoolean(
      await rl.question(`Enable computer access? [${defaults.computerAccess ? "Y/n" : "y/N"}]: `),
      defaults.computerAccess
    );

    const activeChannelsInput = (await rl.question("Active channels (comma separated, optional): ")).trim();
    const fleetModeInput = (await rl.question(`Fleet mode [${defaults.fleetMode}]: `)).trim() || defaults.fleetMode;
    let fleetPack: string | undefined;
    if (fleetModeInput === "fleet") {
      console.log(`Available fleet packs: ${fleetPacks.join(", ")}`);
      fleetPack = (await rl.question("Fleet pack [small-startup-core]: ")).trim() || "small-startup-core";
    }

    const hardeningProfile =
      (await rl.question(`Hardening profile [${defaults.hardeningProfile}]: `)).trim() || defaults.hardeningProfile;

    const spec: AgentSpec = {
      agentName,
      agentSlug: agentSlugInput || slugify(agentName) || defaults.agentSlug,
      companyName,
      role,
      primaryGoal,
      managerRole,
      secondaryGoals: secondaryGoalsInput
        ? secondaryGoalsInput.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      successDefinition,
      proactive,
      externalWebAccess,
      browserAccess,
      computerAccess,
      activeChannels: activeChannelsInput
        ? activeChannelsInput.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      rolePack,
      hardeningProfile,
      fleetMode: fleetModeInput === "fleet" ? "fleet" : "single-agent",
      fleetPack
    };

    await writeSpecFile(spec, outPath ?? "./agent.spec.yaml", true);
  } finally {
    rl.close();
  }
}

async function main(): Promise<void> {
  const [, , command = "help"] = process.argv;

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "init-spec") {
    const spec = createDefaultAgentSpec();
    const asYaml = process.argv.includes("--yaml");
    const outPath = getFlag("--out");
    await writeSpecFile(spec, outPath, asYaml);
    return;
  }

  if (command === "wizard") {
    await runWizard(getFlag("--out"));
    return;
  }

  if (command === "print-setup-prompt") {
    const promptPath = path.join(repoRoot, "prompts", "OPENCLAW_AGENT_SETUP_OPERATOR.md");
    const contents = await readFile(promptPath, "utf8");
    console.log(contents);
    return;
  }

  if (command === "print-setup-questionnaire") {
    const promptPath = path.join(repoRoot, "questions", "AGENT_SETUP_QUESTIONNAIRE.md");
    const contents = await readFile(promptPath, "utf8");
    console.log(contents);
    return;
  }

  if (command === "list-role-packs") {
    console.log(JSON.stringify(await listRolePackNames(repoRoot), null, 2));
    return;
  }

  if (command === "list-fleet-packs") {
    console.log(JSON.stringify(await listFleetPackNames(repoRoot), null, 2));
    return;
  }

  if (command === "generate-vault") {
    const specPath = getFlag("--spec");
    const outDir = getFlag("--out-dir");

    if (!specPath) {
      throw new Error("Missing required flag: --spec <path>");
    }

    const result = await generateVault({
      repoRoot,
      specPath: path.resolve(process.cwd(), specPath),
      outDir: outDir ? path.resolve(process.cwd(), outDir) : undefined
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          vaultDir: result.vaultDir,
          filesWritten: result.writtenFiles.length,
          rolePack: result.rolePack.name
        },
        null,
        2
      )
    );
    return;
  }

  if (command === "apply-role-pack") {
    const vaultPath = getFlag("--path");
    const rolePackName = getFlag("--role");
    if (!vaultPath || !rolePackName) {
      throw new Error("Missing required flags: --path <vault-path> --role <role-pack>");
    }

    const result = await applyRolePack({
      repoRoot,
      vaultPath: path.resolve(process.cwd(), vaultPath),
      rolePackName
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          vaultDir: result.vaultDir,
          filesWritten: result.writtenFiles.length,
          rolePack: result.rolePack.name
        },
        null,
        2
      )
    );
    return;
  }

  if (command === "apply-openclaw-hardening") {
    const vaultPath = getFlag("--path");
    const profileName = getFlag("--profile");
    if (!vaultPath || !profileName) {
      throw new Error("Missing required flags: --path <vault-path> --profile <profile>");
    }

    const result = await applyOpenClawHardening({
      repoRoot,
      vaultPath: path.resolve(process.cwd(), vaultPath),
      profileName
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          vaultDir: result.vaultDir,
          filesWritten: result.writtenFiles.length,
          hardeningProfile: result.spec.hardeningProfile
        },
        null,
        2
      )
    );
    return;
  }

  if (command === "apply-fleet-pack") {
    const vaultPath = getFlag("--path");
    const fleetPackName = getFlag("--fleet");
    if (!vaultPath || !fleetPackName) {
      throw new Error("Missing required flags: --path <vault-path> --fleet <fleet-pack>");
    }

    const result = await applyFleetPack({
      repoRoot,
      vaultPath: path.resolve(process.cwd(), vaultPath),
      fleetPackName
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          vaultDir: result.vaultDir,
          filesWritten: result.writtenFiles.length,
          fleetPack: result.fleetPack?.name ?? fleetPackName
        },
        null,
        2
      )
    );
    return;
  }

  if (command === "validate-vault") {
    const vaultPath = getFlag("--path");
    if (!vaultPath) {
      throw new Error("Missing required flag: --path <vault-path>");
    }

    const report = await validateVault(path.resolve(process.cwd(), vaultPath));
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
    return;
  }

  if (command === "package-zip") {
    const vaultPath = getFlag("--path");
    const outPath = getFlag("--out");
    if (!vaultPath) {
      throw new Error("Missing required flag: --path <vault-path>");
    }

    const zipPath = await packageVaultZip(
      path.resolve(process.cwd(), vaultPath),
      outPath ? path.resolve(process.cwd(), outPath) : undefined
    );
    console.log(JSON.stringify({ ok: true, zipPath }, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
