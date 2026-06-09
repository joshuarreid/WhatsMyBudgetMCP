import { FastMCP } from "fastmcp";
import { WmbApiClient } from "./services/apiClient.js";
import { registerTools } from "./tools/index.js";

export function createServer(client: WmbApiClient): FastMCP {
  const server = new FastMCP({
    health: {
      enabled: true,
      message: "ok",
      path: "/health",
      status: 200,
    },
    name: "whatsmybudget-analytics-mcp",
    version: "0.1.0",
    instructions:
      [
        "Use the most specific analytics tool that matches the user's request.",
        "For a single month or statement period total/spend question, prefer analytics_summary_by_period.",
        "For custom start/end dates, prefer analytics_range_overview and other range_* tools.",
        "For named statement period breakdowns, prefer analytics_period_* tools.",
        "Treat food as the combination of dining out and groceries when interpreting category questions.",
        "For food questions, prefer category breakdown tools and use dining out plus groceries as the matching categories.",
        "When a user asks about food, dining out, or groceries, route to period or range category tools rather than summary tools.",
        "For health/connectivity checks, use analytics_health only.",
        "For all range tools, use YYYY-MM-DD dates.",
      ].join(" "),
  });

  registerTools(server, client);
  return server;
}
