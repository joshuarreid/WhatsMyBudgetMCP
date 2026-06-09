import { FastMCP } from "fastmcp";
import { noArgsSchema } from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerMetadataTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_periods_list",
    title: "List Periods",
    description: "List available statement periods.",
    whenToUse: "Use when the user asks which statement periods are available or needs a valid period value.",
    triggerWords: ["available periods", "list periods", "what months exist"],
    schema: noArgsSchema,
    request: () => ({ path: "/periods" }),
  });

  addApiTool(server, client, {
    name: "analytics_categories_distinct_global",
    title: "Global Distinct Categories",
    description: "List distinct categories across all analytics data.",
    whenToUse: "Use when the user wants the set of all category names across the whole dataset.",
    triggerWords: ["all categories", "distinct categories", "category list"],
    schema: noArgsSchema,
    request: () => ({ path: "/categories/distinct" }),
  });
}

