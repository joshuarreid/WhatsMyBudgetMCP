import { FastMCP } from "fastmcp";
import { noArgsSchema } from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerHealthTool(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_health",
    description: "Verify connectivity to WhatsMyBudget analytics API.",
    schema: noArgsSchema,
    request: () => ({ path: "/periods" }),
  });
}

