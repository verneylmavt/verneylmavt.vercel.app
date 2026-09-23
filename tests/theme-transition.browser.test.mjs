import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test("the latest theme request wins even when an older snapshot callback runs late", { timeout: 30000 }, async (t) => {
  const url = process.env.THEME_TEST_URL ?? "http://localhost:3000/";
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(4000) });
  } catch {
    assert.fail(`Expected an already-running v3 server at ${url}`);
  }
  assert.equal(response.status, 200, `Expected an already-running v3 server at ${url}`);

  let browser;
  t.after(async () => {
    await browser?.close();
  });

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.__themeTransitions = [];
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value(update) {
        let resolveFinished;
        const finished = new Promise((resolve) => { resolveFinished = resolve; });
        const record = {
          update,
          finish: () => resolveFinished(),
          skipped: false,
        };
        window.__themeTransitions.push(record);
        return {
          finished,
          skipTransition() {
            record.skipped = true;
            resolveFinished();
          },
        };
      },
    });
  });
  await page.goto(url);
  const button = (name) => page.getByRole("button", { name: `Theme: ${name}. Click to cycle.` });

  // Cancel before the first callback runs. A late callback must not reapply light.
  await button("dark").press("Enter");
  assert.equal(await page.evaluate(() => window.__themeTransitions.length), 1);
  await button("dark").press("Enter");
  await page.evaluate(() => window.__themeTransitions[0].update());
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-theme-transition"));
  assert.deepEqual(await page.evaluate(() => ({
    applied: document.documentElement.getAttribute("data-theme"),
    saved: localStorage.getItem("v3-theme"),
    label: document.querySelector('[aria-label^="Theme:"]')?.getAttribute("aria-label"),
    line: !!document.querySelector(".theme-diff-line"),
    skipped: window.__themeTransitions[0].skipped,
  })), {
    applied: "dark", saved: "dark", label: "Theme: dark. Click to cycle.", line: false, skipped: true,
  });

  // Cancel after light is applied. The old completion must not clear the new reveal.
  await button("dark").press("Enter");
  await page.evaluate(() => window.__themeTransitions[1].update());
  await button("light").press("Enter");
  await page.evaluate(() => window.__themeTransitions[2].update());
  assert.deepEqual(await page.evaluate(() => ({
    applied: document.documentElement.getAttribute("data-theme"),
    saved: localStorage.getItem("v3-theme"),
    line: !!document.querySelector(".theme-diff-line"),
    transition: document.documentElement.getAttribute("data-theme-transition"),
  })), { applied: "dark", saved: "dark", line: true, transition: "diff" });
  await page.getByRole("button", { name: "Mode: default. Click to cycle." }).press("Enter");
  await page.waitForFunction(() => document.documentElement.getAttribute("data-diag") === "on");
  assert.equal(await page.locator(".theme-diff-label span").first().evaluate((el) => getComputedStyle(el).outlineStyle), "none");
  await page.evaluate(() => window.__themeTransitions[2].finish());
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-theme-transition"));
  assert.equal(await page.locator(".theme-diff-line").count(), 0);

  // A crash overlay starting mid-reveal must immediately end the top-layer snapshot.
  await button("dark").press("Enter");
  await page.evaluate(() => window.__themeTransitions[3].update());
  for (const key of ["c", "r", "a", "s", "h"]) await page.keyboard.press(key);
  await page.locator("[data-bsod-active]").waitFor({ state: "visible" });
  assert.equal(await page.evaluate(() => window.__themeTransitions[3].skipped), true);
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-theme-transition"));
  assert.equal(await page.locator(".theme-diff-line").count(), 0);

  const reducedPage = await browser.newPage({ reducedMotion: "reduce", colorScheme: "light" });
  await reducedPage.goto(url);
  await reducedPage.waitForLoadState("networkidle");
  await reducedPage.getByRole("button", { name: "Theme: dark. Click to cycle." }).click();
  await reducedPage.waitForFunction(() => !document.documentElement.hasAttribute("data-theme-transition"));
  assert.deepEqual(await reducedPage.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    line: !!document.querySelector(".theme-diff-line"),
  })), { theme: "light", line: false });
  await reducedPage.reload();
  assert.equal(await reducedPage.locator(".theme-diff-line").count(), 0);
  assert.equal(await reducedPage.locator("html").getAttribute("data-theme"), "light");

  const noApiPage = await browser.newPage();
  await noApiPage.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: undefined });
  });
  await noApiPage.goto(url);
  await noApiPage.waitForLoadState("networkidle");
  await noApiPage.getByRole("button", { name: "Theme: dark. Click to cycle." }).click();
  await noApiPage.waitForFunction(() => !document.documentElement.hasAttribute("data-theme-transition"));
  assert.deepEqual(await noApiPage.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    line: !!document.querySelector(".theme-diff-line"),
  })), { theme: "light", line: false });
});
