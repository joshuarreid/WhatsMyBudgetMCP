import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("loadConfig applies defaults and normalizes base URL", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com///",
  });

  assert.equal(config.baseUrl, "https://example.com");
  assert.equal(config.bearerToken, undefined);
  assert.equal(config.password, undefined);
  assert.equal(config.apiPathPrefix, "/api/analytics");
  assert.deepEqual(config.runtimeTransport, { type: "stdio" });
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
  assert.equal(config.password, undefined);
});

test("loadConfig captures WMB_PASSWORD for JWT auth", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com",
    WMB_PASSWORD: "supersecret",
  });

  assert.equal(config.password, "supersecret");
  assert.equal(config.bearerToken, undefined);
});

test("loadConfig respects WMB_API_PATH_PREFIX override", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com",
    WMB_API_PATH_PREFIX: "/api/v2/analytics",
  });

  assert.equal(config.apiPathPrefix, "/api/v2/analytics");
});

test("loadConfig switches to httpStream when PORT is present", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com",
    PORT: "8080",
  });

  assert.deepEqual(config.runtimeTransport, {
    type: "httpStream",
    host: "0.0.0.0",
    port: 8080,
  });
});

test("loadConfig allows explicit stdio transport override", () => {
  const config = loadConfig({
    WMB_API_BASE_URL: "https://example.com",
    PORT: "8080",
    WMB_TRANSPORT: "stdio",
  });

  assert.deepEqual(config.runtimeTransport, { type: "stdio" });
});

