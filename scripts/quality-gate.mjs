import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { activeGame } from "./active-game.mjs";

const root = resolve(process.argv[2] ?? activeGame.contentPack);
const storyId = process.argv[3] ?? activeGame.storyId;
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8"));
const reportDir = resolve(process.env.CAGE_REPORT_DIR ?? "reports");
const run = (label, args) => {
	const result = spawnSync(process.execPath, args, {
		encoding: "utf8",
		env: { ...process.env, CAGE_REPORT_DIR: reportDir },
	});
	return { label, status: result.status === 0 ? "passed" : "failed", output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim() };
};

const checks = [
	run("content", ["scripts/validate-content.mjs", root]),
	run("all-branches", ["scripts/verify-ink.mjs", resolve(root, "stories", `${storyId}.ink`)]),
	run("canonical-route", ["scripts/verify-canon.mjs", resolve(root, "stories", `${storyId}.ink`)]),
	run("compile", ["scripts/compile-content.mjs", root, storyId]),
	run("content-report", ["scripts/content-report.mjs", root]),
];
const status = checks.every((check) => check.status === "passed") ? "validated" : "failed";
const report = {
	pack: manifest.id,
	storyId,
	status,
	checks: checks.map(({ label, status: checkStatus }) => ({ label, status: checkStatus })),
	repairInputs: checks.filter((check) => check.status === "failed").map(({ label, output }) => ({ label, output })),
};
const output = resolve(reportDir, manifest.id, "quality-gate.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
if (status === "failed") {
	console.error(`Quality gate failed: ${output}`);
	for (const check of report.repairInputs) console.error(`\n[${check.label}]\n${check.output}`);
	process.exit(1);
}
console.log(`Quality gate passed: ${manifest.id}/${storyId} (${output})`);
