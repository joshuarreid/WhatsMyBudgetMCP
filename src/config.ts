import { z } from "zod";

const envSchema = z.object({
  WMB_API_BASE_URL: z.string().url(),
  WMB_BEARER_TOKEN: z.string().min(1).optional(),
  WMB_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 15000))
    .pipe(z.number().int().positive()),
});

export type AppConfig = {
  baseUrl: string;
  bearerToken?: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.parse(env);
  return {
    baseUrl: parsed.WMB_API_BASE_URL.replace(/\/+$/, ""),
    bearerToken: parsed.WMB_BEARER_TOKEN,
    timeoutMs: parsed.WMB_TIMEOUT_MS,
  };
}

