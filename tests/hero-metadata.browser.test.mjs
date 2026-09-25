import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test("hero metadata values stay inside their bordered panel across viewport widths", { timeout: 60000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [1440, 1280, 1200, 1024, 900, 768, 430, 390, 360, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    await page.evaluate(() => document.fonts.ready);

    const measurements = await page.locator("aside").first().evaluate((aside) => {
      const panel = aside.querySelector(".border");
      const panelRight = panel.getBoundingClientRect().right;
      return [...panel.children].map((row) => {
        const value = row.lastElementChild;
        const bounds = value.getBoundingClientRect();
        return {
          label: row.children[1].textContent,
          valueRight: bounds.right,
          valueHeight: bounds.height,
          lineHeight: parseFloat(getComputedStyle(value).lineHeight),
          textOverflow: getComputedStyle(value).textOverflow,
          panelRight,
        };
      });
    });

    for (const { label, valueRight, valueHeight, lineHeight, textOverflow, panelRight } of measurements) {
      assert.ok(valueRight <= panelRight - 10, `${label} box overflows metadata panel at ${width}px`);
      assert.ok(valueHeight <= lineHeight + 1, `${label} wraps to another line at ${width}px`);
      assert.equal(textOverflow, "ellipsis", `${label} should show an ellipsis when truncated at ${width}px`);
    }
    await page.close();
  }
});

test("hero metadata row text is compact on desktop and mobile", { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [1280, 390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(process.env.THEME_TEST_URL ?? "http://localhost:3000/");
    const sizes = await page.locator("aside .border").first().evaluate((panel) =>
      [...panel.children].map((row) => ({
        label: parseFloat(getComputedStyle(row.children[1]).fontSize),
        value: parseFloat(getComputedStyle(row.lastElementChild).fontSize),
      })),
    );
    for (const { label, value } of sizes) {
      assert.ok(label <= (width < 640 ? 10 : 11), `metadata label too large at ${width}px`);
      assert.ok(value <= (width < 640 ? 11 : 12), `metadata value too large at ${width}px`);
    }
    await page.close();
  }
});
