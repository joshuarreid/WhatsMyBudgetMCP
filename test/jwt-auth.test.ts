import test from "node:test";
import assert from "node:assert/strict";
import { JwtAuthService } from "../src/services/jwtAuth.js";

function makeFetch(responses: Array<{ status: number; body: unknown; headers?: Record<string, string> }>) {
  let call = 0;
  return (async (_input: unknown, _init: unknown) => {
    const r = responses[call % responses.length];
    call++;
    return new Response(JSON.stringify(r.body), {
      status: r.status,
      headers: { "Content-Type": "application/json", ...(r.headers ?? {}) },
    });
  }) as typeof fetch;
}

test("JwtAuthService returns a token after successful login", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = makeFetch([
    { status: 200, body: { accessToken: "jwt-abc", tokenType: "Bearer", expiresIn: 86400 } },
  ]);

  try {
    const svc = new JwtAuthService("https://api.example.com", "secret", 5000);
    const token = await svc.getToken();
    assert.equal(token, "jwt-abc");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("JwtAuthService caches token on second call", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response(
      JSON.stringify({ accessToken: "jwt-cached", tokenType: "Bearer", expiresIn: 86400 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  try {
    const svc = new JwtAuthService("https://api.example.com", "secret", 5000);
    await svc.getToken();
    await svc.getToken();
    assert.equal(calls, 1, "should only login once when token is still valid");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("JwtAuthService re-fetches after invalidate()", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response(
      JSON.stringify({ accessToken: `jwt-${calls}`, tokenType: "Bearer", expiresIn: 86400 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  try {
    const svc = new JwtAuthService("https://api.example.com", "secret", 5000);
    const t1 = await svc.getToken();
    svc.invalidate();
    const t2 = await svc.getToken();
    assert.equal(calls, 2);
    assert.notEqual(t1, t2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("JwtAuthService throws on 429 rate limit", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = makeFetch([
    { status: 429, body: {}, headers: { "Retry-After": "30" } },
  ]);

  try {
    const svc = new JwtAuthService("https://api.example.com", "secret", 5000);
    await assert.rejects(
      () => svc.getToken(),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes("rate limited"));
        assert.ok(err.message.includes("30"));
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("JwtAuthService throws on non-200 login response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = makeFetch([{ status: 401, body: { message: "bad password" } }]);

  try {
    const svc = new JwtAuthService("https://api.example.com", "wrong", 5000);
    await assert.rejects(
      () => svc.getToken(),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes("401"));
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("JwtAuthService getAuthHeaders includes Authorization and optional txId", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = makeFetch([
    { status: 200, body: { accessToken: "jwt-hdr", tokenType: "Bearer", expiresIn: 86400 } },
  ]);

  try {
    const svc = new JwtAuthService("https://api.example.com", "secret", 5000);
    const headers = await svc.getAuthHeaders("tx-999");
    assert.equal(headers.Authorization, "Bearer jwt-hdr");
    assert.equal(headers["X-Transaction-ID"], "tx-999");
    assert.equal(headers.Accept, "application/json");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

