import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test("footer stays unrendered at mobile and desktop widths", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [360, 390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    assert.equal(await page.locator("footer").count(), 0, `footer rendered at ${width}px`);
    await page.close();
  }
});
