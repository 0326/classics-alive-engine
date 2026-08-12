import { expect, test } from "@playwright/test";

const canonicalChoices = ["下圯取履", "长跪为老人履之", "跪而应诺，记下五日之约", "承认来迟，记住下一次须更早", "接受第二次责语，决定夜未半即往", "夜未半即抵达圯上", "收下书卷，次日辨读并常习诵之"];

test("正史路线、来源和结局可完成", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("heading", { name: "圯上相逢" })).toBeVisible();
	for (const label of canonicalChoices) {
		await page.getByRole("button", { name: label }).click();
		await page.getByRole("button", { name: "继续 →" }).click();
	}
	await expect(page.getByText("正史结局 · 圯上受履")).toBeVisible();
	await expect(page.getByRole("heading", { name: "太公兵法" })).toBeVisible();
});

test("假设分支可重试且版本化存档可恢复", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "存档" }).click();
	await page.getByRole("button", { name: "拒绝命令，转身离开" }).click();
	await expect(page.getByText("假设分支 · 这一次没有走到原典的终点")).toBeVisible();
	await page.getByRole("button", { name: "回到抉择" }).click();
	await expect(page.getByRole("button", { name: "下圯取履" })).toBeVisible();
	await page.getByRole("button", { name: "读档" }).click();
	await expect(page.getByText("已恢复与当前内容版本匹配的存档。")).toBeVisible();
});

test("窄屏不产生水平溢出，键盘可触发选择", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await expect(page.locator("html")).toHaveJSProperty("clientWidth", 390);
	const dimensions = await page.locator("html").evaluate((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
	expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
	await page.getByRole("button", { name: "下圯取履" }).focus();
	await page.keyboard.press("Enter");
	await expect(page.getByText("你压下惊愕，走向桥下。鞋底沾着湿泥，河水在脚边发冷。")).toBeVisible();
});
