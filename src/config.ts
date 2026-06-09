import { z } from "zod";

const envSchema = z.object({
  WMB_API_BASE_URL: z.string().url(),
  WMB_BEARER_TOKEN: z.string().min(1).optional(),
  WMB_TRANSPORT: z.enum(["stdio", "httpStream"]).optional(),
  WMB_HTTP_HOST: z.string().min(1).optional(),
  PORT: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().int().positive().optional()),
  WMB_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 15000))
    .pipe(z.number().int().positive()),
});

export type RuntimeTransport =
  | {
      type: "stdio";
    }
  | {
      type: "httpStream";
      host: string;
      port: number;
    };

export type AppConfig = {
  baseUrl: string;
  bearerToken?: string;
  runtimeTransport: RuntimeTransport;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.parse(env);
  const selectedTransport = parsed.WMB_TRANSPORT ?? (parsed.PORT ? "httpStream" : "stdio");

  const runtimeTransport: RuntimeTransport =
    selectedTransport === "httpStream"
      ? {
          type: "httpStream",
          host: parsed.WMB_HTTP_HOST ?? "0.0.0.0",
          port: parsed.PORT ?? 8080,
        }
      : {
          type: "stdio",
        };

  return {
    baseUrl: parsed.WMB_API_BASE_URL.replace(/\/+$/, ""),
    bearerToken: parsed.WMB_BEARER_TOKEN,
    runtimeTransport,
    timeoutMs: parsed.WMB_TIMEOUT_MS,
  };
}

