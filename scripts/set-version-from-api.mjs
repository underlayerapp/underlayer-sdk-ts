import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const pkgPath = resolve(process.cwd(), "package.json");
const apiVersion = process.env.API_VERSION ?? process.argv[2];
if (!apiVersion) {
  console.error("[set:version] Missing API version. Use API_VERSION env var or pass as first arg.");
  process.exit(1);
}
const semverPattern = /^\d+\.\d+\.\d+$/;
if (!semverPattern.test(apiVersion)) {
  console.error(`[set:version] Invalid version '${apiVersion}'. Expected MAJOR.MINOR.PATCH`);
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const previous = pkg.version;
pkg.version = apiVersion;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
console.log(`[set:version] package.json version ${previous} -> ${pkg.version}`);
