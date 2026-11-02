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

  await expect(cards).toHaveCount(3);
  await expect(cards.locator("h3")).toHaveText([
    "CodeUnity",
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

test("project cases stay readable in one column on phones", async ({ page }) => {
  const cards = page.locator("#work li").filter({ has: page.locator("h3") });

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 800 });
    const boxes = await Promise.all([0, 1, 2].map((index) => cards.nth(index).boundingBox()));

    expect(boxes.every(Boolean)).toBe(true);
    expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.y + boxes[0]!.height);
    expect(boxes[2]!.y).toBeGreaterThanOrEqual(boxes[1]!.y + boxes[1]!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test("folder scroll becomes a selectable carousel after the first pass", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") test.skip();

  const work = page.locator("#work");
  const folders = work.locator("[data-folder]");
  const scrollRegion = work.locator("[class*='scrollRegion']");
  await work.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const region = document.querySelector<HTMLElement>("#work [class*='scrollRegion']")!;
    window.scrollTo(0, region.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 5);
  });

  await expect(scrollRegion).toHaveAttribute("data-carousel", "true");
  await expect(folders.nth(2)).toHaveAttribute("data-active", "true");
  const compactHeight = await scrollRegion.evaluate((element) => element.getBoundingClientRect().height);
  expect(compactHeight).toBeLessThan(2000);

  await work.getByRole("navigation", { name: "Вибрати справу" })
    .getByRole("button", { name: /CodeUnity/ }).click();
  await expect(folders.first()).toHaveAttribute("data-active", "true");
  await expect(folders.nth(2)).toHaveAttribute("inert", "");
  await expect.poll(() => folders.first().evaluate((element) =>
    Number.parseFloat(element.style.getPropertyValue("--sheet-opacity")))).toBe(1);

  await work.getByRole("button", { name: "Наступна справа" }).click();
  await expect(folders.nth(1)).toHaveAttribute("data-active", "true");

  await page.evaluate(() => window.scrollBy(0, -window.innerHeight));
  await expect(scrollRegion).toHaveAttribute("data-carousel", "true");
});

test("finishing folder scroll keeps the next section in view", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") test.skip();
  await page.setViewportSize({ width: 1152, height: 720 });

  const region = page.locator("#work [class*='scrollRegion']");
  await page.evaluate(() => {
    const element = document.querySelector<HTMLElement>("#work [class*='scrollRegion']")!;
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + element.offsetHeight - window.innerHeight * 1.2);
  });
  await page.waitForTimeout(250);
  await page.mouse.wheel(0, 700);
  await expect(region).toHaveAttribute("data-carousel", "true");
  await page.waitForTimeout(2500);

  const position = await page.evaluate(() => {
    const work = document.querySelector("#work")!;
    return { nextTop: work.nextElementSibling!.getBoundingClientRect().top, scrollY: window.scrollY };
  });
  expect(position.nextTop).toBeGreaterThan(-720);
  expect(position.nextTop).toBeLessThan(720);
});

test("folder animation fits zoomed laptop viewports", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") test.skip();

  for (const { width, height } of [
    { width: 1152, height: 720 }, // 1440 × 900 at 125% browser zoom
    { width: 1093, height: 614 }, // 1366 × 768 at 125% browser zoom
    { width: 1024, height: 576 }, // 1280 × 720 at 125% browser zoom
  ]) {
    await page.setViewportSize({ width, height });
    const region = page.locator("#work [class*='scrollRegion']");
    await expect(region).toBeVisible();
    await page.evaluate(() => {
      const element = document.querySelector<HTMLElement>("#work [class*='scrollRegion']")!;
      window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.6);
    });
    await expect.poll(() => page.locator("#work [data-folder='0']").evaluate((element) =>
      Number.parseFloat((element as HTMLElement).style.getPropertyValue("--case-opacity")))).toBe(1);
    const layout = await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>("#work [class*='stickyStage']")!;
      const desk = document.querySelector<HTMLElement>("#work [class*='folderDesk']")!;
      const nav = document.querySelector<HTMLElement>("#work nav[aria-label='Вибрати справу']")!;
      return { stage: stage.getBoundingClientRect().toJSON(), desk: desk.getBoundingClientRect().toJSON(), nav: nav.getBoundingClientRect().toJSON(), pageWidth: document.documentElement.scrollWidth };
    });
    expect(layout.desk.height).toBeGreaterThan(250);
    expect(layout.nav.bottom).toBeLessThanOrEqual(height + 1);
    expect(layout.pageWidth).toBeLessThanOrEqual(width);
  }
});

test("reduced motion keeps the static project list", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") test.skip();
  await page.setViewportSize({ width: 1152, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#work [class*='scrollRegion']")).toBeHidden();
  await expect(page.locator("#work [class*='staticCases']")).toBeVisible();
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

test("small screens show room objects before the scene without horizontal overflow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/room/");
  await page.locator(".intro-screen")
    .getByRole("button", { name: /пропустити|розплющити очі/i }).click();

  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 700 });

    const navigation = page.getByRole("navigation", { name: "Проєкти" });
    const room = page.getByRole("group", { name: "Ізометрична кімната-майстерня з інтерактивними предметами" });
    await expect(navigation.getByRole("button")).toHaveCount(5);
    expect((await navigation.boundingBox())!.y).toBeLessThan((await room.boundingBox())!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    await navigation.getByRole("button", { name: /Дошка з нотатками/ }).click();
    const cases = page.getByRole("dialog", { name: "Справи" });
    await cases.getByRole("button", { name: /CodeUnity/ }).click();
    const dice = page.getByRole("dialog", { name: "Перевірка навички" });
    await expect(dice.getByRole("button", { name: "Кинути кубики" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await dice.locator(".dice-overlay__close").click();
    await cases.getByRole("button", { name: /Піти геть/ }).click();
  }
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

test("animated dice roll settles and reports a real 2d6 total", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Animation is checked on desktop; mobile uses the same physics scene");
  await page.goto("/room/");
  await page.locator(".intro-screen")
    .getByRole("button", { name: /пропустити|розплющити очі/i }).click();
  await page.getByRole("group", { name: "Ізометрична кімната-майстерня з інтерактивними предметами" })
    .getByRole("button", { name: "Дошка з нотатками" }).click();
  await page.getByRole("dialog", { name: "Справи" })
    .getByRole("button", { name: /CodeUnity/ }).click();

  const dice = page.getByRole("dialog", { name: "Перевірка навички" });
  await dice.getByRole("button", { name: "Кинути кубики" }).click();
  await expect(dice.getByText("Кубики падають…")).toBeVisible();
  await expect(dice.getByRole("status")).toContainText(/(?:Успіх|Провал) · [1-6] \+ [1-6] = (?:[2-9]|1[0-2])/);
  await expect(dice.getByRole("button", { name: "Відкрити справу" })).toBeEnabled();
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
