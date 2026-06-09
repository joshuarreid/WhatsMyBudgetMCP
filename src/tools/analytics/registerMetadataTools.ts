import { FastMCP } from "fastmcp";
import { noArgsSchema } from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerMetadataTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_periods_list",
    description: "List available statement periods.",
    schema: noArgsSchema,
    request: () => ({ path: "/periods" }),
  });

  addApiTool(server, client, {
    name: "analytics_categories_distinct_global",
    description: "List distinct categories across all analytics data.",
    schema: noArgsSchema,
    request: () => ({ path: "/categories/distinct" }),
  });
}

