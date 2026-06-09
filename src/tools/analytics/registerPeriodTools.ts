import { FastMCP } from "fastmcp";
import {
  optionalFiltersSchema,
  periodAccountSchema,
  periodFilterSchema,
  periodOnlySchema,
  periodPaymentMethodSchema,
  periodWithOutlierLimitSchema,
  periodWithTopCategoryLimitSchema,
} from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerPeriodTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_period_overview",
    title: "Period Overview",
    description: "Get statement period totals and transaction count.",
    whenToUse: "Use for a named statement period total and count, especially when the user says a month or billing period.",
    triggerWords: ["statement period", "period total", "monthly overview", "april 2026", "month spend"],
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/overview`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_categories",
    title: "Period Categories",
    description: "Get category breakdown for a statement period.",
    whenToUse:
      "Use for category spending inside one statement period, including food questions where food should be interpreted as dining out plus groceries.",
    triggerWords: [
      "period categories",
      "monthly categories",
      "category breakdown",
      "food",
      "food spending",
      "dining out",
      "groceries",
    ],
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/categories`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_categories_distinct",
    title: "Period Distinct Categories",
    description: "List distinct categories in a statement period.",
    whenToUse: "Use to discover which categories exist in one statement period.",
    triggerWords: ["distinct categories", "list categories", "available categories"],
    schema: periodOnlySchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/categories/distinct`,
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_categories_top",
    title: "Period Top Categories",
    description: "Get top categories for a statement period.",
    whenToUse:
      "Use for top-N category questions inside one statement period, including food questions where food means dining out plus groceries.",
    triggerWords: ["top categories", "highest categories", "ranked categories", "food", "dining out", "groceries"],
    schema: periodWithTopCategoryLimitSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/categories/top`,
      query: {
        limit: args.limit,
        paymentMethod: args.paymentMethod,
        account: args.account,
      },
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_accounts",
    title: "Period Accounts",
    description: "Get account breakdown for a statement period.",
    whenToUse: "Use for account totals inside one statement period.",
    triggerWords: ["by account", "account breakdown", "statement accounts"],
    schema: periodAccountSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/accounts`,
      query: { paymentMethod: args.paymentMethod },
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_payment_methods",
    title: "Period Payment Methods",
    description: "Get payment method breakdown for a statement period.",
    whenToUse: "Use for payment-method totals inside one statement period.",
    triggerWords: ["payment methods", "cards", "cash", "statement payments"],
    schema: periodPaymentMethodSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/payment-methods`,
      query: { account: args.account },
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_criticality",
    title: "Period Criticality",
    description: "Get criticality breakdown for a statement period.",
    whenToUse: "Use for criticality/severity breakdowns inside one statement period.",
    triggerWords: ["criticality", "severity", "risk"],
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/criticality`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_daily",
    title: "Period Daily Totals",
    description: "Get daily totals for a statement period.",
    whenToUse: "Use when you need day-by-day totals within one statement period.",
    triggerWords: ["daily totals", "by day", "day-by-day", "timeline"],
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/daily`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_duplicates",
    title: "Period Duplicates",
    description: "Find duplicate row hash groups for a statement period.",
    whenToUse: "Use to detect duplicate transaction groups inside one statement period.",
    triggerWords: ["duplicates", "duplicate rows", "duplicate transactions"],
    schema: periodOnlySchema,
    request: (args) => ({ path: `/periods/${encodeURIComponent(args.period)}/duplicates` }),
  });

  addApiTool(server, client, {
    name: "analytics_period_uncategorized",
    title: "Period Uncategorized",
    description: "Get uncategorized transactions for a statement period.",
    whenToUse: "Use to find uncategorized transactions inside one statement period.",
    triggerWords: ["uncategorized", "missing category", "unclassified"],
    schema: periodOnlySchema,
    request: (args) => ({ path: `/periods/${encodeURIComponent(args.period)}/uncategorized` }),
  });

  addApiTool(server, client, {
    name: "analytics_period_outliers",
    title: "Period Outliers",
    description: "Get largest transactions in a statement period.",
    whenToUse: "Use for largest or unusual transaction questions inside one statement period.",
    triggerWords: ["outliers", "largest transactions", "unusual spending", "biggest transactions"],
    schema: periodWithOutlierLimitSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/outliers`,
      query: { limit: args.limit },
    }),
  });
}

