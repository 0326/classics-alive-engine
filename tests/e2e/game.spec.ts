import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const activeContent = JSON.parse(readFileSync(resolve("generated/active/content.json"), "utf8"));
const story = readFileSync(resolve("generated/active/story.ink"), "utf8");
const choices = [...story.matchAll(/^\s*\*\s*\[([^\]]+)\]\s*(.*)$/gm)].map((match) => ({ label: match[1].trim(), tags: match[2] }));
const canonicalChoices = choices.filter((choice) => /#correct(?:\s|$)/.test(choice.tags)).map((choice) => choice.label);
const counterfactualChoice = choices.find((choice) => /#counterfactual:/.test(choice.tags));
const canonicalAchievement = activeContent.outcomes.achievements.find((item: { id: string }) => story.includes(`#achieve:${item.id}`));

if (!canonicalChoices.length || !counterfactualChoice || !canonicalAchievement) throw new Error("active content pack does not expose a testable canonical and counterfactual route");

async function continueIfNeeded(page: import("@playwright/test").Page) {
	const continueButton = page.getByRole("button", { name: "继续 →" });
	if (await continueButton.count()) await continueButton.click();
}

test("正史路线、来源和结局可完成", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByText(activeContent.story.title, { exact: false })).toBeVisible();
	await expect(page.locator(".side-panel blockquote")).not.toHaveText("");
	for (const label of canonicalChoices) {
		await page.getByRole("button", { name: label }).click();
		await continueIfNeeded(page);
	}
	await expect(page.getByText(`正史结局 · ${canonicalAchievement.title}`)).toBeVisible();
	await expect(page.locator(".evidence-chip")).toContainText(canonicalAchievement.id ? "证据链" : "");
});

test("假设分支可重试且版本化存档可恢复", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "存档" }).click();
	await page.getByRole("button", { name: counterfactualChoice.label }).click();
	await expect(page.getByText("假设分支 · 这一次没有走到原典的终点")).toBeVisible();
	await page.getByRole("button", { name: "回到抉择" }).click();
	await expect(page.getByRole("button", { name: canonicalChoices[0] })).toBeVisible();
	await page.getByRole("button", { name: "读档" }).click();
	await expect(page.getByText("已恢复与当前内容版本匹配的存档。")).toBeVisible();
});

test("窄屏不产生水平溢出，键盘可触发首个正史选择", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await expect(page.locator("html")).toHaveJSProperty("clientWidth", 390);
	const dimensions = await page.locator("html").evaluate((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
	expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
	const firstChoice = page.getByRole("button", { name: canonicalChoices[0] });
	await firstChoice.focus();
	await page.keyboard.press("Enter");
	await expect(firstChoice).not.toBeVisible();
	await expect(page.locator(".dialogue-text")).not.toHaveText("");
});

test("桌面首屏保留可操作对话，角色具有内容包替代文本", async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto("/");
	const visualState = await page.locator("body").evaluate(() => ({
		dialogueBottom: document.querySelector(".dialogue-card")?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
		viewportHeight: window.innerHeight,
		characterAlts: [...document.querySelectorAll<HTMLImageElement>(".character")].map((image) => image.alt.trim()),
	}));
	expect(visualState.dialogueBottom).toBeLessThanOrEqual(visualState.viewportHeight);
	expect(visualState.characterAlts.length).toBeGreaterThan(0);
	expect(visualState.characterAlts.every((alt) => alt.length >= 4 && alt !== "叙事角色")).toBeTruthy();
});
