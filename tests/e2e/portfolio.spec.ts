import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kreik-mode", "resume"));
  await page.goto("/");
});

test("resume has no horizontal overflow", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));

  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
});

test("projects keep their order and all covers load", async ({ page }) => {
  const cards = page.locator("#work li").filter({ has: page.locator("h3") });

  await expect(cards).toHaveCount(4);
  await expect(cards.locator("h3")).toHaveText([
    "CodeUnity",
    "FilmCraft — Electron workflow",
    "Site Watch Bot",
    "AIO Dashboard",
  ]);

  const covers = page.locator("#work img");
  for (let index = 0; index < (await covers.count()); index += 1) {
    const cover = covers.nth(index);
    await cover.scrollIntoViewIfNeeded();
    await expect(cover).toHaveJSProperty("complete", true);
  }

  const failedCovers = await covers.evaluateAll((images) =>
    images
      .filter((image) => !(image as HTMLImageElement).complete || !(image as HTMLImageElement).naturalWidth)
      .map((image) => (image as HTMLImageElement).src),
  );

  expect(failedCovers).toEqual([]);
});

test("primary navigation is keyboard reachable", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.locator("a:focus-visible")).toBeVisible();

  const labels = await page.locator("nav a").evaluateAll((links) =>
    links.map((link) => link.textContent?.trim()).filter(Boolean),
  );

  expect(labels).toEqual(["Головна", "Про мене", "Роботи", "Стек", "Контакти"]);

  const undersizedTargets = await page.locator("nav a").evaluateAll((links) =>
    links
      .map((link) => {
        const { width, height } = link.getBoundingClientRect();
        return { label: link.textContent?.trim(), width, height };
      })
      .filter(({ width, height }) => width < 44 || height < 44),
  );

  expect(undersizedTargets).toEqual([]);
});

test("room scene stays usable and opens its case files", async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem("kreik-mode", "room"));
  await page.goto("/room/");

  const skip = page.getByRole("button", { name: /пропустити/i });
  if (await skip.isVisible()) await skip.click();

  await expect(page.getByRole("heading", { name: "МАЙСТЕРНЯ KREIK" })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);

  if (testInfo.project.name === "mobile") {
    await page.getByRole("navigation", { name: "Проєкти" })
      .getByRole("button", { name: /Дошка з нотатками/ })
      .click();
  } else {
    const scene = page.getByRole("group", {
      name: "Ізометрична кімната готелю з інтерактивними предметами",
    });
    await scene.getByRole("button", { name: "Дошка з нотатками" }).click();
  }
  await expect(page.getByRole("dialog", { name: "Справи" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Справи" })).toBeHidden();
});
