import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = mkdtempSync(join(tmpdir(), "cage-import-"));
try {
	const input = join(root, "sample.txt");
	const output = join(root, "pack");
	writeFileSync(input, "第一段原文。\n\n第二段原文。\n");
	const result = spawnSync(process.execPath, ["scripts/import-source.mjs", input, output, "fixture"], { encoding: "utf8" });
	if (result.status !== 0) throw new Error(result.stderr || result.stdout);
	const lines = readFileSync(join(output, "sources/segments.jsonl"), "utf8").trim().split("\n");
	if (lines.length !== 2 || JSON.parse(lines[0]).id !== "fixture.import.001") throw new Error("importer output mismatch");
	console.log("Source importer regression passed: paragraphs become stable segments");
} finally {
	rmSync(root, { recursive: true, force: true });
}
