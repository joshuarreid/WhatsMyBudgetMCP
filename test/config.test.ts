import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("loadConfig applies defaults and normalizes base URL", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com///",
  });

  assert.equal(config.baseUrl, "https://example.com");
  assert.equal(config.bearerToken, undefined);
  assert.equal(config.timeoutMs, 15000);
});

test("loadConfig respects timeout env", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com",
    WMB_TIMEOUT_MS: "9000",
  });

  assert.equal(config.timeoutMs, 9000);
});

test("loadConfig keeps bearer token when provided", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com",
    WMB_BEARER_TOKEN: "token-123",
  });

  assert.equal(config.bearerToken, "token-123");
});

