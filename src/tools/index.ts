import { FastMCP } from "fastmcp";
import { WmbApiClient } from "../services/apiClient.js";
import { registerMetadataTools } from "./analytics/registerMetadataTools.js";
import { registerPeriodTools } from "./analytics/registerPeriodTools.js";
import { registerRangeTools } from "./analytics/registerRangeTools.js";
import { registerSummaryTools } from "./analytics/registerSummaryTools.js";
import { registerHealthTool } from "./health/registerHealthTool.js";

export function registerTools(server: FastMCP, client: WmbApiClient): number {
  registerHealthTool(server, client);
  registerMetadataTools(server, client);
  registerPeriodTools(server, client);
  registerRangeTools(server, client);
  registerSummaryTools(server, client);
  return 26;
}

