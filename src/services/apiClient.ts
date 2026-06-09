import { buildAuthHeaders } from "./auth.js";

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

export class WmbApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly bearerToken: string | undefined,
    private readonly timeoutMs: number
  ) {}

  async get<T>(path: string, query?: QueryParams, txId?: string): Promise<ApiResult<T>> {
    const url = new URL(`${this.baseUrl}/api/analytics${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: buildAuthHeaders(this.bearerToken, txId),
        signal: controller.signal,
      });

      const transactionId = response.headers.get("x-transaction-id");

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
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

