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
    title: "Range Overview",
    description: "Get totals and transaction count for a date range.",
    whenToUse: "Use for custom start/end date spend totals, counts, and overall range questions.",
    triggerWords: ["date range", "from", "to", "between", "overall spend", "range total"],
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/overview", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_categories",
    title: "Range Categories",
    description: "Get category breakdown for a date range.",
    whenToUse: "Use for category spending across a custom date range.",
    triggerWords: ["category breakdown", "range categories", "spending by category"],
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/categories", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_categories_top",
    title: "Range Top Categories",
    description: "Get top categories for a date range.",
    whenToUse: "Use for top-N category questions over a custom date range.",
    triggerWords: ["top categories", "highest categories", "ranked categories"],
    schema: rangeWithTopCategoryLimitSchema,
    request: (args) => ({ path: "/range/categories/top", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_accounts",
    title: "Range Accounts",
    description: "Get account breakdown for a date range.",
    whenToUse: "Use for account-level totals across a custom date range.",
    triggerWords: ["account breakdown", "by account", "range accounts"],
    schema: rangeAccountSchema,
    request: (args) => ({ path: "/range/accounts", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_payment_methods",
    title: "Range Payment Methods",
    description: "Get payment method breakdown for a date range.",
    whenToUse: "Use for payment-method totals across a custom date range.",
    triggerWords: ["payment methods", "cards", "cash", "range payment"],
    schema: rangePaymentMethodSchema,
    request: (args) => ({ path: "/range/payment-methods", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_criticality",
    title: "Range Criticality",
    description: "Get criticality breakdown for a date range.",
    whenToUse: "Use for criticality/severity breakdowns across a custom date range.",
    triggerWords: ["criticality", "severity", "range criticality"],
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/criticality", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_daily",
    title: "Range Daily Totals",
    description: "Get daily totals for a date range.",
    whenToUse: "Use when you need day-by-day totals within a custom date range.",
    triggerWords: ["daily totals", "by day", "day-by-day", "timeline"],
    schema: rangeFilterSchema,
    request: (args) => ({ path: "/range/daily", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_duplicates",
    title: "Range Duplicates",
    description: "Find duplicate row hash groups for a date range.",
    whenToUse: "Use to detect duplicate transaction groups in a custom date range.",
    triggerWords: ["duplicates", "duplicate rows", "duplicate transactions"],
    schema: rangeOnlySchema,
    request: (args) => ({ path: "/range/duplicates", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_uncategorized",
    title: "Range Uncategorized",
    description: "Get uncategorized transactions for a date range.",
    whenToUse: "Use to find uncategorized transactions in a custom date range.",
    triggerWords: ["uncategorized", "missing category", "unclassified"],
    schema: rangeOnlySchema,
    request: (args) => ({ path: "/range/uncategorized", query: args }),
  });

  addApiTool(server, client, {
    name: "analytics_range_outliers",
    title: "Range Outliers",
    description: "Get largest transactions in a date range.",
    whenToUse: "Use for largest or unusual transaction questions over a custom date range.",
    triggerWords: ["outliers", "largest transactions", "unusual spending", "biggest transactions"],
    schema: rangeWithOutlierLimitSchema,
    request: (args) => ({ path: "/range/outliers", query: args }),
  });
}

