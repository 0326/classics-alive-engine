import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const config = JSON.parse(readFileSync(resolve("game.config.json"), "utf8"));
const root = resolve(process.argv[2] ?? config.contentPack);
const storyId = process.argv[3] ?? config.storyId;
const out = resolve("generated", "active");
const readJson = (file) => JSON.parse(readFileSync(`${root}/${file}`, "utf8"));
const readJsonl = (file) => readFileSync(`${root}/${file}`, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse);
if (!existsSync(`${root}/stories/${storyId}.ink`)) throw new Error(`Story not found: ${root}/stories/${storyId}.ink`);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const content = {
	manifest: readJson("manifest.json"),
	story: readJson(`stories/${storyId}.json`),
	segments: readJsonl("sources/segments.jsonl"),
	claims: readJsonl("canon/claims.jsonl"),
	reader: readJson("learning/reader.json"),
	assets: readJson("assets/manifest.json"),
	outcomes: readJson("canon/outcomes.json"),
	review: readJson("review/approval.json"),
};
writeFileSync(`${out}/content.json`, `${JSON.stringify(content, null, 2)}\n`);
cpSync(`${root}/stories/${storyId}.ink`, `${out}/story.ink`);
cpSync(`${root}/assets`, `${out}/assets`, { recursive: true });
console.log(`Content compiled: ${content.manifest.id}/${storyId} → ${out}`);
