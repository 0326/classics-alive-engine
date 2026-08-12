import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const run = (target, shouldPass, label) => {
	const result = spawnSync(process.execPath, ["scripts/validate-content.mjs", target], { encoding: "utf8" });
	if ((result.status === 0) !== shouldPass) throw new Error(`${label}: expected ${shouldPass ? "pass" : "failure"}\n${result.stdout}\n${result.stderr}`);
};
const withFixture = (label, mutate) => {
	const root = mkdtempSync(join(tmpdir(), "cage-validator-"));
	try {
		const fixture = join(root, "demo");
		cpSync("content/demo", fixture, { recursive: true });
		mutate(fixture);
		run(fixture, false, label);
	} finally { rmSync(root, { recursive: true, force: true }); }
};

run("content/demo", true, "valid content pack");
run("tests/fixtures/invalid-missing-source", false, "missing source fixture");
withFixture("canonical choice without evidence", (fixture) => {
	const file = join(fixture, "stories/demo.ink");
	writeFileSync(file, readFileSync(file, "utf8").replace("#correct #evidence:claim.zhangliang.take-shoe", "#correct"));
});
withFixture("dangling asset", (fixture) => {
	const file = join(fixture, "stories/demo.ink");
	writeFileSync(file, readFileSync(file, "utf8").replace("background.xiapixian-evening", "background.missing"));
});
withFixture("mismatched quote", (fixture) => {
	const file = join(fixture, "learning/quotes.jsonl");
	writeFileSync(file, readFileSync(file, "utf8").replace("孺子，下取履！", "不存在的引文"));
});
withFixture("unmapped usage", (fixture) => {
	const file = join(fixture, "canon/claims.jsonl");
	writeFileSync(file, readFileSync(file, "utf8").replace("demo.act-01.take-shoe", "demo.act-99.missing"));
});
console.log("Validator regression tests passed: source, quote, canonical evidence, asset, and usage failures are blocked");
