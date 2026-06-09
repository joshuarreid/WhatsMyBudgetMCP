import "dotenv/config";
import { WmbApiClient } from "./services/apiClient.js";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

async function main() {
  const config = loadConfig();
  const apiClient = new WmbApiClient(config.baseUrl, config.bearerToken, config.timeoutMs);
  const server = createServer(apiClient);

  await server.start({ transportType: "stdio" });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
