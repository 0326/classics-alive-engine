import { existsSync } from "node:fs";

const required = [
	"packages/schema/src/index.ts",
	"packages/schema/package.json",
	"content/demo/manifest.json",
	"content/demo/sources/segments.jsonl",
	"content/demo/canon/claims.jsonl",
	"skills/build-classics-alive-game/SKILL.md",
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
	console.error(`Baseline check failed: missing ${missing.join(", ")}`);
	process.exit(1);
}
console.log(`Baseline check passed: ${required.length} Phase 0 artifacts present`);
