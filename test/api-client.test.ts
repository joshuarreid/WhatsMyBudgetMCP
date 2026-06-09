import test from "node:test";
import assert from "node:assert/strict";
import { ApiError, WmbApiClient } from "../src/api/client.js";

test("WmbApiClient sends bearer auth and query params", async () => {
  const originalFetch = globalThis.fetch;
  const observed: { url?: string; auth?: string; txId?: string } = {};

  globalThis.fetch = (async (input, init) => {
    observed.url = String(input);
    observed.auth = (init?.headers as Record<string, string>).Authorization;
    observed.txId = (init?.headers as Record<string, string>)["X-Transaction-ID"];

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Transaction-ID": "resp-1" },
    });
  }) as typeof fetch;

  try {
    const client = new WmbApiClient("https://api.example.com", "abc-token", 2000);
    const result = await client.get<{ ok: boolean }>("/range/overview", { startDate: "2026-01-01" }, "req-1");

    assert.equal(observed.url, "https://api.example.com/api/analytics/range/overview?startDate=2026-01-01");
    assert.equal(observed.auth, "Bearer abc-token");
    assert.equal(observed.txId, "req-1");
    assert.equal(result.transactionId, "resp-1");
    assert.equal(result.data.ok, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("WmbApiClient omits bearer auth when token is not set", async () => {
  const originalFetch = globalThis.fetch;
  const observed: { auth?: string } = {};

  globalThis.fetch = (async (_input, init) => {
    observed.auth = (init?.headers as Record<string, string>).Authorization;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  try {
    const client = new WmbApiClient("https://api.example.com", undefined, 2000);
    await client.get<{ ok: boolean }>("/periods");
    assert.equal(observed.auth, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("WmbApiClient throws ApiError on non-2xx response", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    return new Response("bad request", { status: 400, statusText: "Bad Request" });
  }) as typeof fetch;

  try {
    const client = new WmbApiClient("https://api.example.com", "abc-token", 2000);
    await assert.rejects(client.get("/periods"), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 400);
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

