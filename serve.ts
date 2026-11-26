// RumahKu Budget — local static server for the site in app/.
//
// Serves app/ at http://localhost:8080 (or --port <n>) so the site can be
// opened in desktop Chrome and checked at a phone's size. Standard library
// only; it serves files, never runs anything, and sends no-cache headers so
// an edit shows up on reload.
//
//   node serve.ts
//   node serve.ts --port 8090

import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "app");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function portFromArgs() {
  const index = process.argv.indexOf("--port");
  if (index !== -1 && process.argv[index + 1]) {
    const port = Number(process.argv[index + 1]);
    if (Number.isInteger(port) && port > 0 && port < 65536) return port;
  }
  return 8080;
}

const port = portFromArgs();

const server = createServer((request, response) => {
  const rawPath = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(appDir, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(appDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found: " + rawPath + "\n");
    return;
  }
  const type = TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
  response.writeHead(200, {
    "content-type": type,
    "cache-control": "no-store",
    "content-length": statSync(filePath).size,
  });
  response.end(readFileSync(filePath));
});

server.listen(port, () => {
  console.log("RumahKu Budget serving app/ at http://localhost:" + port);
});
