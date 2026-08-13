import { Compiler } from "inkjs/full";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { activeGame } from "./active-game.mjs";

const file = process.argv[2] ?? resolve(activeGame.contentPack, "stories", `${activeGame.storyId}.ink`);
const source = readFileSync(file, "utf8");
const story = new Compiler(source).Compile();
const authoredChoiceTags = new Map([...source.matchAll(/^\s*\*\s*\[([^\]]+)\]\s*(.*)$/gm)].map((match) => [match[1].trim(), [...match[2].matchAll(/#([\w-]+)(?::([^\s]+))?/g)].map((tag) => tag[2] ? `${tag[1]}:${tag[2]}` : tag[1])]));
let choices = 0;
const seenAchievements = [];
let ending = false;
for (let guard = 0; guard < 500; guard += 1) {
	while (story.canContinue) {
		story.Continue();
		for (const tag of story.currentTags ?? []) {
			if (tag.startsWith("death:")) throw new Error(`canonical route triggered ${tag}`);
			if (tag.startsWith("achieve:")) seenAchievements.push(tag.slice("achieve:".length));
		}
	}
	const options = story.currentChoices;
	if (!options?.length) { ending = true; break; }
	const correct = options.find((choice) => ((choice.tags?.length ? choice.tags : authoredChoiceTags.get(choice.text.trim())) ?? []).includes("correct"));
	if (!correct) throw new Error(`canonical route has no #correct choice at node ${choices + 1}`);
	story.ChooseChoiceIndex(correct.index);
	choices += 1;
}
if (!ending) throw new Error("canonical route exceeded 500 steps");
if (!seenAchievements.length) throw new Error("canonical route reached no #achieve");
console.log(`Canonical route passed: ${file} (${choices} choices, ending, achievements ${seenAchievements.join(", ")})`);
