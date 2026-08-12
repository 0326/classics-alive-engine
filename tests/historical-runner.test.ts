import { readFileSync } from "node:fs";
import { HistoricalRunner } from "../packages/historical-adapter/src/index.ts";

const source = readFileSync("content/demo/stories/demo.ink", "utf8");
const identity = { contentPackId: "demo", contentVersion: "0.2.0", storyId: "demo", storyVersion: "0.2.0" };
const runner = new HistoricalRunner(source, identity);
runner.advance();
const firstChoice = runner.choices().find((choice) => choice.meta.correct);
if (!firstChoice) throw new Error("canonical choice missing");
runner.choose(firstChoice.index);
const afterChoice = runner.advance();
if (afterChoice?.meta.evidence !== "claim.zhangliang.take-shoe") throw new Error("choice evidence was not carried into the resulting segment");
const save = runner.save();
if (save.identity.contentVersion !== "0.2.0" || save.formatVersion !== 1) throw new Error("save is missing version metadata");
const wrongVersion = new HistoricalRunner(source, { ...identity, contentVersion: "0.2.1" });
let rejected = false;
try { wrongVersion.load(save); } catch { rejected = true; }
if (!rejected) throw new Error("cross-version save was accepted");
console.log("Historical runner regression passed: evidence carry-over and versioned saves are enforced");
