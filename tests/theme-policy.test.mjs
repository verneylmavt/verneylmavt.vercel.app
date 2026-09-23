import assert from "node:assert/strict";
import { test } from "node:test";

const policy = await import("../src/lib/theme-policy.ts").catch(() => ({}));

test("missing, legacy, and invalid preferences default to dark", () => {
  for (const stored of [null, "system", "invalid", ""]) {
    assert.equal(policy.normalizeTheme?.(stored), "dark");
  }
});

test("explicit light and dark preferences are preserved", () => {
  assert.equal(policy.normalizeTheme?.("light"), "light");
  assert.equal(policy.normalizeTheme?.("dark"), "dark");
});

test("theme cycle switches only between dark and light", () => {
  assert.equal(policy.nextTheme?.("dark"), "light");
  assert.equal(policy.nextTheme?.("light"), "dark");
});
