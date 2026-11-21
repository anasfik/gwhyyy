import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const base = process.env.TMPDIR || "/tmp/opencode";
fs.mkdirSync(base, { recursive: true });
const output = fs.mkdtempSync(path.join(base, "gwhyyy-tests-"));
try {
  const sources = fs.readdirSync(fileURLToPath(new URL(".", import.meta.url))).filter(name => name.endsWith(".test.ts")).map(name => path.join("tests", name));
  const compiled = spawnSync(path.join("node_modules", ".bin", "tsc"), ["--module", "commonjs", "--moduleResolution", "node", "--jsx", "react-jsx", "--target", "ES2022", "--esModuleInterop", "--strict", "--skipLibCheck", "--outDir", output, ...sources], { stdio: "inherit" });
  if (compiled.status !== 0) process.exitCode = compiled.status || 1;
  else {
    const files = sources.map(name => path.join(output, name.replace(/\.ts$/, ".js")));
    const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit", env: { ...process.env, NODE_PATH: path.resolve("node_modules") } });
    process.exitCode = result.status === 0 ? 0 : result.status ?? 1;
  }
} finally { fs.rmSync(output, { recursive: true, force: true }); }
