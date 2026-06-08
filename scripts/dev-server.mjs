import http from "node:http";
import { spawn } from "node:child_process";

const mainPort = 4173;
const legacyPort = 4175;

const redirectServer = http.createServer((request, response) => {
  const target = `http://localhost:${mainPort}${request.url || "/"}`;
  response.writeHead(302, {
    Location: target,
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(`Redirecting to ${target}\n`);
});

redirectServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.warn(`[dev] localhost:${legacyPort} is already in use; legacy redirect skipped.`);
    return;
  }
  console.warn(`[dev] legacy redirect failed: ${error.message}`);
});

redirectServer.listen(legacyPort, "0.0.0.0", () => {
  console.log(`[dev] Legacy URL: http://localhost:${legacyPort}/ -> http://localhost:${mainPort}/`);
});

const vite = spawn(
  "vite",
  ["--host", "0.0.0.0", "--port", String(mainPort), "--strictPort"],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

const cleanup = () => {
  redirectServer.close();
  if (!vite.killed) vite.kill();
};

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

vite.on("exit", (code) => {
  redirectServer.close();
  process.exit(code ?? 0);
});
