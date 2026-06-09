import { FastMCP } from "fastmcp";
import { periodOnlySchema, summariesRangeSchema } from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

const periodPreflightInstruction =
  "Call analytics_periods_list first to confirm requested periods exist. If any period is missing, ask the user to choose from available periods.";

export function registerSummaryTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_summary_by_period",
    title: "Statement Period Summary",
    description: "Get a persisted/live statement period summary.",
    beforeCalling: periodPreflightInstruction,
    whenToUse: "Use for a single month/statement period total, especially monthly spend questions.",
    triggerWords: ["monthly spend", "month total", "single period", "april 2026", "statement summary"],
    schema: periodOnlySchema,
    request: (args) => ({ path: `/summaries/${encodeURIComponent(args.period)}` }),
  });

  addApiTool(server, client, {
    name: "analytics_summaries_range",
    title: "Statement Summaries Range",
    description: "Get statement period summaries over an inclusive period range.",
    beforeCalling: periodPreflightInstruction,
    whenToUse: "Use for multiple statement periods or a span of months, not a single month total.",
    triggerWords: ["summary range", "multiple months", "period span", "from period", "to period"],
    schema: summariesRangeSchema,
    request: (args) => ({ path: "/summaries", query: args }),
  });
}

