import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
const defaultSpecPath = resolve(process.cwd(), "../core/spec/openapi.v1.json");
const specPath = process.env.OPENAPI_SPEC_PATH
  ? resolve(process.cwd(), process.env.OPENAPI_SPEC_PATH)
  : defaultSpecPath;
const outputPath = resolve(process.cwd(), "src/generated/schema.ts");
if (!existsSync(specPath)) {
  if (existsSync(outputPath)) {
    console.log(`[generate] OpenAPI spec not found – using existing ${outputPath} (skip)`);
    process.exit(0);
  }
  console.error(`[generate] OpenAPI spec not found: ${specPath}`);
  process.exit(1);
}
const result = spawnSync(
  "npx",
  ["openapi-typescript", specPath, "-o", outputPath],
  { stdio: "inherit", shell: process.platform === "win32" }
);
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
console.log(`[generate] Wrote ${outputPath}`);
