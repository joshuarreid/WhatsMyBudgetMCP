import { FastMCP } from "fastmcp";
import {
  rangeAccountSchema,
  rangeFilterSchema,
  rangeOnlySchema,
  rangePaymentMethodSchema,
  rangeWithOutlierLimitSchema,
  rangeWithTopCategoryLimitSchema,
} from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerRangeTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_range_overview",
    description: "Get totals and transaction count for a date range.",
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/overview", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_categories",
    description: "Get category breakdown for a date range.",
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/categories", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_categories_top",
    description: "Get top categories for a date range.",
    schema: rangeWithTopCategoryLimitSchema,
    request: (args) => ({ path: "/range/categories/top", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_accounts",
    description: "Get account breakdown for a date range.",
    schema: rangeAccountSchema,
    request: (args) => ({ path: "/range/accounts", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_payment_methods",
    description: "Get payment method breakdown for a date range.",
    schema: rangePaymentMethodSchema,
    request: (args) => ({ path: "/range/payment-methods", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_criticality",
    description: "Get criticality breakdown for a date range.",
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/criticality", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_daily",
    description: "Get daily totals for a date range.",
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/daily", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_duplicates",
    description: "Find duplicate row hash groups for a date range.",
    schema: rangeOnlySchema,
    request: (args) => ({ path: "/range/duplicates", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_uncategorized",
    description: "Get uncategorized transactions for a date range.",
    schema: rangeOnlySchema,
    request: (args) => ({ path: "/range/uncategorized", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_outliers",
    description: "Get largest transactions in a date range.",
    schema: rangeWithOutlierLimitSchema,
    request: (args) => ({ path: "/range/outliers", query: args }),
  });
}

