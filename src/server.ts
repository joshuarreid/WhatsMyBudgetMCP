import { FastMCP } from "fastmcp";
import { WmbApiClient } from "./services/apiClient.js";
import { registerTools } from "./tools/index.js";

export function createServer(client: WmbApiClient): FastMCP {
  const server = new FastMCP({
    name: "whatsmybudget-analytics-mcp",
    version: "0.1.0",
    instructions:
      "Use these tools to fetch analytics from WhatsMyBudget. For all range tools, use YYYY-MM-DD dates.",
  });

  registerTools(server, client);
  return server;
}
