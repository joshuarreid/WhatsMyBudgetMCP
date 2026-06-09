import { FastMCP } from "fastmcp";
import { noArgsSchema } from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerHealthTool(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_health",
    title: "API Health Check",
    description: "Verify connectivity to WhatsMyBudget analytics API.",
    whenToUse: "Use only for connectivity, uptime, or authorization checks.",
    triggerWords: ["health", "status", "connectivity", "is it working"],
    schema: noArgsSchema,
    request: () => ({ path: "/periods" }),
  });
}

