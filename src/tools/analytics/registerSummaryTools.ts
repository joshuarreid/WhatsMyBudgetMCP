import { FastMCP } from "fastmcp";
import { periodOnlySchema, summariesRangeSchema } from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerSummaryTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_summary_by_period",
    description: "Get a persisted/live statement period summary.",
    schema: periodOnlySchema,
    request: (args) => ({ path: `/summaries/${encodeURIComponent(args.period)}` }),
  });

  addApiTool(server, client, {
    name: "analytics_summaries_range",
    description: "Get statement period summaries over an inclusive period range.",
    schema: summariesRangeSchema,
    request: (args) => ({ path: "/summaries", query: args }),
  });
}

