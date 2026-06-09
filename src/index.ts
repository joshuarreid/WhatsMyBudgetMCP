import "dotenv/config";
import { WmbApiClient } from "./services/apiClient.js";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

async function main() {
  const config = loadConfig();
  const apiClient = new WmbApiClient(config.baseUrl, config.bearerToken, config.timeoutMs);
  const server = createServer(apiClient);

  if (config.runtimeTransport.type === "httpStream") {
    const { host, port } = config.runtimeTransport;
    process.stderr.write(`Starting MCP server over HTTP stream on ${host}:${port}\n`);
    await server.start({
      transportType: "httpStream",
      httpStream: {
        host,
        port,
      },
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
