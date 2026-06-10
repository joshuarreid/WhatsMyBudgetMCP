import { JwtAuthService } from "./jwtAuth.js";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export type ApiResult<T> = {
  data: T;
  transactionId: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
    readonly transactionId: string | null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Either a JwtAuthService (v2, dynamic JWT) or a static bearer token string (legacy). */
export type AuthProvider = JwtAuthService | string | undefined;

export class WmbApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly auth: AuthProvider,
    private readonly timeoutMs: number,
    /** API path prefix. Default: /api/analytics */
    private readonly apiPathPrefix: string = "/api/analytics"
  ) {}

  async get<T>(path: string, query?: QueryParams, txId?: string): Promise<ApiResult<T>> {
    return this.doGet<T>(path, query, txId, false);
  }

  private async doGet<T>(
    path: string,
    query: QueryParams | undefined,
    txId: string | undefined,
    isRetry: boolean
  ): Promise<ApiResult<T>> {
    const url = new URL(`${this.baseUrl}${this.apiPathPrefix}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers = await this.buildHeaders(txId);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      const transactionId = response.headers.get("x-transaction-id");

      // On 401, invalidate the cached JWT and retry once
      if (response.status === 401 && !isRetry && this.auth instanceof JwtAuthService) {
        this.auth.invalidate();
        return this.doGet<T>(path, query, txId, true);
      }

      if (!response.ok) {
        const body = await safeReadText(response);
        throw new ApiError(
          `WhatsMyBudget API request failed (${response.status} ${response.statusText})`,
          response.status,
          body,
          transactionId
        );
      }

      return { data: (await response.json()) as T, transactionId };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  private async buildHeaders(txId?: string): Promise<Record<string, string>> {
    if (this.auth instanceof JwtAuthService) {
      return this.auth.getAuthHeaders(txId);
    }

    // Static bearer token (legacy / local dev)
    return {
      Accept: "application/json",
      ...(this.auth ? { Authorization: `Bearer ${this.auth}` } : {}),
      ...(txId ? { "X-Transaction-ID": txId } : {}),
    };
  }
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
