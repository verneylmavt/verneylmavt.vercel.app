import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test("hero bottom telemetry replaces the build label with a distinct line chart", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [1280, 390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: width === 360 ? 800 : 844 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    const bottom = page.locator(".hero-telemetry-bottom");
    assert.doesNotMatch(await bottom.innerText(), /BUILD \/ V3/);
    assert.match(await bottom.innerText(), /ROUTE \/ HOME/);
    if (width >= 640) {
      const chart = bottom.locator(".hero-telemetry-sparkline");
      assert.equal(await chart.isVisible(), true);
      assert.equal(await chart.locator("polyline").count(), 1);
      assert.equal(await bottom.locator(".hero-telemetry-bars").count(), 0);
    }
    await page.close();
  }
});
