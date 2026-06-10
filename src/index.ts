import "dotenv/config";
import { WmbApiClient } from "./services/apiClient.js";
import { JwtAuthService } from "./services/jwtAuth.js";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

async function main() {
  const config = loadConfig();

  // Prefer JWT auth (v2) when WMB_PASSWORD is set; fall back to static bearer token
  const auth = config.password
    ? new JwtAuthService(config.baseUrl, config.password, config.timeoutMs)
    : config.bearerToken;

  if (config.password) {
    process.stderr.write(`Auth: JWT (POST /auth/login) against ${config.baseUrl}\n`);
  } else if (config.bearerToken) {
    process.stderr.write("Auth: static bearer token (legacy)\n");
  } else {
    process.stderr.write("Auth: none (unauthenticated)\n");
  }

  const apiClient = new WmbApiClient(config.baseUrl, auth, config.timeoutMs, config.apiPathPrefix);
  const server = createServer(apiClient);

  if (config.runtimeTransport.type === "httpStream") {
    const { host, port } = config.runtimeTransport;
    process.stderr.write(`Starting MCP server over HTTP stream on ${host}:${port}\n`);
    await server.start({
      transportType: "httpStream",
      httpStream: { host, port },
    });
    return;
  }

  process.stderr.write("Starting MCP server over stdio\n");
  await server.start({ transportType: "stdio" });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
