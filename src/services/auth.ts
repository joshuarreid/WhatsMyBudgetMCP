/** @deprecated Use JwtAuthService for v2 auth. This is retained for legacy/test use only. */
export function buildAuthHeaders(bearerToken?: string, txId?: string): Record<string, string> {
  return {
    Accept: "application/json",
    ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    ...(txId ? { "X-Transaction-ID": txId } : {}),
  };
}
