import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test("mobile menu links use compact text and shorter rows", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    await page.waitForLoadState("networkidle");
    await page.locator("header").first().getByRole("button", { name: "Open menu" }).click();
    const menu = page.locator("#mobile-nav");
    const links = menu.getByRole("link");
    assert.equal(await links.count(), 8);
    const first = links.first();
    assert.ok(parseFloat(await first.evaluate((el) => getComputedStyle(el).fontSize)) <= 12);
    const row = await first.boundingBox();
    const box = await menu.boundingBox();
    assert.ok(row && row.height <= 36, `row too tall at ${width}px`);
    assert.ok(box && box.height <= 320, `menu too tall at ${width}px`);
    await page.close();
  }
});

test("mobile menu shows indented code lines and a red cursor until opened", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    await page.waitForLoadState("networkidle");
    const header = page.locator("header").first();

    for (const theme of ["dark", "light"]) {
      if (theme === "light") {
        await header.getByRole("button", { name: "Theme: dark. Click to cycle." }).click();
        await page.waitForFunction(() => document.documentElement.getAttribute("data-theme") === "light");
      }
      const menu = header.getByRole("button", { name: "Open menu" });
      assert.equal((await menu.innerText()).trim(), "");
      assert.equal(await menu.locator("[data-code-line]").count(), 3);
      assert.equal(await menu.locator("[data-code-cursor]").count(), 1);
      const colors = await menu.evaluate((el) => ({
        stroke: getComputedStyle(el.querySelector("[data-code-line]")).backgroundColor,
        foreground: getComputedStyle(document.body).color,
        cursor: getComputedStyle(el.querySelector("[data-code-cursor]")).backgroundColor,
      }));
      assert.equal(colors.stroke, colors.foreground);
      assert.notEqual(colors.cursor, colors.foreground);
    }

    await header.getByRole("button", { name: "Open menu" }).click();
    const close = header.getByRole("button", { name: "Close menu" });
    assert.equal(await close.getAttribute("aria-expanded"), "true");
    assert.equal((await close.innerText()).trim(), "×");
    assert.equal(await close.locator("[data-code-line]").count(), 0);
    await close.click();
    assert.equal(await header.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");
    await page.close();
  }
});

test("mobile header owns the mode and theme controls without a bottom bar", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    await page.waitForLoadState("networkidle");
    const header = page.locator("header").first();
    const statusBar = page.getByRole("status");

    assert.equal(await statusBar.isVisible(), false, `bottom bar visible at ${width}px`);
    const modeButton = header.getByRole("button", { name: "Mode: default. Click to cycle." });
    const themeButton = header.getByRole("button", { name: "Theme: dark. Click to cycle." });
    assert.equal(await modeButton.isVisible(), true);
    assert.equal(await themeButton.isVisible(), true);
    assert.equal((await modeButton.innerText()).trim(), "default");
    assert.equal((await themeButton.innerText()).trim(), "dark");
    const brand = header.getByRole("link", { name: "Scroll to top" });
    const menu = header.getByRole("button", { name: "Open menu" });
    const [brandBounds, modeBoundsInitial, themeBounds, menuBounds, headerBounds] = await Promise.all([
      brand.boundingBox(), modeButton.boundingBox(), themeButton.boundingBox(), menu.boundingBox(), header.boundingBox(),
    ]);
    assert.ok(brandBounds && modeBoundsInitial && themeBounds && menuBounds && headerBounds);
    assert.ok(headerBounds.height <= 64, `header has an extra row at ${width}px`);
    assert.ok(Math.abs((menuBounds.x + menuBounds.width / 2) - (headerBounds.x + headerBounds.width / 2)) <= 1, `menu is not centered at ${width}px`);
    assert.ok(brandBounds.x + brandBounds.width < menuBounds.x);
    assert.ok(menuBounds.x + menuBounds.width < modeBoundsInitial.x);
    assert.ok(modeBoundsInitial.x + modeBoundsInitial.width < themeBounds.x);
    assert.ok(Math.abs(brandBounds.y - modeBoundsInitial.y) < 15);
    assert.ok(parseFloat(await brand.evaluate((el) => getComputedStyle(el).fontSize)) <= 11);
    assert.ok(parseFloat(await modeButton.evaluate((el) => getComputedStyle(el).fontSize)) <= 10);
    assert.ok(parseFloat(await themeButton.evaluate((el) => getComputedStyle(el).fontSize)) <= 10);
    assert.equal(await header.getByText("JKT").isVisible(), false);
    await header.getByRole("button", { name: "Mode: default. Click to cycle." }).click();
    await header.getByRole("button", { name: "Mode: diagnostic. Click to cycle." }).waitFor();
    assert.equal(await header.getByRole("button", { name: "Mode: diagnostic. Click to cycle." }).isVisible(), true);
    await header.getByRole("button", { name: "Theme: dark. Click to cycle." }).click();
    await page.waitForFunction(() => document.documentElement.getAttribute("data-theme") === "light");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    await header.getByRole("button", { name: "Mode: diagnostic. Click to cycle." }).click();
    const longestMode = header.getByRole("button", { name: "Mode: glitch storm. Click to cycle." });
    await longestMode.waitFor();
    const modeBounds = await longestMode.boundingBox();
    assert.ok(modeBounds && modeBounds.x >= 0 && modeBounds.x + modeBounds.width <= width);
    const menuBoundsLongest = await menu.boundingBox();
    assert.ok(menuBoundsLongest && modeBounds && menuBoundsLongest.x + menuBoundsLongest.width <= modeBounds.x);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.close();
  }
});

test("desktop keeps its bottom status bar", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
  assert.equal(await page.getByRole("status").isVisible(), true);
  assert.equal(await page.locator("header").getByRole("button", { name: /Mode:/ }).count(), 0);
});
