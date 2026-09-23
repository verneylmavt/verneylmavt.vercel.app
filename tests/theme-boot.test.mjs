import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const bootScript = layout.match(/const themeBootScript = `([^`]*)`;/)?.[1];
assert.ok(bootScript, "layout must include a pre-paint theme script");

function bootTheme(stored, osDark) {
  let applied;
  runInNewContext(bootScript, {
    localStorage: { getItem: () => stored },
    matchMedia: () => ({ matches: osDark }),
    document: {
      documentElement: {
        setAttribute: (name, value) => {
          assert.equal(name, "data-theme");
          applied = value;
        },
      },
    },
  });
  return applied;
}

test("first paint is dark without a choice under either OS preference", () => {
  assert.equal(bootTheme(null, false), "dark");
  assert.equal(bootTheme(null, true), "dark");
});

test("saved light wins over either OS preference", () => {
  assert.equal(bootTheme("light", false), "light");
  assert.equal(bootTheme("light", true), "light");
});

test("legacy system and invalid values boot dark under either OS preference", () => {
  for (const value of ["system", "invalid"]) {
    assert.equal(bootTheme(value, false), "dark");
    assert.equal(bootTheme(value, true), "dark");
  }
});

test("unavailable storage falls back to dark", () => {
  let applied;
  runInNewContext(bootScript, {
    localStorage: { getItem: () => { throw new Error("blocked"); } },
    document: {
      documentElement: {
        setAttribute: (_name, value) => { applied = value; },
      },
    },
  });
  assert.equal(applied, "dark");
});
