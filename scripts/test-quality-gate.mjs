import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const temp = mkdtempSync(join(tmpdir(), "cage-quality-gate-"));
try {
	const fixture = join(temp, "demo");
	cpSync("content/demo", fixture, { recursive: true });
	const targetFile = join(fixture, "design/quality-targets.json");
	const targets = JSON.parse(readFileSync(targetFile, "utf8"));
	targets.evidence.claims.min = 99;
	writeFileSync(targetFile, `${JSON.stringify(targets, null, 2)}\n`);
	const result = spawnSync(process.execPath, ["scripts/quality-gate.mjs", fixture, "demo"], {
		encoding: "utf8",
		env: { ...process.env, CAGE_REPORT_DIR: join(temp, "reports"), CAGE_GENERATED_DIR: join(temp, "generated", "active") },
	});
	if (result.status === 0) throw new Error("quality gate accepted a chapter that missed its declared target");
	const report = JSON.parse(readFileSync(join(temp, "reports", "demo", "quality-gate.json"), "utf8"));
	if (report.status !== "failed" || !report.repairInputs.some((item) => item.label === "content")) throw new Error("quality gate did not expose machine-readable repair input");
	console.log("Quality-gate regression test passed: unmet chapter target yields repair input");
} finally {
	rmSync(temp, { recursive: true, force: true });
}
