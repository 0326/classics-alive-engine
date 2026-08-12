import { Compiler } from "inkjs/full";
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) throw new Error("Usage: node scripts/verify-ink.mjs <story.ink>");
const source = readFileSync(file, "utf8");
let story;
try { story = new Compiler(source).Compile(); }
catch (error) { console.error(`Ink compile failed: ${error.message}`); process.exit(1); }

const branches = { count: 0, maxDepth: 0, deaths: [], achieves: [] };
const tags = (items) => new Set(items ?? []);
function walk(depth = 0) {
	if (depth > 200) throw new Error("story exceeded 200 choice levels");
	branches.maxDepth = Math.max(branches.maxDepth, depth);
	while (story.canContinue) {
		story.Continue();
		const current = tags(story.currentTags);
		for (const tag of current) {
			if (tag.startsWith("death:")) branches.deaths.push(tag);
			if (tag.startsWith("achieve:")) branches.achieves.push(tag);
		}
	}
	const choices = story.currentChoices;
	if (!choices?.length) { branches.count += 1; return; }
	const snapshot = story.state.ToJson();
	for (const choice of choices) {
		story.state.LoadJson(snapshot);
		story.ChooseChoiceIndex(choice.index);
		walk(depth + 1);
	}
}
walk();
console.log(`Ink verification passed: ${file} (${branches.count} endings, depth ${branches.maxDepth}, deaths ${new Set(branches.deaths).size}, achievements ${new Set(branches.achieves).size})`);
