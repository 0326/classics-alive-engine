import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const configuredGame = JSON.parse(readFileSync(resolve("game.config.json"), "utf8"));

export const activeGame = {
	contentPack: process.env.CAGE_CONTENT_PACK ?? configuredGame.contentPack,
	storyId: process.env.CAGE_STORY_ID ?? configuredGame.storyId,
};
