export type AuthHeaders = Record<string, string>;

export class JwtAuthService {
  private token: string | null = null;
  private expiresAt: number = 0;

  /**
   * @param baseUrl     Backend base URL (no trailing slash)
   * @param password    Plain-text password sent to POST /auth/login
   * @param timeoutMs   Fetch timeout for the login request
   * @param bufferMs    How early (ms before expiry) to proactively refresh (default 60s)
   */
  constructor(
    private readonly baseUrl: string,
    private readonly password: string,
    private readonly timeoutMs: number,
    private readonly bufferMs: number = 60_000
  ) {}

  async getAuthHeaders(txId?: string): Promise<AuthHeaders> {
    const token = await this.getToken();
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(txId ? { "X-Transaction-ID": txId } : {}),
    };
  }

  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.expiresAt - this.bufferMs) {
      return this.token;
    }
    return this.login();
  }

  /** Force-invalidate the cached token (call after a 401 response). */
  invalidate(): void {
    this.token = null;
    this.expiresAt = 0;
  }

  private async login(): Promise<string> {
    const url = `${this.baseUrl}/auth/login`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ password: this.password }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        throw new Error(
          `Login rate limited by WhatsMyBudget API. Retry after ${retryAfter ?? "unknown"} seconds.`
        );
      }

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`WhatsMyBudget login failed (${response.status}): ${body}`);
      }

      const json = (await response.json()) as {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
      };

      if (!json.accessToken) {
        throw new Error("WhatsMyBudget login response missing accessToken");
      }

      this.token = json.accessToken;
      this.expiresAt = Date.now() + json.expiresIn * 1000;
      return this.token;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Login request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}

