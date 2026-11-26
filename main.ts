// RumahKu Budget — the hand-in program (Node 22+, standard library only).
// It copies the site (app/) and its screenshots (screenshots/) from this
// repository into /output and writes /output/dossier.json with the vendored
// make.fun library, exactly as the kit's starter does. Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program writes the same bytes on every run: it copies files only,
// never stamps a time or a random value into the output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's screenshots rule, checked here before anything is copied:
// 3 or 4 images, each a regular file of at most 256 KiB.
const MAX_SHOT_BYTES = 262144;

// Returns the screenshot names after checking each one is a regular file
// inside the size cap; throws loudly on the first problem instead of
// handing in a partial entry.
function requireShots(shotsDir: string): string[] {
  if (!existsSync(shotsDir)) {
    throw new Error(`refusing to build: ${shotsDir} is missing`);
  }
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`refusing to build: expected 3 or 4 screenshots, found ${shots.length}`);
  }
  for (const name of shots) {
    const shot = join(shotsDir, name);
    const stats = statSync(shot);
    if (!stats.isFile()) {
      throw new Error(`refusing to build: screenshot ${name} is not a regular file`);
    }
    if (stats.size > MAX_SHOT_BYTES) {
      throw new Error(`refusing to build: screenshot ${name} is ${stats.size} bytes, over the 256 KiB cap`);
    }
  }
  return shots;
}

// Fail loudly instead of handing in a partial entry: the site and its
// screenshots must both be present before anything is copied.
const indexFile = join(here, 'app', 'index.html');
if (!existsSync(indexFile)) {
  throw new Error(`refusing to build: ${indexFile} is missing`);
}
const shotsDir = join(here, 'screenshots');
const shots = requireShots(shotsDir);

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The gate's caps, from the kit: at most 4 screenshots of 256 KiB each, at
// most 993 files / 16 MiB in app/, and the dossier text capped at 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
