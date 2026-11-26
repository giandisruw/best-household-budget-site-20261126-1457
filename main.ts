// RumahKu Budget — entrypoint for make.fun.
//
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from
// vendor/makefun-frontend.ts. Run outside the grader with:
//   MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The program is deterministic: files are copied in code-unit path order
// and buildDossier writes canonical bytes, so the grader's two runs
// always produce identical output.

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
if (outDir === resolve(repoRoot)) {
  throw new Error("main.ts: refusing to use the repository root as the output directory");
}

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16 * 1024 * 1024,
  app_path_max_bytes: 1000,
};

// Copy one directory tree, files first in sorted order, so the output is
// byte-identical on every run and on every machine.
function copyTree(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  let copied = 0;
  const entries = readdirSync(sourceDir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const from = join(sourceDir, entry.name);
    const to = join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copied += copyTree(from, to);
    } else if (entry.isFile()) {
      copyFileSync(from, to);
      copied++;
    } else {
      throw new Error("main.ts: " + from + " is not a plain file or directory");
    }
  }
  return copied;
}

function requireDir(path, label) {
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    throw new Error("main.ts: " + label + " is missing from the repository: " + path);
  }
}

requireDir(join(repoRoot, "app"), "app/");
requireDir(join(repoRoot, "screenshots"), "screenshots/");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const appFiles = copyTree(join(repoRoot, "app"), join(outDir, "app"));
const shotFiles = copyTree(join(repoRoot, "screenshots"), join(outDir, "screenshots"));

const dossier = buildDossier(outDir, CAPS);
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(
  "RumahKu Budget: copied " + appFiles + " app files and " + shotFiles +
  " screenshots, wrote " + outDir + "/dossier.json (" + dossier.length + " bytes)",
);
