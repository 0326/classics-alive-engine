import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { activeGame } from "./active-game.mjs";

const manifest = JSON.parse(readFileSync(resolve(activeGame.contentPack, "manifest.json"), "utf8"));
const reportDir = resolve(process.env.CAGE_REPORT_DIR ?? "reports");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const run = (label, args) => {
	const result = spawnSync(npm, args, { encoding: "utf8", env: { ...process.env, CAGE_REPORT_DIR: reportDir } });
	return { label, status: result.status === 0 ? "passed" : "failed", output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim() };
};

const checks = [
	run("content-quality", ["run", "content:quality"]),
	run("static-check", ["run", "check"]),
	run("regression", ["test"]),
	run("production-build", ["run", "build:all"]),
	run("build-budget", ["run", "build:budget"]),
	run("browser-playthrough", ["run", "test:e2e"]),
	run("deployment-dry-run", ["run", "deploy:dry"]),
];
const technicalStatus = checks.every((check) => check.status === "passed") ? "validated" : "failed";
const review = JSON.parse(readFileSync(resolve(activeGame.contentPack, "review/approval.json"), "utf8"));
const historical = review.reviewers?.historical?.status;
const releaseStatus = technicalStatus === "failed"
	? "blocked:technical-failures"
	: historical === "reviewed" ? "ready-for-release" : "blocked:human-historical-review";
const report = {
	pack: manifest.id,
	storyId: activeGame.storyId,
	status: technicalStatus,
	releaseStatus,
	checks: checks.map(({ label, status }) => ({ label, status })),
	repairInputs: checks.filter((check) => check.status === "failed").map(({ label, output }) => ({ label, output })),
};
const output = resolve(reportDir, manifest.id, "completion.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
if (technicalStatus === "failed") {
	console.error(`Playability gate failed: ${output}`);
	for (const check of report.repairInputs) console.error(`\n[${check.label}]\n${check.output}`);
	process.exit(1);
}
console.log(`Playability gate passed: ${manifest.id}; release status: ${releaseStatus}`);
