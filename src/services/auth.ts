export function buildAuthHeaders(bearerToken?: string, txId?: string): Record<string, string> {
  return {
    Accept: "application/json",
    ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    ...(txId ? { "X-Transaction-ID": txId } : {}),
  };
}

