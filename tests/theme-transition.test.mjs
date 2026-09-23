import assert from "node:assert/strict";
import { test } from "node:test";

const { selectThemeEffect } = await import("../src/lib/theme-transition.ts").catch(() => ({}));

const ready = {
  activeEffect: "code-diff",
  supportsViewTransition: true,
  reducedMotion: false,
  bsodVisible: false,
};

test("an explicit change uses the code-diff reveal in either direction", () => {
  assert.equal(selectThemeEffect?.("dark", "light", ready), "code-diff");
  assert.equal(selectThemeEffect?.("light", "dark", ready), "code-diff");
});

test("an already-selected theme never replays the effect", () => {
  assert.equal(selectThemeEffect?.("dark", "dark", ready), "none");
});

test("reduced motion, absent API, and BSOD switch without a document effect", () => {
  for (const unavailable of [
    { reducedMotion: true },
    { supportsViewTransition: false },
    { bsodVisible: true },
  ]) {
    assert.equal(selectThemeEffect?.("dark", "light", { ...ready, ...unavailable }), "none");
  }
});

test("compile pass remains available only when internally selected", () => {
  assert.equal(
    selectThemeEffect?.("dark", "light", { ...ready, activeEffect: "compile-pass" }),
    "compile-pass",
  );
});
