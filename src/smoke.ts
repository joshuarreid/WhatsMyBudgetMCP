import "dotenv/config";
import { WmbApiClient } from "./services/apiClient.js";
import { loadConfig } from "./config.js";

async function main() {
  const config = loadConfig();
  const client = new WmbApiClient(config.baseUrl, config.bearerToken, config.timeoutMs);

  const result = await client.get<{ periods: string[]; count: number }>("/periods");
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        endpoint: "/api/analytics/periods",
        count: result.data.count,
        responseTransactionId: result.transactionId,
      },
      null,
      2
    )}\n`
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
