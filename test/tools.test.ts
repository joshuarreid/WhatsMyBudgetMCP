import test from "node:test";
import assert from "node:assert/strict";
import { toolCount } from "../src/tools.js";

test("tool registry includes expected endpoint coverage", () => {
  assert.ok(toolCount >= 20);
});

