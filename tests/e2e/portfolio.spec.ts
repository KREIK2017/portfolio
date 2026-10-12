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
      name: "Ізометрична кімната-майстерня з інтерактивними предметами",
    });
    await scene.getByRole("button", { name: "Дошка з нотатками" }).click();
  }
  await expect(page.getByRole("dialog", { name: "Справи" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Справи" })).toBeHidden();
});

test("room lamp can be switched off and back on", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kreik-mode", "room"));
  await page.goto("/room/");
  const skip = page.getByRole("button", { name: /пропустити/i });
  if (await skip.isVisible()) await skip.click();

  const experience = page.locator(".room-experience");
  const lamp = page.getByRole("button", { name: "Лампа: вимкнути" });
  await expect(experience).toHaveAttribute("data-lamp", "on");
  await lamp.click();
  await expect(experience).toHaveAttribute("data-lamp", "off");
  await page.getByRole("button", { name: "Лампа: увімкнути" }).click();
  await expect(experience).toHaveAttribute("data-lamp", "on");
});

test("home URL stays on the classic portfolio after visiting the room", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kreik-mode", "room"));
  await page.goto("/room/");
  await page.goto("/");

  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.locator(".bg-rs-paper h1")).toBeVisible();
  await page.waitForTimeout(300);
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("moving the mouse does not shift the room", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "No mouse on a touch viewport");
  await page.goto("/room/");
  const skip = page.getByRole("button", { name: /пропустити/i });
  if (await skip.isVisible()) await skip.click();

  const scene = page.locator(".room-art");
  const transform = () => scene.evaluate((element) => getComputedStyle(element).transform);
  const initial = await transform();
  const box = await scene.boundingBox();
  if (!box) throw new Error("Room scene is not visible");
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.2);
  await page.waitForTimeout(550);
  expect(await transform()).toBe(initial);
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.8);
  await page.waitForTimeout(550);
  expect(await transform()).toBe(initial);
});

test("each case opens after a physical 2d6 check", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/room/");
  await page.locator(".intro-screen")
    .getByRole("button", { name: /пропустити|розплющити очі/i }).click();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("navigation", { name: "Проєкти" })
      .getByRole("button", { name: /Дошка з нотатками/ }).click();
  } else {
    await page.getByRole("group", { name: "Ізометрична кімната-майстерня з інтерактивними предметами" })
      .getByRole("button", { name: "Дошка з нотатками" }).click();
  }

  await page.getByRole("dialog", { name: "Справи" })
    .getByRole("button", { name: /CodeUnity/ }).click();
  const dice = page.getByRole("dialog", { name: "Перевірка навички" });
  await expect(dice.getByRole("heading", { name: "CodeUnity" })).toBeVisible();
  await expect(dice.locator("canvas")).toBeVisible();
  await expect(dice.getByRole("button", { name: "Відкрити справу" })).toHaveCount(0);

  await dice.getByRole("button", { name: "Кинути кубики" }).click();
  const result = dice.getByRole("status");
  await expect(result).toContainText(/(Успіх|Провал) · [1-6] \+ [1-6] = (?:[2-9]|1[0-2])/);
  const text = await result.textContent();
  const match = text?.match(/(\d) \+ (\d) = (\d+)/);
  expect(match).toBeTruthy();
  const first = Number(match?.[1]);
  const second = Number(match?.[2]);
  const total = Number(match?.[3]);
  expect(first + second).toBe(total);
  expect(text?.startsWith(total >= 7 ? "Успіх" : "Провал")).toBe(true);

  await dice.getByRole("button", { name: "Відкрити справу" }).click();
  await expect(dice).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Справи" }).getByRole("heading", { name: "CodeUnity" })).toBeVisible();
});

test("suitcase objects can be inspected and repositioned", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/room/");
  await page.locator(".intro-screen")
    .getByRole("button", { name: /пропустити|розплющити очі/i }).click();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("navigation", { name: "Проєкти" })
      .getByRole("button", { name: "Валіза" }).click();
  } else {
    await page.getByRole("group", { name: "Ізометрична кімната-майстерня з інтерактивними предметами" })
      .getByRole("button", { name: "Валіза" }).click();
  }

  const suitcase = page.getByRole("dialog", { name: "Валіза" });
  await expect(suitcase.getByRole("group", { name: "Відкрита валіза з предметами" })).toBeVisible();

  const passport = suitcase.locator('[data-suitcase-item="passport"]');
  const before = await passport.evaluate((element) => (element as HTMLElement).style.left);
  await passport.focus();
  await page.keyboard.press("ArrowRight");
  const after = await passport.evaluate((element) => (element as HTMLElement).style.left);
  expect(after).not.toBe(before);

  await suitcase.locator('[data-suitcase-item="photo"]').click();
  const photo = page.getByRole("dialog", { name: "Фотокартка" });
  await expect(photo.getByRole("img", { name: "Максим Мичко" })).toBeVisible();
  await photo.getByRole("button", { name: "Перевернути фотокартку" }).click();
  await expect(photo.getByRole("button", { name: "Повернути фотокартку лицем" })).toBeVisible();
  await photo.getByRole("button", { name: "Повернути фотокартку лицем" }).click();
  await photo.getByRole("button", { name: /Піти геть/ }).click();

  await suitcase.locator('[data-suitcase-item="cv"]').click();
  const cv = page.getByRole("dialog", { name: "Розгорнутий CV" });
  await expect(cv.getByRole("img", { name: "Перша сторінка CV Максима Мичка" })).toBeVisible();
  await expect(cv.getByRole("link", { name: /Завантажити/ })).toHaveAttribute("href", "/cv.pdf");
});
